export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);
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
  const allowedTargets = new Set(["cs", "sk", "de", "en"]);

  if (!allowedTargets.has(target)) {
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
    return jsonResponse(
      { error: "Google translation request failed", detail: errorText.slice(0, 500) },
      502
    );
  }

  const data = await googleResponse.json();
  const translated = data?.data?.translations;
  if (!Array.isArray(translated)) {
    return jsonResponse({ error: "Invalid response from translation provider" }, 502);
  }

  const translations = {};
  uniqueTexts.forEach((original, index) => {
    const translatedText = translated[index]?.translatedText;
    if (typeof translatedText === "string" && translatedText.trim()) {
      translations[original] = translatedText;
    }
  });

  return jsonResponse({ translations }, 200);
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
    return jsonResponse({ error: "Reservation email provider failed", detail: errorText.slice(0, 500) }, 502);
  }

  const providerResponse = await resendResponse.json().catch(() => ({}));
  return jsonResponse({ ok: true, provider: providerResponse }, 200);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
