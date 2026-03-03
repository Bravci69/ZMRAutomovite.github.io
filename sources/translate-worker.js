export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);
    if (url.pathname === "/api/cars") {
      return handleCars(request, env);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/translate") {
      return handleTranslate(request, env);
    }

    if (url.pathname === "/api/reservation") {
      return handleReservation(request, env);
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
};

async function handleCars(request, env) {
  if (!env.CARS_KV) {
    return jsonResponse({ error: "Missing CARS_KV binding" }, 500);
  }

  if (request.method === "GET") {
    const raw = await env.CARS_KV.get("cars");
    if (!raw) {
      return jsonResponse({ cars: [] }, 200);
    }
    try {
      const parsed = JSON.parse(raw);
      return jsonResponse({ cars: Array.isArray(parsed?.cars) ? parsed.cars : [] }, 200);
    } catch {
      return jsonResponse({ cars: [] }, 200);
    }
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const cars = Array.isArray(payload?.cars) ? payload.cars : null;
  if (!cars) {
    return jsonResponse({ error: "Missing cars array" }, 400);
  }

  const requestId = String(payload?.requestId || "unknown").trim();
  const source = String(payload?.source || "unknown").trim();
  const campaign = String(payload?.campaign || "unknown").trim();

  const readUpdatedAt = (car) => {
    const value = Number(car?.updatedAt);
    return Number.isFinite(value) && value > 0 ? value : 0;
  };

  let existingCars = [];
  try {
    const raw = await env.CARS_KV.get("cars");
    if (raw) {
      const parsed = JSON.parse(raw);
      existingCars = Array.isArray(parsed?.cars) ? parsed.cars : [];
    }
  } catch {
    existingCars = [];
  }

  const mergedById = new Map();
  const upsert = (car) => {
    if (!car || !car.id) {
      return;
    }
    const current = mergedById.get(car.id);
    if (!current || readUpdatedAt(car) >= readUpdatedAt(current)) {
      mergedById.set(car.id, car);
    }
  };

  existingCars.forEach(upsert);
  cars.forEach(upsert);
  const mergedCars = [...mergedById.values()];

  console.log("cars_sync_received", {
    requestId,
    source,
    campaign,
    count: cars.length,
    existingCount: existingCars.length,
  });

  await env.CARS_KV.put("cars", JSON.stringify({ cars: mergedCars, updatedAt: Date.now() }));

  console.log("cars_sync_saved", {
    requestId,
    source,
    campaign,
    count: mergedCars.length,
  });

  return jsonResponse({ ok: true, requestId, count: mergedCars.length }, 200);
}

async function handleTranslate(request, env) {
  if (!env.GOOGLE_TRANSLATE_API_KEY) {
    return jsonResponse({ error: "Missing GOOGLE_TRANSLATE_API_KEY secret" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const texts = Array.isArray(payload?.texts)
    ? payload.texts.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const target = String(payload?.target || "").trim().toLowerCase();
  const source = String(payload?.source || "unknown").trim();
  const campaign = String(payload?.campaign || "unknown").trim();
  const requestId = String(payload?.requestId || "unknown").trim();
  const allowedTargets = new Set(["cs", "sk", "de", "en"]);

  console.log("translate_request_received", {
    requestId,
    campaign,
    source,
    target,
    textCount: texts.length,
  });

  if (!allowedTargets.has(target)) {
    console.error("translate_request_invalid_target", { requestId, campaign, source, target });
    return jsonResponse({ error: "Unsupported target language" }, 400);
  }

  if (texts.length === 0) {
    return jsonResponse({ translations: {} }, 200);
  }

  const uniqueTexts = [...new Set(texts)].slice(0, 100);

  const googleResponse = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(env.GOOGLE_TRANSLATE_API_KEY)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: uniqueTexts,
        target,
        format: "text",
      }),
    }
  );

  if (!googleResponse.ok) {
    const errorText = await googleResponse.text();
    console.error("translate_provider_failed", {
      requestId,
      campaign,
      source,
      target,
      status: googleResponse.status,
    });
    return jsonResponse(
      { error: "Google translation request failed", detail: errorText.slice(0, 500) },
      502
    );
  }

  const data = await googleResponse.json();
  const translated = data?.data?.translations;
  if (!Array.isArray(translated)) {
    console.error("translate_provider_invalid_response", { requestId, campaign, source, target });
    return jsonResponse({ error: "Invalid response from translation provider" }, 502);
  }

  const translations = {};
  uniqueTexts.forEach((original, index) => {
    const translatedText = translated[index]?.translatedText;
    if (typeof translatedText === "string" && translatedText.trim()) {
      translations[original] = translatedText;
    }
  });

  console.log("translate_request_completed", {
    requestId,
    campaign,
    source,
    target,
    requested: uniqueTexts.length,
    translated: Object.keys(translations).length,
  });

  return jsonResponse({ translations, requestId }, 200);
}

async function handleReservation(request, env) {
  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: "Missing RESEND_API_KEY secret" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const toEmail = String(payload?.toEmail || env.RESERVATION_TO_EMAIL || "").trim();
  const subject = String(payload?.subject || "").trim();
  const text = String(payload?.text || "").trim();
  const fromEmail = String(env.RESERVATION_FROM_EMAIL || "").trim();

  if (!toEmail || !subject || !text || !fromEmail) {
    return jsonResponse({ error: "Missing required reservation email fields" }, 400);
  }

  const requesterEmail = String(payload?.form?.email || "").trim();
  const requesterName = [payload?.form?.firstName, payload?.form?.lastName].filter(Boolean).join(" ").trim();
  const requestId = String(payload?.requestId || "unknown").trim();
  const source = String(payload?.source || "unknown").trim();
  const campaign = String(payload?.campaign || "unknown").trim();
  const language = String(payload?.language || "unknown").trim().toLowerCase();
  const carId = String(payload?.car?.id || "unknown").trim();

  console.log("reservation_request_received", {
    requestId,
    campaign,
    source,
    language,
    carId,
    requesterEmail,
  });

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      text,
      reply_to: requesterEmail || undefined,
      headers: requesterName ? { "X-Reservation-Name": requesterName } : undefined,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("reservation_email_failed", {
      requestId,
      campaign,
      source,
      language,
      carId,
      status: resendResponse.status,
    });
    return jsonResponse({ error: "Reservation email provider failed", detail: errorText.slice(0, 500) }, 502);
  }

  const providerResponse = await resendResponse.json().catch(() => ({}));
  console.log("reservation_email_sent", {
    requestId,
    campaign,
    source,
    language,
    carId,
    providerId: providerResponse?.id || null,
  });
  return jsonResponse({ ok: true, provider: providerResponse, requestId }, 200);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}
