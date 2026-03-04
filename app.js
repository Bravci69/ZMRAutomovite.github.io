const { useEffect, useMemo, useRef, useState } = React;

const CARS_STORAGE_KEY = "zmrCars";
const CMS_AUTH_KEY = "zmrCmsAuth";
const LANGUAGE_STORAGE_KEY = "zmrLanguage";
const CZK_TO_EUR_RATE = 25;
const HORSEPOWER_MIN_FILTER = 256;
const CARS_PER_PAGE = 12;
const RESERVATION_EMAIL = "jakubchmura9@gmail.com";
const TRANSLATE_PROXY_URL = window.ZMR_TRANSLATE_PROXY_URL || "";
const FORM_SUBMIT_RESERVATION_URL = `https://formsubmit.co/ajax/${encodeURIComponent(RESERVATION_EMAIL)}`;
const RESERVATION_PROXY_URL = window.ZMR_RESERVATION_PROXY_URL || FORM_SUBMIT_RESERVATION_URL;
const CARS_API_URL = window.ZMR_CARS_API_URL || "/api/cars";
const FIREBASE_DB_URL = window.ZMR_FIREBASE_DB_URL || "";
const FIREBASE_CARS_PATH = window.ZMR_FIREBASE_CARS_PATH || "zmrCars";
const FIREBASE_AUTH_TOKEN = window.ZMR_FIREBASE_AUTH_TOKEN || "";
const FIRESTORE_PROJECT_ID = window.ZMR_FIRESTORE_PROJECT_ID || "";
const FIRESTORE_API_KEY = window.ZMR_FIRESTORE_API_KEY || "";
const FIRESTORE_DOCUMENT_PATH = window.ZMR_FIRESTORE_DOCUMENT_PATH || "zmrSync/cars";
let runtimeFirestoreIdToken = window.ZMR_FIRESTORE_ID_TOKEN || "";
const FIREBASE_AUTH_SESSION_KEY = "zmrFirebaseAuthSession";
const TRANSLATION_CACHE_KEY = "zmrTechnicalTranslations";
const VEHICLE_MAKES_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json";
const VEHICLE_MAKES_CACHE_KEY = "zmrVehicleMakesCache";
const VEHICLE_MAKES_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const SUPPORTED_LANG_CODES = ["cs", "sk", "de", "en"];
const FUEL_OPTIONS = ["Nafta", "Benzín", "Elektrina", "Plug-in hybrid", "Plyn"];
const DRIVE_OPTIONS = ["Všetky 4", "Predný", "Zadný"];
const TRANSMISSION_OPTIONS = ["Automat", "Manuál"];
const ORIGIN_TECHNICAL_VALUES = ["German version", "EU version", "Imported", "Domestic"];
const LANGUAGE_OPTIONS = [
    { code: "cs", flag: "🇨🇿", label: "Čeština" },
    { code: "sk", flag: "🇸🇰", label: "Slovenčina" },
    { code: "de", flag: "🇩🇪", label: "Deutsch" },
    { code: "en", flag: "🇬🇧", label: "English" }
];
const RESET_LABELS = {
    cs: "Vymazat filtry",
    sk: "Vymazať filtre",
    de: "Filter zurücksetzen",
    en: "Reset filters"
};
const RESULTS_LABELS = {
    cs: "výsledků",
    sk: "výsledkov",
    de: "Ergebnisse",
    en: "results"
};
const SERVICES_PAGE_CONTENT = {
    cs: {
        kpis: ["Reakce do 48 hodin", "Důkladné prověření vozidla", "Import USA/JPN", "Detailní report s fotodokumentací", "Individuální přístup"],
        highlightsTitle: "Co získáte v praxi",
        highlights: [
            { icon: "🛡️", title: "Prověřený technický stav", text: "Diagnostika, vizuální kontrola a vyhodnocení rizik před koupí." },
            { icon: "📑", title: "Jasná dokumentace", text: "Srozumitelný výstup s doporučením, prioritami a odhadem nákladů." },
            { icon: "🚚", title: "Import bez stresu", text: "Koordinace přepravy, formality a příprava na registraci i STK." }
        ],
        processTitle: "Jak spolupráce probíhá",
        processSteps: [
            { title: "1. Konzultace", text: "Upřesníme požadavky, rozpočet a vhodné modely." },
            { title: "2. Kontrola vozidla", text: "Důkladně prověříme technický stav, historii i reálnou tržní hodnotu vozidla." },
            { title: "3. Dovoz a administrativa", text: "Zajistíme logistiku, dokumenty a legislativní kroky." },
            { title: "4. Předání a podpora", text: "Předáme vozidlo připravené k provozu a poskytneme doporučení pro další servis a údržbu." }
        ],
        deliverablesTitle: "Výstupy služby",
        deliverables: ["Kontrolní report vozidla", "Detailní fotodokumentace", "Doporučení oprav podle priority", "Ověření historie a právního stavu", "Podpora při registraci a STK"],
        luxuryTitle: "Luxury varianta",
        luxuryPoints: ["VIP handling požadavku", "Prioritní termíny obhlídek", "Prémiová fotodokumentace", "Osobní konzultant po celou dobu"],
        luxuryButton: "Mám zájem o Luxury",
        luxurySubject: "Poptávka: Luxury varianta",
        luxuryBody: "Dobrý den,%0D%0A%0D%0Amám zájem o Luxury variantu služeb ZMR Automotive.%0D%0AProsím o kontakt a návrh dalšího postupu.%0D%0A%0D%0AJméno:%0D%0ATelefon:%0D%0AE-mail:%0D%0APreferovaný termín:%0D%0A",
        technicalTitle: "Technical varianta",
        technicalPoints: ["Měření a diagnostika řídicích jednotek", "Kontrola kritických komponent", "Detailní risk-score report", "Návrh servisního plánu po koupi"],
        technicalButton: "Mám zájem o Technical",
        technicalSubject: "Poptávka: Technical varianta",
        technicalBody: "Dobrý den,%0D%0A%0D%0Amám zájem o Technical variantu služeb ZMR Automotive.%0D%0AProsím o kontakt a návrh technického postupu.%0D%0A%0D%0AJméno:%0D%0ATelefon:%0D%0AE-mail:%0D%0ATyp vozidla / VIN (volitelné):%0D%0A",
        customButton: "Chci individuální nabídku",
        customSubject: "Poptávka: Individuální nabídka",
        customBody: "Dobrý den,%0D%0A%0D%0Aprosím o individuální nabídku služeb ZMR Automotive podle mých požadavků.%0D%0A%0D%0APopis požadavku:%0D%0A%0D%0AJméno:%0D%0ATelefon:%0D%0AE-mail:%0D%0A",
        ctaTitle: "Potřebujete konzultaci k vozu?",
        ctaText: "Pošlete poptávku a připravíme konkrétní postup podle vaší situace.",
        ctaButton: "Kontaktovat nás"
    },
    sk: {
        kpis: ["Reakcia do 48 hodín", "Dôkladné preverenie vozidla", "Import USA/JPN", "Detailný report s fotodokumentáciou", "Individuálny prístup"],
        highlightsTitle: "Čo získate v praxi",
        highlights: [
            { icon: "🛡️", title: "Overený technický stav", text: "Diagnostika, vizuálna kontrola a vyhodnotenie rizík pred kúpou." },
            { icon: "📑", title: "Jasná dokumentácia", text: "Zrozumiteľný výstup s odporúčaniami, prioritami a odhadom nákladov." },
            { icon: "🚚", title: "Dovoz bez stresu", text: "Koordinácia prepravy, administratívy a prípravy na registráciu aj STK." }
        ],
        processTitle: "Ako prebieha spolupráca",
        processSteps: [
            { title: "1. Konzultácia", text: "Spresníme požiadavky, rozpočet a vhodné modely." },
            { title: "2. Kontrola vozidla", text: "Dôkladne preveríme technický stav, históriu aj reálnu trhovú hodnotu vozidla." },
            { title: "3. Dovoz a administratíva", text: "Zabezpečíme logistiku, dokumenty a legislatívne kroky." },
            { title: "4. Odovzdanie a podpora", text: "Vozidlo odovzdáme pripravené na prevádzku a doplníme odporúčania pre ďalší servis a údržbu." }
        ],
        deliverablesTitle: "Výstupy služby",
        deliverables: ["Kontrolný report vozidla", "Detailná fotodokumentácia", "Odporúčanie opráv podľa priority", "Overenie histórie a právneho stavu", "Podpora pri registrácii a STK"],
        luxuryTitle: "Luxury variant",
        luxuryPoints: ["VIP vybavenie dopytu", "Prioritné termíny obhliadok", "Prémiová fotodokumentácia", "Osobný konzultant počas celého procesu"],
        luxuryButton: "Mám záujem o Luxury",
        luxurySubject: "Dopyt: Luxury variant",
        luxuryBody: "Dobrý deň,%0D%0A%0D%0Amám záujem o Luxury variant služieb ZMR Automotive.%0D%0AProsím o kontakt a návrh ďalšieho postupu.%0D%0A%0D%0AMeno:%0D%0ATelefón:%0D%0AE-mail:%0D%0APreferovaný termín:%0D%0A",
        technicalTitle: "Technical variant",
        technicalPoints: ["Merania a diagnostika riadiacich jednotiek", "Kontrola kritických komponentov", "Detailný risk-score report", "Návrh servisného plánu po kúpe"],
        technicalButton: "Mám záujem o Technical",
        technicalSubject: "Dopyt: Technical variant",
        technicalBody: "Dobrý deň,%0D%0A%0D%0Amám záujem o Technical variant služieb ZMR Automotive.%0D%0AProsím o kontakt a návrh technického postupu.%0D%0A%0D%0AMeno:%0D%0ATelefón:%0D%0AE-mail:%0D%0ATyp vozidla / VIN (voliteľné):%0D%0A",
        customButton: "Chcem individuálnu ponuku",
        customSubject: "Dopyt: Individuálna ponuka",
        customBody: "Dobrý deň,%0D%0A%0D%0Aprosím o individuálnu ponuku služieb ZMR Automotive podľa mojich požiadaviek.%0D%0A%0D%0APopis požiadavky:%0D%0A%0D%0AMeno:%0D%0ATelefón:%0D%0AE-mail:%0D%0A",
        ctaTitle: "Potrebujete konzultáciu k vozidlu?",
        ctaText: "Pošlite dopyt a pripravíme konkrétny postup podľa vašej situácie.",
        ctaButton: "Kontaktovať nás"
    },
    de: {
        kpis: ["Reaktion innerhalb von 48 Stunden", "Gründliche Fahrzeugprüfung", "Import USA/JPN", "Detaillierter Bericht mit Fotodokumentation", "Individuelle Betreuung"],
        highlightsTitle: "Ihr konkreter Mehrwert",
        highlights: [
            { icon: "🛡️", title: "Geprüfter technischer Zustand", text: "Diagnose, Sichtprüfung und Risikobewertung vor dem Kauf." },
            { icon: "📑", title: "Klare Dokumentation", text: "Verständlicher Bericht mit Prioritäten und Kosteneinschätzung." },
            { icon: "🚚", title: "Import ohne Stress", text: "Koordination von Transport, Formalitäten und Zulassungsvorbereitung." }
        ],
        processTitle: "So läuft die Zusammenarbeit",
        processSteps: [
            { title: "1. Beratung", text: "Wir klären Anforderungen, Budget und passende Modelle." },
            { title: "2. Fahrzeugprüfung", text: "Wir prüfen den technischen Zustand, die Historie und den realistischen Marktwert des Fahrzeugs im Detail." },
            { title: "3. Import & Formalitäten", text: "Wir übernehmen Logistik, Unterlagen und rechtliche Schritte." },
            { title: "4. Übergabe & Support", text: "Wir übergeben das Fahrzeug betriebsbereit und geben klare Empfehlungen für Service und Wartung." }
        ],
        deliverablesTitle: "Leistungsumfang im Ergebnis",
        deliverables: ["Detaillierter Prüfbericht", "Fotodokumentation im Detail", "Empfehlung von Reparaturen nach Priorität", "Prüfung von Historie und Rechtsstatus", "Unterstützung bei Zulassung und HU/STK"],
        luxuryTitle: "Luxury-Variante",
        luxuryPoints: ["VIP-Betreuung der Anfrage", "Priorisierte Besichtigungstermine", "Premium-Fotodokumentation", "Persönlicher Berater im gesamten Prozess"],
        luxuryButton: "Interesse an Luxury",
        luxurySubject: "Anfrage: Luxury-Variante",
        luxuryBody: "Guten Tag,%0D%0A%0D%0Aich habe Interesse an der Luxury-Variante von ZMR Automotive.%0D%0ABitte kontaktieren Sie mich mit einem Vorschlag für die nächsten Schritte.%0D%0A%0D%0AName:%0D%0ATelefon:%0D%0AE-Mail:%0D%0ABevorzugter Termin:%0D%0A",
        technicalTitle: "Technical-Variante",
        technicalPoints: ["Steuergeräte-Diagnose und Messwerte", "Prüfung kritischer Komponenten", "Detaillierter Risk-Score-Report", "Serviceplan-Empfehlung nach Kauf"],
        technicalButton: "Interesse an Technical",
        technicalSubject: "Anfrage: Technical-Variante",
        technicalBody: "Guten Tag,%0D%0A%0D%0Aich habe Interesse an der Technical-Variante von ZMR Automotive.%0D%0ABitte kontaktieren Sie mich mit einem technischen Vorgehensvorschlag.%0D%0A%0D%0AName:%0D%0ATelefon:%0D%0AE-Mail:%0D%0AFahrzeugtyp / VIN (optional):%0D%0A",
        customButton: "Individuelles Angebot",
        customSubject: "Anfrage: Individuelles Angebot",
        customBody: "Guten Tag,%0D%0A%0D%0Aich bitte um ein individuelles Angebot von ZMR Automotive entsprechend meiner Anforderungen.%0D%0A%0D%0ABeschreibung der Anfrage:%0D%0A%0D%0AName:%0D%0ATelefon:%0D%0AE-Mail:%0D%0A",
        ctaTitle: "Benötigen Sie eine Fahrzeugberatung?",
        ctaText: "Senden Sie uns Ihre Anfrage und wir erstellen einen klaren nächsten Schritt.",
        ctaButton: "Kontakt aufnehmen"
    },
    en: {
        kpis: ["Response within 48 hours", "Thorough vehicle inspection", "USA/JPN import", "Detailed report with photo documentation", "Individual approach"],
        highlightsTitle: "What you get",
        highlights: [
            { icon: "🛡️", title: "Verified technical condition", text: "Diagnostics, visual inspection and risk assessment before purchase." },
            { icon: "📑", title: "Clear documentation", text: "Actionable report with priorities and estimated follow-up costs." },
            { icon: "🚚", title: "Import without stress", text: "Transport, paperwork and registration-readiness handled end-to-end." }
        ],
        processTitle: "How we work",
        processSteps: [
            { title: "1. Consultation", text: "We define your requirements, budget and model shortlist." },
            { title: "2. Vehicle inspection", text: "We thoroughly verify technical condition, history, and real market value." },
            { title: "3. Import & administration", text: "We handle logistics, documents and compliance steps." },
            { title: "4. Handover & support", text: "You receive a road-ready vehicle with practical recommendations for service and maintenance." }
        ],
        deliverablesTitle: "Service deliverables",
        deliverables: ["Vehicle inspection report", "Detailed photo documentation", "Priority-based repair recommendations", "History and legal-status verification", "Support for registration and STK/TÜV readiness"],
        luxuryTitle: "Luxury variant",
        luxuryPoints: ["VIP request handling", "Priority inspection slots", "Premium photo documentation", "Dedicated consultant throughout the process"],
        luxuryButton: "I want Luxury",
        luxurySubject: "Inquiry: Luxury variant",
        luxuryBody: "Hello,%0D%0A%0D%0AI am interested in the Luxury variant of ZMR Automotive services.%0D%0APlease contact me with the next-step proposal.%0D%0A%0D%0AName:%0D%0APhone:%0D%0AEmail:%0D%0APreferred date:%0D%0A",
        technicalTitle: "Technical variant",
        technicalPoints: ["ECU diagnostics and measurements", "Critical-component checks", "Detailed risk-score reporting", "Post-purchase service-plan recommendation"],
        technicalButton: "I want Technical",
        technicalSubject: "Inquiry: Technical variant",
        technicalBody: "Hello,%0D%0A%0D%0AI am interested in the Technical variant of ZMR Automotive services.%0D%0APlease contact me with a technical next-step proposal.%0D%0A%0D%0AName:%0D%0APhone:%0D%0AEmail:%0D%0AVehicle type / VIN (optional):%0D%0A",
        customButton: "I want a custom offer",
        customSubject: "Inquiry: Custom offer",
        customBody: "Hello,%0D%0A%0D%0APlease prepare a custom service offer from ZMR Automotive based on my requirements.%0D%0A%0D%0ARequest details:%0D%0A%0D%0AName:%0D%0APhone:%0D%0AEmail:%0D%0A",
        ctaTitle: "Need advice for a specific car?",
        ctaText: "Send us your request and we will prepare a concrete next-step plan.",
        ctaButton: "Contact us"
    }
};
const AUTO_RESET_FILTERS_LABELS = {
    cs: "Filtry byly automaticky resetovány, aby se zobrazila všechna vozidla.",
    sk: "Filtre boli automaticky resetované, aby sa zobrazili všetky vozidlá.",
    de: "Filter wurden automatisch zurückgesetzt, damit alle Fahrzeuge angezeigt werden.",
    en: "Filters were reset automatically to show all vehicles."
};

const TECHNICAL_CHECKLIST_FIELDS = [
    { label: "Vehicle condition", defaultValue: "Used vehicle", defaultIcon: "🚗" },
    { label: "Origin", defaultValue: "German version", defaultIcon: "🌍" },
    { label: "Mileage", defaultValue: "", defaultIcon: "📍" },
    { label: "Performance", defaultValue: "", defaultIcon: "⚡" },
    { label: "Drive type", defaultValue: "", defaultIcon: "🛞" },
    { label: "Fuel type", defaultValue: "", defaultIcon: "⛽" },
    { label: "Number of seats", defaultValue: "", defaultIcon: "💺" },
    { label: "Number of doors", defaultValue: "", defaultIcon: "🚪" },
    { label: "Gearbox", defaultValue: "", defaultIcon: "🕹️" },
    { label: "Number of vehicle owners", defaultValue: "", defaultIcon: "👤" }
];

const TECHNICAL_NUMERIC_FIELD_LABELS = new Set(["Mileage", "Performance", "Number of seats", "Number of doors", "Number of vehicle owners"]);

const TECHNICAL_ICON_TRANSLATIONS = {
    "🚗": { cs: "Vozidlo", sk: "Vozidlo", de: "Fahrzeug", en: "Vehicle" },
    "🌍": { cs: "Původ", sk: "Pôvod", de: "Herkunft", en: "Origin" },
    "📍": { cs: "Nájezd", sk: "Nájazd", de: "Kilometerstand", en: "Mileage" },
    "⚡": { cs: "Výkon", sk: "Výkon", de: "Leistung", en: "Performance" },
    "🛞": { cs: "Pohon", sk: "Pohon", de: "Antrieb", en: "Drive" },
    "⛽": { cs: "Palivo", sk: "Palivo", de: "Kraftstoff", en: "Fuel" },
    "💺": { cs: "Sedadla", sk: "Sedadlá", de: "Sitze", en: "Seats" },
    "🚪": { cs: "Dveře", sk: "Dvere", de: "Türen", en: "Doors" },
    "🕹️": { cs: "Převodovka", sk: "Prevodovka", de: "Getriebe", en: "Gearbox" },
    "👤": { cs: "Majitel", sk: "Majiteľ", de: "Besitzer", en: "Owner" },
    "🧾": { cs: "Technické údaje", sk: "Technické údaje", de: "Technische Daten", en: "Technical data" },
    "🔧": { cs: "Servis", sk: "Servis", de: "Service", en: "Service" },
    "📊": { cs: "Parametry", sk: "Parametre", de: "Parameter", en: "Parameters" },
    "🛡️": { cs: "Bezpečnost", sk: "Bezpečnosť", de: "Sicherheit", en: "Safety" }
};

const EQUIPMENT_CHECKLIST_ITEMS = [
    "ABS",
    "ESP",
    "ASR",
    "Airbags",
    "Isofix",
    "Navigation system",
    "Bluetooth",
    "Apple CarPlay",
    "Android Auto",
    "Cruise control",
    "Parking sensors",
    "Rear camera",
    "LED headlights",
    "Automatic climate control",
    "Heated seats",
    "Leather seats",
    "Electric windows",
    "Keyless entry",
    "Sunroof",
    "Towbar"
];

const EQUIPMENT_ITEM_TRANSLATIONS = {
    "ABS": { cs: "ABS", sk: "ABS", de: "ABS", en: "ABS" },
    "ESP": { cs: "ESP", sk: "ESP", de: "ESP", en: "ESP" },
    "ASR": { cs: "ASR", sk: "ASR", de: "ASR", en: "ASR" },
    "Airbags": { cs: "Airbagy", sk: "Airbagy", de: "Airbags", en: "Airbags" },
    "Isofix": { cs: "Isofix", sk: "Isofix", de: "Isofix", en: "Isofix" },
    "Navigation system": { cs: "Navigační systém", sk: "Navigačný systém", de: "Navigationssystem", en: "Navigation system" },
    "Bluetooth": { cs: "Bluetooth", sk: "Bluetooth", de: "Bluetooth", en: "Bluetooth" },
    "Apple CarPlay": { cs: "Apple CarPlay", sk: "Apple CarPlay", de: "Apple CarPlay", en: "Apple CarPlay" },
    "Android Auto": { cs: "Android Auto", sk: "Android Auto", de: "Android Auto", en: "Android Auto" },
    "Cruise control": { cs: "Tempomat", sk: "Tempomat", de: "Tempomat", en: "Cruise control" },
    "Parking sensors": { cs: "Parkovací senzory", sk: "Parkovacie senzory", de: "Parksensoren", en: "Parking sensors" },
    "Rear camera": { cs: "Zadní kamera", sk: "Zadná kamera", de: "Rückfahrkamera", en: "Rear camera" },
    "LED headlights": { cs: "LED světlomety", sk: "LED svetlomety", de: "LED-Scheinwerfer", en: "LED headlights" },
    "Automatic climate control": { cs: "Automatická klimatizace", sk: "Automatická klimatizácia", de: "Klimaautomatik", en: "Automatic climate control" },
    "Heated seats": { cs: "Vyhřívaná sedadla", sk: "Vyhrievané sedadlá", de: "Sitzheizung", en: "Heated seats" },
    "Leather seats": { cs: "Kožená sedadla", sk: "Kožené sedadlá", de: "Ledersitze", en: "Leather seats" },
    "Electric windows": { cs: "Elektrická okna", sk: "Elektrické okná", de: "Elektrische Fensterheber", en: "Electric windows" },
    "Keyless entry": { cs: "Bezklíčový přístup", sk: "Bezkľúčový prístup", de: "Keyless Entry", en: "Keyless entry" },
    "Sunroof": { cs: "Střešní okno", sk: "Strešné okno", de: "Schiebedach", en: "Sunroof" },
    "Towbar": { cs: "Tažné zařízení", sk: "Ťažné zariadenie", de: "Anhängerkupplung", en: "Towbar" }
};

const EQUIPMENT_ITEM_TRANSLATIONS_BY_KEY = Object.fromEntries(
    Object.entries(EQUIPMENT_ITEM_TRANSLATIONS).map(([key, translation]) => [String(key).trim().toLowerCase(), translation])
);

const EQUIPMENT_CANONICAL_BY_KEY = Object.entries(EQUIPMENT_ITEM_TRANSLATIONS).reduce((accumulator, [canonical, translations]) => {
    accumulator[String(canonical).trim().toLowerCase()] = canonical;
    Object.values(translations || {}).forEach((value) => {
        accumulator[String(value).trim().toLowerCase()] = canonical;
    });
    return accumulator;
}, {});

const TECHNICAL_LABEL_TRANSLATIONS = {
    "Vehicle condition": { cs: "Stav vozidla", sk: "Stav vozidla", de: "Fahrzeugzustand", en: "Vehicle condition" },
    "Category": { cs: "Kategorie", sk: "Kategória", de: "Kategorie", en: "Category" },
    "Series": { cs: "Řada", sk: "Séria", de: "Baureihe", en: "Series" },
    "Equipment line": { cs: "Výbavová linie", sk: "Výbavová línia", de: "Ausstattungslinie", en: "Equipment line" },
    "Vehicle number": { cs: "Číslo vozidla", sk: "Číslo vozidla", de: "Fahrzeugnummer", en: "Vehicle number" },
    "Origin": { cs: "Původ", sk: "Pôvod", de: "Herkunft", en: "Origin" },
    "Mileage": { cs: "Nájezd", sk: "Nájazd", de: "Kilometerstand", en: "Mileage" },
    "Displacement": { cs: "Objem", sk: "Objem", de: "Hubraum", en: "Displacement" },
    "Performance": { cs: "Výkon", sk: "Výkon", de: "Leistung", en: "Performance" },
    "Drive type": { cs: "Typ pohonu", sk: "Typ pohonu", de: "Antriebsart", en: "Drive type" },
    "Fuel type": { cs: "Palivo", sk: "Palivo", de: "Kraftstoffart", en: "Fuel type" },
    "Energy consumption (comb.)": { cs: "Spotřeba energie (komb.)", sk: "Spotreba energie (komb.)", de: "Energieverbrauch (komb.)", en: "Energy consumption (comb.)" },
    "CO2 emissions (comb.)": { cs: "Emise CO2 (komb.)", sk: "Emisie CO2 (komb.)", de: "CO2-Emissionen (komb.)", en: "CO2 emissions (comb.)" },
    "Fuel consumption": { cs: "Spotřeba paliva", sk: "Spotreba paliva", de: "Kraftstoffverbrauch", en: "Fuel consumption" },
    "Number of seats": { cs: "Počet sedadel", sk: "Počet sedadiel", de: "Anzahl Sitze", en: "Number of seats" },
    "Number of doors": { cs: "Počet dveří", sk: "Počet dverí", de: "Anzahl Türen", en: "Number of doors" },
    "Gearbox": { cs: "Převodovka", sk: "Prevodovka", de: "Getriebe", en: "Gearbox" },
    "Pollutant class": { cs: "Emisní třída", sk: "Emisná trieda", de: "Schadstoffklasse", en: "Pollutant class" },
    "Environmental plaque": { cs: "Ekologická plaketa", sk: "Ekologická plaketa", de: "Umweltplakette", en: "Environmental plaque" },
    "First registration": { cs: "První registrace", sk: "Prvá registrácia", de: "Erstzulassung", en: "First registration" },
    "Number of vehicle owners": { cs: "Počet majitelů", sk: "Počet majiteľov", de: "Anzahl Fahrzeughalter", en: "Number of vehicle owners" },
    "HU": { cs: "STK", sk: "STK", de: "HU", en: "HU" },
    "Air conditioning": { cs: "Klimatizace", sk: "Klimatizácia", de: "Klimaanlage", en: "Air conditioning" },
    "Parking assistance": { cs: "Parkovací asistence", sk: "Parkovacia asistencia", de: "Einparkhilfe", en: "Parking assistance" },
    "Airbags": { cs: "Airbagy", sk: "Airbagy", de: "Airbags", en: "Airbags" },
    "Colour (manufacturer)": { cs: "Barva (výrobce)", sk: "Farba (výrobca)", de: "Farbe (Hersteller)", en: "Colour (manufacturer)" },
    "Colour": { cs: "Barva", sk: "Farba", de: "Farbe", en: "Colour" },
    "Interior equipment": { cs: "Interiér", sk: "Interiér", de: "Innenausstattung", en: "Interior equipment" },
    "Towbar braked": { cs: "Tažné (brzděné)", sk: "Ťažné (brzdené)", de: "Anhängelast gebremst", en: "Towbar braked" },
    "Towing load unchecked": { cs: "Tažné (nebrzděné)", sk: "Ťažné (nebrzdené)", de: "Anhängelast ungebremst", en: "Towing load unchecked" },
    "Weight": { cs: "Hmotnost", sk: "Hmotnosť", de: "Gewicht", en: "Weight" },
    "Cylinder": { cs: "Počet válců", sk: "Počet valcov", de: "Zylinder", en: "Cylinder" },
    "Tank size": { cs: "Objem nádrže", sk: "Objem nádrže", de: "Tankvolumen", en: "Tank size" }
};

const TECHNICAL_VALUE_TRANSLATIONS = {
    "Used vehicle": { cs: "Ojeté vozidlo", sk: "Jazdené vozidlo", de: "Gebrauchtfahrzeug", en: "Used vehicle" },
    "Demonstration vehicle": { cs: "Předváděcí vozidlo", sk: "Predvádzacie vozidlo", de: "Vorführfahrzeug", en: "Demonstration vehicle" },
    "Accident-free": { cs: "Nehavarované", sk: "Nehavarované", de: "Unfallfrei", en: "Accident-free" },
    "Service book": { cs: "Servisní knížka", sk: "Servisná knižka", de: "Scheckheft", en: "Service book" },
    "First owner": { cs: "První majitel", sk: "Prvý majiteľ", de: "Erstbesitz", en: "First owner" },
    "Second owner": { cs: "Druhý majitel", sk: "Druhý majiteľ", de: "Zweitbesitz", en: "Second owner" },
    "German version": { cs: "Německá verze", sk: "Nemecká verzia", de: "Deutsche Version", en: "German version" },
    "EU version": { cs: "EU verze", sk: "EU verzia", de: "EU-Version", en: "EU version" },
    "Imported": { cs: "Dovezené", sk: "Dovezené", de: "Importiert", en: "Imported" },
    "Domestic": { cs: "Tuzemské", sk: "Tuzemské", de: "Inland", en: "Domestic" },
    "Combustion engine": { cs: "Spalovací motor", sk: "Spaľovací motor", de: "Verbrennungsmotor", en: "Combustion engine" },
    "Hybrid": { cs: "Hybrid", sk: "Hybrid", de: "Hybrid", en: "Hybrid" },
    "Plug-in hybrid": { cs: "Plug-in hybrid", sk: "Plug-in hybrid", de: "Plug-in-Hybrid", en: "Plug-in hybrid" },
    "Available": { cs: "Dostupné", sk: "Dostupné", de: "Verfügbar", en: "Available" },
    "Unavailable": { cs: "Nedostupné", sk: "Nedostupné", de: "Nicht verfügbar", en: "Unavailable" },
    "Reserved": { cs: "Rezervováno", sk: "Rezervované", de: "Reserviert", en: "Reserved" },
    "Yes": { cs: "Ano", sk: "Áno", de: "Ja", en: "Yes" },
    "No": { cs: "Ne", sk: "Nie", de: "Nein", en: "No" },
    "Gasoline": { cs: "Benzín", sk: "Benzín", de: "Benzin", en: "Gasoline" },
    "Petrol": { cs: "Benzín", sk: "Benzín", de: "Benzin", en: "Petrol" },
    "Diesel": { cs: "Nafta", sk: "Nafta", de: "Diesel", en: "Diesel" },
    "Electric": { cs: "Elektřina", sk: "Elektrina", de: "Elektrisch", en: "Electric" },
    "Plug in hybrid": { cs: "Plug-in hybrid", sk: "Plug-in hybrid", de: "Plug-in-Hybrid", en: "Plug-in hybrid" },
    "LPG": { cs: "Plyn", sk: "Plyn", de: "Gas", en: "LPG" },
    "CNG": { cs: "CNG", sk: "CNG", de: "CNG", en: "CNG" },
    "All-wheel drive": { cs: "Všechny 4", sk: "Všetky 4", de: "Allrad", en: "All-wheel drive" },
    "4x4": { cs: "Všechny 4", sk: "Všetky 4", de: "Allrad", en: "4x4" },
    "Front-wheel drive": { cs: "Přední", sk: "Predný", de: "Frontantrieb", en: "Front-wheel drive" },
    "Front": { cs: "Přední", sk: "Predný", de: "Front", en: "Front" },
    "Rear-wheel drive": { cs: "Zadní", sk: "Zadný", de: "Heckantrieb", en: "Rear-wheel drive" },
    "Rear": { cs: "Zadní", sk: "Zadný", de: "Heck", en: "Rear" },
    "Automatic": { cs: "Automat", sk: "Automat", de: "Automatik", en: "Automatic" },
    "Automatic transmission": { cs: "Automatická převodovka", sk: "Automatická prevodovka", de: "Automatikgetriebe", en: "Automatic transmission" },
    "Manual": { cs: "Manuál", sk: "Manuál", de: "Manuell", en: "Manual" },
    "Manual transmission": { cs: "Manuální převodovka", sk: "Manuálna prevodovka", de: "Schaltgetriebe", en: "Manual transmission" },
    "New": { cs: "Nová", sk: "Nová", de: "Neu", en: "New" },
    "Euro 5": { cs: "Euro 5", sk: "Euro 5", de: "Euro 5", en: "Euro 5" },
    "Euro 6": { cs: "Euro 6", sk: "Euro 6", de: "Euro 6", en: "Euro 6" },
    "Euro 6d": { cs: "Euro 6d", sk: "Euro 6d", de: "Euro 6d", en: "Euro 6d" },
    "Green": { cs: "Zelená", sk: "Zelená", de: "Grün", en: "Green" },
    "Red": { cs: "Červená", sk: "Červená", de: "Rot", en: "Red" },
    "Black": { cs: "Černá", sk: "Čierna", de: "Schwarz", en: "Black" },
    "White": { cs: "Bílá", sk: "Biela", de: "Weiß", en: "White" },
    "Blue": { cs: "Modrá", sk: "Modrá", de: "Blau", en: "Blue" },
    "Silver": { cs: "Stříbrná", sk: "Strieborná", de: "Silber", en: "Silver" },
    "Grey Metallic": { cs: "Šedá metalíza", sk: "Sivá metalíza", de: "Grau Metallic", en: "Grey Metallic" },
    "Full leather, Black": { cs: "Plná kůže, černá", sk: "Plná koža, čierna", de: "Vollleder, Schwarz", en: "Full leather, Black" }
};

const TECHNICAL_VALUE_TRANSLATIONS_BY_KEY = Object.fromEntries(
    Object.entries(TECHNICAL_VALUE_TRANSLATIONS).map(([key, translation]) => [String(key).trim().toLowerCase(), translation])
);

const TECHNICAL_LABEL_CANONICAL_BY_KEY = Object.entries(TECHNICAL_LABEL_TRANSLATIONS).reduce((accumulator, [canonical, translations]) => {
    accumulator[String(canonical).trim().toLowerCase()] = canonical;
    Object.values(translations || {}).forEach((value) => {
        accumulator[String(value).trim().toLowerCase()] = canonical;
    });
    return accumulator;
}, {});

const pendingTechnicalTranslationRequests = new Map();

const I18N = {
    cs: {
        nav: { home: "Domů", about: "O nás", services: "Služby", cars: "Vozidla", contact: "Kontakt", cms: "CMS" },
        common: {
            language: "Jazyk",
            statusAvailable: "Dostupné",
            statusUnavailable: "Momentálně nedostupné",
            price: "Cena",
            horsepowerUnit: "k",
            doorsUnit: "dveří"
        },
        pages: {
            home: { title: "ZMR Automotive", subtitle: "Komplexní kontrola a dovoz vozidel z USA, Japonska i EU bez kompromisů." },
            about: { title: "O nás", subtitle: "Technická odbornost, transparentnost a řízené rozhodování při nákupu vozidla." },
            services: { title: "Služby", subtitle: "Prémiově řízené řešení kontroly, dovozu a přípravy vozidla na provoz." },
            cars: { title: "Nabídka vozidel", subtitle: "Přehled aktuálně dostupných vozidel s detailním popisem stavu, výbavy a legislativních informací." },
            carDetail: { title: "Detail vozidla", subtitle: "Kompletní informace o vybraném vozidle včetně legislativy a výbavy." },
            contact: { title: "Kontakt", subtitle: "Jsme připraveni pomoci s kontrolou, dovozem i výběrem vhodného vozidla." },
            cms: { title: "CMS vozidel", subtitle: "Interní zóna pro správu nabídky vozidel." }
        },
        home: {
            whyTitle: "Proč si vybrat ZMR Automotive",
            whyP1: "ZMR Automotive je tým tří mladých mužů, které spojuje vášeň pro automobily, technické znalosti a důraz na férové jednání.",
            whyP2: "Specializujeme se na dovoz vozidel z USA a Japonska a zároveň na profesionální kontrolu vozidel po celé České republice i v sousedních státech.",
            whyP3: "Každý projekt vedeme od prvního kontaktu transparentně: definujeme rozsah, vysvětlíme rizika, nastavíme kroky a držíme vás v obraze během celého procesu.",
            whyP4: "Naším cílem je minimální riziko při nákupu a maximální jistota rozhodnutí – bez zbytečných komplikací, s důrazem na kvalitu a dlouhodobou spokojenost.",
            approachTitle: "Komplexní a moderní přístup",
            approachText: "Výběr vozu, prověření historie, technická kontrola, dovoz, administrativa i příprava na provoz na jednom místě.",
            outputTitle: "Výstup, kterému rozumíte",
            outputText: "Dostanete detailní report s fotodokumentací, jasná doporučení a konkrétní další kroky podle vašeho rozpočtu i priorit.",
            kpiTitle: "Rychlý přehled",
            kpis: ["Reakce do 48 hodin", "Kontroly v ČR i zahraničí", "Import USA/JPN", "Detailní report s fotodokumentací"],
            pillarsTitle: "Co získáte navíc",
            pillars: [
                { title: "Strategické doporučení", text: "Pomůžeme vybrat variantu, která dává smysl technicky i finančně." },
                { title: "Transparentní komunikace", text: "Během celého procesu máte jasný přehled o stavu, rizicích i dalších krocích." },
                { title: "Podpora po převzetí", text: "Po předání vozu navrhneme servisní priority a plán údržby." }
            ],
            workflowTitle: "Jak spolupráce probíhá",
            workflowSteps: [
                { title: "1. Úvodní konzultace", text: "Upřesníme typ vozidla, rozpočet i očekávání." },
                { title: "2. Ověření a kontrola", text: "Prověříme historii, technický stav a reálnou hodnotu." },
                { title: "3. Dovoz a administrativa", text: "Zajistíme logistiku, dokumenty i legislativní kroky." },
                { title: "4. Předání a další plán", text: "Vůz předáme připravený k provozu s doporučením další péče." }
            ],
            ctaTitle: "Řešíte konkrétní vozidlo?",
            ctaText: "Pošlete nám zadání a navrhneme jasný postup podle vašich priorit.",
            ctaPrimary: "Zobrazit služby",
            ctaSecondary: "Nezávazně nás kontaktovat"
        },
        about: {
            title: "O naší společnosti",
            p1: "ZMR Automotive je tým tří mladých mužů, které spojuje vášeň pro automobily, technické znalosti a důraz na férové jednání.",
            p2: "Specializujeme se na dovoz vozidel z USA a Japonska a zároveň na profesionální kontrolu jakýchkoliv vozidel po celé České republice i v sousedních státech.",
            locationTitle: "Naše lokalita – Praha",
            locationText: "Základnu máme v Praze a služby poskytujeme klientům z celé ČR i okolních států."
        },
        services: {
            title: "Rozsah služeb",
            intro: "Postaráme se o celý proces dovozu vozidla z Japonska nebo USA – od výběru, kontroly a nákupu až po dopravu a registraci v ČR. Nabízíme také profesionální prověření vozidel v České republice i zahraničí před jejich koupí.",
            items: [
                { title: "Důkladné prověření vozidla", text: "Provádíme detailní prověrky před koupí, diagnostiku, kontrolu karoserie i mechanických částí." },
                { title: "Kontroly v ČR i zahraničí", text: "Prověřujeme osobní, užitková i sportovní vozidla po celé ČR i v zahraničí." },
                { title: "Dovoz z USA a Japonska", text: "Zajistíme výběr, prověření, nákup, přepravu i kompletní administrativu dovozu." },
                { title: "Základní servis a STK", text: "Před předáním vozidlo technicky připravíme a zajistíme STK." },
                { title: "Vlastní nabídka vozidel", text: "Pravidelně nabízíme prověřená vozidla s transparentní historií." }
            ]
        },
        contact: {
            title: "Kontakt",
            p1: "Pokud řešíte koupi, kontrolu nebo dovoz vozidla, rádi navrhneme vhodný postup.",
            processTitle: "Průběh spolupráce",
            processText: "Po přijetí poptávky připravíme plán, realizujeme kontrolu nebo dovoz a předáme doporučení pro další postup."
        },
        cars: {
            filterTitle: "Vyhledávání a filtry",
            search: "Vyhledávání",
            searchPlaceholder: "Model, značka, náhon...",
            fuel: "Palivo",
            fuelAll: "Všechna paliva",
            brand: "Značka",
            brandAll: "Všechny značky",
            drive: "Náhon",
            driveAll: "Všechny náhony",
            transmission: "Převodovka",
            transmissionAll: "Všechny převodovky",
            hpFrom: "Výkon od (k)",
            hpTo: "Výkon do (k)",
            doors: "Dveře",
            doorsAll: "Všechny",
            seats: "Sedadla",
            seatsAll: "Všechny",
            seatsFrom: "Sedadla od",
            seatsTo: "Sedadla do",
            quickSeats: "Rychlé sedadla",
            seatsUnit: "sedadel",
            activeFilters: "Aktivní filtry",
            clearAll: "Zrušit vše",
            detailButton: "Detail vozidla",
            noResults: "Pro zadané filtry nebyla nalezena žádná vozidla."
        },
        carDetail: {
            notFoundTitle: "Vozidlo nebylo nalezeno",
            notFoundText: "Momentálně není dostupné žádné vozidlo. Zkuste to prosím později.",
            technicalTitle: "Technické údaje",
            legalTitle: "Legislativní informace",
            equipmentTitle: "Výbava",
            previousOwners: "Počet předchozích majitelů"
        },
        cms: {
            loginTitle: "CMS přihlášení",
            loginInfo: "Přístup pro zaměstnance. Přihlaste se firemním e-mailem a heslem.",
            username: "E-mail",
            password: "Heslo",
            loginButton: "Přihlásit se",
            loginError: "Nesprávné přihlašovací údaje.",
            requiredDriveFuel: "Palivo a náhon jsou povinné.",
            manualGearsRequired: "U manuálu je povinné zadat počet převodů.",
            manageTitle: "Správa vozidel",
            logoutButton: "Odhlásit se",
            intro: "Můžete přidávat nová vozidla, nahrát fotku, vyplnit popis, legislativní informace i výbavu.",
            technicalHelp: "Formát: každý řádek jako Název: Hodnota",
            equipmentHelp: "Každý řádek = 1 položka výbavy",
            fields: {
                name: "Model vozidla",
                brand: "Značka",
                year: "Rok výroby",
                priceCzk: "Cena (v Kč)",
                mileage: "Nájezd",
                horsepower: "Výkon (k)",
                doors: "Počet dveří",
                seats: "Počet sedadel",
                previousOwners: "Počet předchozích majitelů",
                drive: "Náhon",
                fuel: "Palivo",
                transmission: "Převodovka",
                manualGears: "Počet převodů",
                image: "Fotka vozidla",
                description: "Základní popis",
                legal: "Legislativní informace",
                equipment: "Výbava",
                technicalDataRaw: "Technická data (Název: Hodnota)",
                equipmentItemsRaw: "Výbava (1 položka na řádek)",
                available: "Vozidlo je dostupné"
            },
            addButton: "Přidat vozidlo",
            currentCars: "Aktuální vozidla",
            toggleAvailability: "Změnit dostupnost",
            remove: "Odstranit"
        }
    },
    sk: {
        nav: { home: "Domov", about: "O nás", services: "Služby", cars: "Vozidlá", contact: "Kontakt", cms: "CMS" },
        common: { language: "Jazyk", statusAvailable: "Dostupné", statusUnavailable: "Momentálne nedostupné", price: "Cena", horsepowerUnit: "k", doorsUnit: "dverí" },
        pages: {
            home: { title: "ZMR Automotive", subtitle: "Komplexná kontrola a dovoz vozidiel z USA, Japonska aj EÚ bez kompromisov." },
            about: { title: "O nás", subtitle: "Skúsenosti, transparentnosť a dôraz na bezpečný nákup vozidla." },
            services: { title: "Služby", subtitle: "Komplexné riešenia kontroly, dovozu a prípravy vozidla na prevádzku." },
            cars: { title: "Ponuka vozidiel", subtitle: "Prehľad aktuálne dostupných vozidiel s detailným popisom stavu, výbavy a legislatívnych informácií." },
            carDetail: { title: "Detail vozidla", subtitle: "Kompletné informácie o vybranom vozidle vrátane legislatívy a výbavy." },
            contact: { title: "Kontakt", subtitle: "Sme pripravení pomôcť s kontrolou, dovozom aj výberom vhodného vozidla." },
            cms: { title: "CMS vozidiel", subtitle: "Interná zóna pre správu ponuky vozidiel." }
        },
        home: {
            whyTitle: "Prečo si vybrať ZMR Automotive",
            whyP1: "ZMR Automotive je tím troch mladých mužov, ktorých spája vášeň pre autá, technické znalosti a dôraz na férový prístup.",
            whyP2: "Špecializujeme sa na dovoz vozidiel z USA a Japonska a zároveň na profesionálnu kontrolu vozidiel po celom Česku aj v susedných štátoch.",
            whyP3: "Každý projekt vedieme transparentne od prvého kontaktu: nastavíme rozsah, vysvetlíme riziká, definujeme kroky a priebežne vás informujeme.",
            whyP4: "Naším cieľom je minimálne riziko pri kúpe a maximálna istota rozhodnutia – bez zbytočných komplikácií, s dôrazom na kvalitu a dlhodobú spokojnosť.",
            approachTitle: "Komplexný a moderný prístup",
            approachText: "Výber vozidla, preverenie histórie, technická kontrola, dovoz, administratíva aj príprava na prevádzku na jednom mieste.",
            outputTitle: "Výstup, ktorému rozumiete",
            outputText: "Dostanete detailný report s fotodokumentáciou, jasné odporúčania a konkrétne ďalšie kroky podľa vášho rozpočtu aj priorít.",
            kpiTitle: "Rýchly prehľad",
            kpis: ["Reakcia do 48 hodín", "Kontroly v ČR aj zahraničí", "Import USA/JPN", "Detailný report s fotodokumentáciou"],
            pillarsTitle: "Čo získate navyše",
            pillars: [
                { title: "Strategické odporúčanie", text: "Pomôžeme vybrať riešenie, ktoré dáva technický aj finančný zmysel." },
                { title: "Transparentná komunikácia", text: "Počas celého procesu máte jasný prehľad o stave, rizikách aj ďalších krokoch." },
                { title: "Podpora po prevzatí", text: "Po odovzdaní vozidla navrhneme servisné priority a plán údržby." }
            ],
            workflowTitle: "Ako prebieha spolupráca",
            workflowSteps: [
                { title: "1. Úvodná konzultácia", text: "Spresníme typ vozidla, rozpočet aj očakávania." },
                { title: "2. Overenie a kontrola", text: "Preveríme históriu, technický stav aj reálnu hodnotu." },
                { title: "3. Dovoz a administratíva", text: "Zabezpečíme logistiku, dokumenty aj legislatívne kroky." },
                { title: "4. Odovzdanie a ďalší plán", text: "Vozidlo odovzdáme pripravené na prevádzku s odporúčaním ďalšej starostlivosti." }
            ],
            ctaTitle: "Riešite konkrétne vozidlo?",
            ctaText: "Pošlite nám zadanie a navrhneme jasný postup podľa vašich priorít.",
            ctaPrimary: "Zobraziť služby",
            ctaSecondary: "Nezáväzne nás kontaktovať"
        },
        about: {
            title: "O našej spoločnosti",
            p1: "ZMR Automotive je tím troch mladých mužov, ktorých spája vášeň pre autá, technické znalosti a dôraz na férový prístup.",
            p2: "Špecializujeme sa na dovoz vozidiel z USA a Japonska a zároveň na profesionálnu kontrolu akýchkoľvek vozidiel po celom Česku aj v susedných štátoch.",
            locationTitle: "Naša lokalita – Praha",
            locationText: "Základňu máme v Prahe, no projekty riešime pre klientov z celej ČR, Slovenska aj okolitých krajín podľa typu vozidla a požadovaného rozsahu služby."
        },
        services: {
            title: "Rozsah služieb",
            intro: "Postaráme sa o celý proces dovozu vozidla z Japonska alebo USA – od výberu, kontroly a nákupu až po dopravu a registráciu v ČR. Ponúkame aj profesionálne preverenie vozidiel v Českej republike aj v zahraničí pred ich kúpou.",
            items: [
                { title: "Dôkladné preverenie vozidla", text: "Realizujeme detailné preverenie pred kúpou, diagnostiku, kontrolu karosérie aj mechanických častí." },
                { title: "Kontroly v ČR aj zahraničí", text: "Preverujeme osobné, úžitkové aj športové vozidlá po celej ČR aj v zahraničí." },
                { title: "Dovoz z USA a Japonska", text: "Zabezpečíme výber, preverenie, nákup, prepravu aj kompletnú administratívu dovozu." },
                { title: "Základný servis a STK", text: "Pred odovzdaním vozidlo technicky pripravíme a zabezpečíme STK." },
                { title: "Vlastná ponuka vozidiel", text: "Pravidelne ponúkame preverené vozidlá s transparentnou históriou." }
            ]
        },
        contact: {
            title: "Kontakt",
            p1: "Ak riešite kúpu, kontrolu alebo dovoz vozidla, radi navrhneme vhodný postup.",
            processTitle: "Priebeh spolupráce",
            processText: "Po prijatí dopytu pripravíme plán, realizujeme kontrolu alebo dovoz a odovzdáme odporúčania."
        },
        cars: {
            filterTitle: "Vyhľadávanie a filtre", search: "Vyhľadávanie", searchPlaceholder: "Model, značka, náhon...", fuel: "Palivo", fuelAll: "Všetky palivá", brand: "Značka", brandAll: "Všetky značky", drive: "Náhon", driveAll: "Všetky náhony", transmission: "Prevodovka", transmissionAll: "Všetky prevodovky", hpFrom: "Výkon od (k)", hpTo: "Výkon do (k)", doors: "Dvere", doorsAll: "Všetky", seats: "Sedadlá", seatsAll: "Všetky", seatsFrom: "Sedadlá od", seatsTo: "Sedadlá do", quickSeats: "Rýchle sedadlá", seatsUnit: "sedadiel", activeFilters: "Aktívne filtre", clearAll: "Zrušiť všetko", detailButton: "Detail vozidla", noResults: "Pre zadané filtre sa nenašli žiadne vozidlá."
        },
        carDetail: { notFoundTitle: "Vozidlo sa nenašlo", notFoundText: "Momentálne nie je dostupné žiadne vozidlo. Skúste to prosím neskôr.", technicalTitle: "Technické údaje", legalTitle: "Legislatívne informácie", equipmentTitle: "Výbava", previousOwners: "Počet predošlých majiteľov" },
        cms: {
            loginTitle: "CMS prihlásenie", loginInfo: "Prístup pre zamestnancov. Prihláste sa firemným e-mailom a heslom.", username: "E-mail", password: "Heslo", loginButton: "Prihlásiť sa", loginError: "Nesprávne prihlasovacie údaje.", requiredDriveFuel: "Palivo a náhon sú povinné.", manualGearsRequired: "Pri manuáli je povinné zadať počet prevodov.", manageTitle: "Správa vozidiel", logoutButton: "Odhlásiť sa", intro: "Tu môžete pridávať nové autá, nahrávať fotku, vyplniť popis, legislatívne informácie a výbavu.", technicalHelp: "Formát: každý riadok ako Názov: Hodnota", equipmentHelp: "Každý riadok = 1 položka výbavy",
            fields: { name: "Model vozidla", brand: "Značka", year: "Rok výroby", priceCzk: "Cena (v Kč)", mileage: "Nájazd", horsepower: "Výkon (k)", doors: "Počet dverí", seats: "Počet sedadiel", previousOwners: "Počet predošlých majiteľov", drive: "Náhon", fuel: "Palivo", transmission: "Prevodovka", manualGears: "Počet prevodov", image: "Fotka vozidla", description: "Základný popis", legal: "Legislatívne informácie", equipment: "Výbava", technicalDataRaw: "Technické údaje (Názov: Hodnota)", equipmentItemsRaw: "Výbava (1 položka na riadok)", available: "Vozidlo je dostupné" },
            addButton: "Pridať vozidlo", currentCars: "Aktuálne vozidlá", toggleAvailability: "Zmeniť dostupnosť", remove: "Odstrániť"
        }
    },
    de: {
        nav: { home: "Start", about: "Über uns", services: "Leistungen", cars: "Fahrzeuge", contact: "Kontakt", cms: "CMS" },
        common: { language: "Sprache", statusAvailable: "Verfügbar", statusUnavailable: "Derzeit nicht verfügbar", price: "Preis", horsepowerUnit: "PS", doorsUnit: "Türen" },
        pages: {
            home: { title: "ZMR Automotive", subtitle: "Professionelle Fahrzeugprüfung und Import aus den USA, Japan und der EU ohne Kompromisse." },
            about: { title: "Über uns", subtitle: "Technische Expertise, Transparenz und datenbasierte Entscheidungen beim Fahrzeugkauf." },
            services: { title: "Leistungen", subtitle: "Premium-gesteuerte Lösungen für Prüfung, Import und Fahrzeugvorbereitung." },
            cars: { title: "Fahrzeugangebot", subtitle: "Übersicht der verfügbaren Fahrzeuge mit detaillierten Informationen." },
            carDetail: { title: "Fahrzeugdetails", subtitle: "Vollständige Informationen zu Fahrzeug, Ausstattung und Rechtlichem." },
            contact: { title: "Kontakt", subtitle: "Wir unterstützen Sie bei Prüfung, Import und Auswahl des passenden Fahrzeugs." },
            cms: { title: "Fahrzeug-CMS", subtitle: "Interner Bereich zur Verwaltung des Fahrzeugangebots." }
        },
        home: {
            whyTitle: "Warum ZMR Automotive",
            whyP1: "ZMR Automotive ist ein Team aus drei jungen Männern, verbunden durch Leidenschaft für Autos, technisches Know-how und einen fairen Ansatz.",
            whyP2: "Wir sind auf den Fahrzeugimport aus den USA und Japan spezialisiert und führen gleichzeitig professionelle Fahrzeugprüfungen in ganz Tschechien und den Nachbarländern durch.",
            whyP3: "Jedes Projekt führen wir transparent ab dem ersten Kontakt: Wir definieren den Umfang, erklären Risiken, setzen die nächsten Schritte auf und halten Sie laufend informiert.",
            whyP4: "Unser Ziel ist minimales Kauf-Risiko und maximale Entscheidungssicherheit – ohne unnötige Komplikationen, mit Fokus auf Qualität und langfristige Zufriedenheit.",
            approachTitle: "Komplexer und moderner Ansatz",
            approachText: "Fahrzeugauswahl, Historienprüfung, technische Kontrolle, Import, Administration und Vorbereitung auf den Betrieb aus einer Hand.",
            outputTitle: "Ein Ergebnis, das Sie verstehen",
            outputText: "Sie erhalten einen detaillierten Bericht mit Fotodokumentation, klare Empfehlungen und konkrete nächste Schritte passend zu Budget und Prioritäten.",
            kpiTitle: "Schnellüberblick",
            kpis: ["Reaktion innerhalb von 48 Stunden", "Prüfungen in Tschechien und im Ausland", "Import USA/JPN", "Detaillierter Bericht mit Fotodokumentation"],
            pillarsTitle: "Ihr zusätzlicher Mehrwert",
            pillars: [
                { title: "Strategische Empfehlung", text: "Wir helfen bei der Wahl der Variante, die technisch und wirtschaftlich passt." },
                { title: "Transparente Kommunikation", text: "Während des gesamten Projekts kennen Sie Status, Risiken und nächste Schritte." },
                { title: "Support nach Übergabe", text: "Nach der Übergabe erhalten Sie klare Service-Prioritäten und einen Wartungsplan." }
            ],
            workflowTitle: "So läuft die Zusammenarbeit",
            workflowSteps: [
                { title: "1. Erstgespräch", text: "Wir klären Fahrzeugtyp, Budget und Erwartungen." },
                { title: "2. Prüfung & Bewertung", text: "Wir prüfen Historie, technischen Zustand und realistischen Marktwert." },
                { title: "3. Import & Formalitäten", text: "Wir übernehmen Logistik, Unterlagen und rechtliche Schritte." },
                { title: "4. Übergabe & Planung", text: "Sie erhalten ein fahrbereites Fahrzeug mit klarem Plan für die nächsten Schritte." }
            ],
            ctaTitle: "Geht es um ein konkretes Fahrzeug?",
            ctaText: "Senden Sie uns Ihr Briefing und wir schlagen den klaren nächsten Schritt vor.",
            ctaPrimary: "Leistungen ansehen",
            ctaSecondary: "Unverbindlich kontaktieren"
        },
        about: {
            title: "Über unser Unternehmen",
            p1: "ZMR Automotive ist ein Team aus drei jungen Männern, verbunden durch Leidenschaft für Autos, technisches Know-how und einen fairen Ansatz.",
            p2: "Wir sind auf den Fahrzeugimport aus den USA und Japan spezialisiert und bieten zugleich professionelle Prüfungen aller Fahrzeugtypen in ganz Tschechien und den Nachbarländern an.",
            locationTitle: "Unser Standort – Prag",
            locationText: "Unser Sitz ist in Prag, wir betreuen Kunden in ganz Tschechien und den umliegenden Ländern."
        },
        services: {
            title: "Leistungsumfang",
            intro: "Wir übernehmen den gesamten Importprozess aus Japan oder den USA – von Auswahl, Prüfung und Kauf bis zu Transport und Zulassung in Tschechien. Zusätzlich bieten wir professionelle Fahrzeugprüfungen in Tschechien und im Ausland vor dem Kauf an.",
            items: [
                { title: "Gründliche Fahrzeugprüfung", text: "Wir führen detaillierte Vorkaufprüfungen, Diagnostik sowie Kontrollen von Karosserie und Mechanik durch." },
                { title: "Prüfungen in Tschechien und im Ausland", text: "Wir prüfen Pkw, Nutzfahrzeuge und Sportwagen in ganz Tschechien sowie im Ausland." },
                { title: "Import aus USA und Japan", text: "Wir übernehmen Auswahl, Prüfung, Kauf, Transport und die komplette Import-Administration." },
                { title: "Basisservice und HU/STK", text: "Vor der Übergabe bereiten wir das Fahrzeug technisch vor und sichern die HU/STK-Vorbereitung ab." },
                { title: "Eigenes Fahrzeugangebot", text: "Regelmäßig bieten wir geprüfte Fahrzeuge mit transparenter Historie an." }
            ]
        },
        contact: { title: "Kontakt", p1: "Bei Kauf, Prüfung oder Import unterstützen wir Sie gerne.", processTitle: "Ablauf", processText: "Nach Ihrer Anfrage erstellen wir einen Plan und liefern klare Empfehlungen." },
        cars: { filterTitle: "Suche und Filter", search: "Suche", searchPlaceholder: "Modell, Marke, Antrieb...", fuel: "Kraftstoff", fuelAll: "Alle Kraftstoffe", brand: "Marke", brandAll: "Alle Marken", drive: "Antrieb", driveAll: "Alle Antriebe", transmission: "Getriebe", transmissionAll: "Alle Getriebe", hpFrom: "Leistung von (PS)", hpTo: "Leistung bis (PS)", doors: "Türen", doorsAll: "Alle", seats: "Sitze", seatsAll: "Alle", seatsFrom: "Sitze ab", seatsTo: "Sitze bis", quickSeats: "Schnellauswahl", seatsUnit: "Sitze", activeFilters: "Aktive Filter", clearAll: "Alle löschen", detailButton: "Fahrzeugdetails", noResults: "Für die gewählten Filter wurden keine Fahrzeuge gefunden." },
        carDetail: { notFoundTitle: "Fahrzeug nicht gefunden", notFoundText: "Aktuell ist kein Fahrzeug verfügbar.", technicalTitle: "Technische Daten", legalTitle: "Rechtliche Informationen", equipmentTitle: "Ausstattung", previousOwners: "Anzahl Vorbesitzer" },
        cms: {
            loginTitle: "CMS-Anmeldung", loginInfo: "Mitarbeiterzugang. Bitte mit Firmen-E-Mail und Passwort anmelden.", username: "E-Mail", password: "Passwort", loginButton: "Anmelden", loginError: "Falsche Anmeldedaten.", requiredDriveFuel: "Kraftstoff und Antrieb sind Pflichtfelder.", manualGearsRequired: "Bei manuellem Getriebe ist die Anzahl der Gänge erforderlich.", manageTitle: "Fahrzeugverwaltung", logoutButton: "Abmelden", intro: "Hier können Sie Fahrzeuge hinzufügen und bearbeiten.", technicalHelp: "Format: jede Zeile als Bezeichnung: Wert", equipmentHelp: "Jede Zeile = 1 Ausstattungsmerkmal",
            fields: { name: "Modell", brand: "Marke", year: "Baujahr", priceCzk: "Preis (in CZK)", mileage: "Kilometerstand", horsepower: "Leistung (PS)", doors: "Anzahl Türen", seats: "Anzahl Sitze", previousOwners: "Anzahl Vorbesitzer", drive: "Antrieb", fuel: "Kraftstoff", transmission: "Getriebe", manualGears: "Anzahl Gänge", image: "Fahrzeugfoto", description: "Kurzbeschreibung", legal: "Rechtliche Informationen", equipment: "Ausstattung", technicalDataRaw: "Technische Daten (Bezeichnung: Wert)", equipmentItemsRaw: "Ausstattung (1 Punkt pro Zeile)", available: "Fahrzeug ist verfügbar" },
            addButton: "Fahrzeug hinzufügen", currentCars: "Aktuelle Fahrzeuge", toggleAvailability: "Verfügbarkeit ändern", remove: "Entfernen"
        }
    },
    en: {
        nav: { home: "Home", about: "About", services: "Services", cars: "Cars", contact: "Contact", cms: "CMS" },
        common: { language: "Language", statusAvailable: "Available", statusUnavailable: "Currently unavailable", price: "Price", horsepowerUnit: "hp", doorsUnit: "doors" },
        pages: {
            home: { title: "ZMR Automotive", subtitle: "Premium vehicle inspection and import from the USA, Japan and EU without compromise." },
            about: { title: "About Us", subtitle: "Technical expertise, transparency, and data-driven decisions for safer vehicle purchases." },
            services: { title: "Services", subtitle: "Premium managed solutions for inspection, import, and vehicle readiness." },
            cars: { title: "Vehicle Offer", subtitle: "Overview of currently available vehicles with detailed information." },
            carDetail: { title: "Vehicle Detail", subtitle: "Complete vehicle details including legal info and equipment." },
            contact: { title: "Contact", subtitle: "We are ready to help with inspection, import and vehicle selection." },
            cms: { title: "Vehicle CMS", subtitle: "Internal area for managing vehicle inventory." }
        },
        home: {
            whyTitle: "Why choose ZMR Automotive",
            whyP1: "ZMR Automotive is a team of three young professionals connected by passion for cars, technical expertise, and a fair approach.",
            whyP2: "We specialize in importing vehicles from the USA and Japan while also providing professional vehicle inspections across Czechia and neighboring countries.",
            whyP3: "Every project is run transparently from the first contact: we define scope, explain risks, set clear steps, and keep you informed throughout the process.",
            whyP4: "Our goal is minimal purchase risk and maximum decision confidence—without unnecessary complications, with a focus on quality and long-term satisfaction.",
            approachTitle: "Comprehensive modern approach",
            approachText: "Vehicle selection, history verification, technical inspection, import, administration, and road-readiness in one place.",
            outputTitle: "Output you can understand",
            outputText: "You receive a detailed report with photo documentation, clear recommendations, and concrete next steps aligned with your budget and priorities.",
            kpiTitle: "Quick overview",
            kpis: ["Response within 48 hours", "Inspections in Czechia and abroad", "USA/JPN import", "Detailed report with photo documentation"],
            pillarsTitle: "Additional value you get",
            pillars: [
                { title: "Strategic recommendation", text: "We help you choose the option that is technically and financially sound." },
                { title: "Transparent communication", text: "You always see status, risks, and next steps throughout the project." },
                { title: "Post-handover support", text: "After delivery, we provide clear service priorities and a maintenance plan." }
            ],
            workflowTitle: "How the cooperation works",
            workflowSteps: [
                { title: "1. Initial consultation", text: "We define vehicle type, budget, and expectations." },
                { title: "2. Verification and checks", text: "We verify history, technical condition, and real market value." },
                { title: "3. Import and administration", text: "We handle logistics, paperwork, and compliance steps." },
                { title: "4. Handover and next plan", text: "You receive a road-ready vehicle with a clear follow-up plan." }
            ],
            ctaTitle: "Do you have a specific vehicle in mind?",
            ctaText: "Send us your brief and we will propose a concrete next-step plan.",
            ctaPrimary: "View services",
            ctaSecondary: "Contact us"
        },
        about: {
            title: "About our company",
            p1: "ZMR Automotive is a team of three young professionals connected by passion for cars, technical expertise, and a fair approach.",
            p2: "We specialize in importing vehicles from the USA and Japan and also provide professional inspections of all vehicle types across Czechia and neighboring countries.",
            locationTitle: "Our location – Prague",
            locationText: "We are based in Prague and provide services to clients across Czechia and nearby countries."
        },
        services: {
            title: "Service scope",
            intro: "We handle the full process of importing a vehicle from Japan or the USA—from selection, verification, and purchase to transport and registration in Czechia. We also provide professional pre-purchase inspections in Czechia and abroad.",
            items: [
                { title: "Thorough vehicle verification", text: "We perform detailed pre-purchase checks, diagnostics, and body/mechanical inspections." },
                { title: "Inspections in Czechia and abroad", text: "We verify passenger, commercial, and sports vehicles across Czechia and internationally." },
                { title: "Import from USA and Japan", text: "We manage selection, verification, purchase, transport, and complete import administration." },
                { title: "Basic service and STK preparation", text: "Before handover, we prepare the vehicle technically and ensure STK readiness." },
                { title: "Own vehicle inventory", text: "We regularly offer verified vehicles with transparent history." }
            ]
        },
        contact: { title: "Contact", p1: "If you are buying, inspecting or importing a car, we can help.", processTitle: "Cooperation process", processText: "After receiving your request, we prepare a plan and provide recommendations." },
        cars: { filterTitle: "Search and filters", search: "Search", searchPlaceholder: "Model, brand, drive...", fuel: "Fuel", fuelAll: "All fuels", brand: "Brand", brandAll: "All brands", drive: "Drive", driveAll: "All drive types", transmission: "Transmission", transmissionAll: "All transmissions", hpFrom: "Power from (hp)", hpTo: "Power to (hp)", doors: "Doors", doorsAll: "All", seats: "Seats", seatsAll: "All", seatsFrom: "Seats from", seatsTo: "Seats to", quickSeats: "Quick seats", seatsUnit: "seats", activeFilters: "Active filters", clearAll: "Clear all", detailButton: "Vehicle detail", noResults: "No vehicles found for the selected filters." },
        carDetail: { notFoundTitle: "Vehicle not found", notFoundText: "There are currently no vehicles available.", technicalTitle: "Technical data", legalTitle: "Legal information", equipmentTitle: "Equipment", previousOwners: "Number of previous owners" },
        cms: {
            loginTitle: "CMS login", loginInfo: "Staff access. Sign in with company email and password.", username: "Email", password: "Password", loginButton: "Sign in", loginError: "Invalid login credentials.", requiredDriveFuel: "Fuel and drive are required.", manualGearsRequired: "Manual transmission requires the number of gears.", manageTitle: "Vehicle management", logoutButton: "Sign out", intro: "You can add new cars, upload photos and fill in details.", technicalHelp: "Format: each line as Label: Value", equipmentHelp: "Each line = 1 equipment item",
            fields: { name: "Vehicle model", brand: "Brand", year: "Year", priceCzk: "Price (in CZK)", mileage: "Mileage", horsepower: "Power (hp)", doors: "Number of doors", seats: "Number of seats", previousOwners: "Number of previous owners", drive: "Drive", fuel: "Fuel", transmission: "Transmission", manualGears: "Number of gears", image: "Vehicle photo", description: "Basic description", legal: "Legal information", equipment: "Equipment", technicalDataRaw: "Technical data (Label: Value)", equipmentItemsRaw: "Equipment (1 item per line)", available: "Vehicle is available" },
            addButton: "Add vehicle", currentCars: "Current vehicles", toggleAvailability: "Toggle availability", remove: "Remove"
        }
    }
};

const defaultCars = [
    {
        id: "zmr-001",
        name: "BMW 330i Touring M Sport",
        brand: "BMW",
        year: "2020",
        priceCzk: 729000,
        mileage: "89 400 km",
        horsepower: 258,
        doors: 5,
        seats: 5,
        previousOwners: 2,
        drive: "Zadní",
        fuel: "Benzín",
        transmission: "Automat",
        manualGears: 0,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        description: "Spoľahlivé a pravidelne servisované vozidlo vhodné na dlhé trasy aj každodenné používanie. Vozidlo je po technickej kontrole a má transparentnú históriu.",
        legal: "Legislatívne informácie: Vozidlo je možné prihlásiť v ČR/SR po štandardnom procese registrácie. Emisná norma EURO 6. Pri dovoze zabezpečíme kompletné podklady pre evidenciu a STK.",
        equipment: "Výbava: LED svetlomety, navigácia, parkovacia kamera, vyhrievané sedadlá, tempomat, bezkľúčové štartovanie, multifunkčný volant.",
        technicalData: [
            { label: "Vehicle condition", value: "Used vehicle", icon: "🚗" },
            { label: "Category", value: "Convertible/Roadster", icon: "🏎️" },
            { label: "Series", value: "BM 238", icon: "🧾" },
            { label: "Equipment line", value: "E 300 (238,448)", icon: "📦" },
            { label: "Vehicle number", value: "DI3743", icon: "🔢" },
            { label: "Origin", value: "German version", icon: "🌍" },
            { label: "Mileage", value: "65,500 km", icon: "📍" },
            { label: "Displacement", value: "1.991 cm3", icon: "⚙️" },
            { label: "Performance", value: "180 kW (245 hp)", icon: "⚡" },
            { label: "Drive type", value: "Combustion engine", icon: "🛞" },
            { label: "Fuel type", value: "Gasoline", icon: "⛽" },
            { label: "Energy consumption (comb.)", value: "7.9 l/100km", icon: "📉" },
            { label: "CO2 emissions (comb.)", value: "181 g/km", icon: "🌿" },
            { label: "Fuel consumption", value: "7.9 l/100km (combined)", icon: "🧪" },
            { label: "Number of seats", value: "4", icon: "💺" },
            { label: "Number of doors", value: "2/3", icon: "🚪" },
            { label: "Gearbox", value: "Automatic", icon: "🕹️" },
            { label: "Pollutant class", value: "Euro6", icon: "♻️" },
            { label: "Environmental plaque", value: "4 (Green)", icon: "🟢" },
            { label: "First registration", value: "12/2018", icon: "📅" },
            { label: "Number of vehicle owners", value: "2", icon: "👤" },
            { label: "HU", value: "New", icon: "✅" },
            { label: "Air conditioning", value: "2-zone automatic climate control", icon: "❄️" },
            { label: "Parking assistance", value: "Rear, 360° Camera, Front", icon: "🅿️" },
            { label: "Airbags", value: "Front, side and other airbags", icon: "🛡️" },
            { label: "Colour (manufacturer)", value: "SELENITE GREY", icon: "🎨" },
            { label: "Colour", value: "Grey Metallic", icon: "🩶" },
            { label: "Interior equipment", value: "Full leather, Black", icon: "🛋️" },
            { label: "Towbar braked", value: "1,800 kg", icon: "🔗" },
            { label: "Towing load unchecked", value: "750 kg", icon: "⚖️" },
            { label: "Weight", value: "1.795 kg", icon: "🏋️" },
            { label: "Cylinder", value: "4", icon: "🧩" },
            { label: "Tank size", value: "66 l", icon: "🛢️" }
        ],
        equipmentItems: [
            "ABS", "Distance cruise control", "Distance warning", "Adaptive chassis", "Adaptive cornering light", "Alarm system", "All-weather tires", "Android Auto", "Apple CarPlay", "Armrest", "Mountain start assistant", "Bluetooth", "On-board computer", "Electric. Window lifter", "Electric. Side Mirror", "Electric. Seat setting", "Electric. Seat adjustment with memory function", "Electric. Immobiliser", "ESP", "Hands-free device", "Warranty", "Speed limiter", "Head-Up Display", "Rear-wheel drive", "Induction Charging for Smartphones", "Interior mirror automatic dimming", "Inspection new", "Isofix", "Leather steering wheel", "LED headlights", "Alloy wheels", "Light sensor", "Lordose support", "Fatigue warning", "Multifunction steering wheel", "Music streaming integrated", "Navigation system", "Navigation preparation", "Fog lights", "Non-smoking vehicle", "Emergency brake assistant", "Emergency call system", "Radio DAB", "Rain sensor", "Tire pressure control", "Shift rockers", "Headlight cleaning", "Keyless central locking (keyless)", "Power steering", "Seat ventilation", "Seat heating", "Sound system", "Sports suspension", "Sports package", "Sports seats", "Voice control", "Lane Keeping Assist", "Start/Stop automatic", "Daytime running light", "Blind Spot Assist", "Traction control", "Tuner/Radio", "TV", "Traffic Sign Recognition", "Virtual side mirrors", "Fully digital instrument cluster", "Winter package", "WiFi / Wifi Hotspot", "Central locking"
        ],
        available: true
    },
    {
        id: "zmr-002",
        name: "BMW 330i Touring M Sport",
        brand: "BMW",
        year: "2020",
        priceCzk: 729000,
        mileage: "89 400 km",
        horsepower: 258,
        doors: 5,
        seats: 5,
        previousOwners: 1,
        drive: "xDrive",
        fuel: "Benzín",
        transmission: "Automat",
        manualGears: 0,
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
        description: "Ukážkový záznam vozidla na test podstránok. Použitý rovnaký model, aby bolo jasné, ako bude fungovať detail každého auta.",
        legal: "Legislatívne informácie: Vozidlo je možné prihlásiť v ČR/SR po štandardnom procese registrácie. Emisná norma EURO 6. Pri dovoze zabezpečíme kompletné podklady pre evidenciu a STK.",
        equipment: "Výbava: LED svetlomety, navigácia, parkovacia kamera, vyhrievané sedadlá, tempomat, bezkľúčové štartovanie, multifunkčný volant.",
        available: true
    }
];

function normalizeLanguage(language) {
    if (["cs", "sk", "de", "en"].includes(language)) {
        return language;
    }
    return "cs";
}

function getLanguagePreference() {
    return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY) || "cs");
}

function saveLanguagePreference(language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
}

function getBrandFromName(name) {
    if (!name) {
        return "Neznámá";
    }
    return String(name).trim().split(" ")[0] || "Neznámá";
}

function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return NaN;
    }
    const cleaned = value.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : NaN;
}

function parsePriceCzk(car) {
    if (Number.isFinite(car.priceCzk) && car.priceCzk > 0) {
        return Math.round(car.priceCzk);
    }

    const legacyPrice = parseNumber(car.price);
    if (!Number.isFinite(legacyPrice) || legacyPrice <= 0) {
        return 0;
    }

    if (typeof car.price === "string" && /€|eur/i.test(car.price)) {
        return Math.round(legacyPrice * CZK_TO_EUR_RATE);
    }

    return Math.round(legacyPrice);
}

function sanitizeOption(value, allowedValues, fallbackValue) {
    if (allowedValues.includes(value)) {
        return value;
    }
    return fallbackValue;
}

function normalizeDriveValue(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (["všetky 4", "vsechny 4", "xdrive", "awd", "4x4"].includes(raw)) {
        return "Všetky 4";
    }
    if (["predný", "predni", "přední", "fwd", "front"].includes(raw)) {
        return "Predný";
    }
    if (["zadný", "zadni", "zadní", "rwd", "rear"].includes(raw)) {
        return "Zadný";
    }
    return sanitizeOption(value, DRIVE_OPTIONS, "Predný");
}

function normalizeFuelValue(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (["nafta", "diesel"].includes(raw)) {
        return "Nafta";
    }
    if (["benzín", "benzin", "petrol", "gasoline"].includes(raw)) {
        return "Benzín";
    }
    if (["elektrina", "electric", "ev"].includes(raw)) {
        return "Elektrina";
    }
    if (["plug inhybrid", "plug in hybrid", "plug-in hybrid", "plugin hybrid", "phev"].includes(raw)) {
        return "Plug-in hybrid";
    }
    if (["plyn", "lpg", "cng", "gas"].includes(raw)) {
        return "Plyn";
    }
    return sanitizeOption(value, FUEL_OPTIONS, "Benzín");
}

function normalizeBrandKey(value) {
    return String(value || "").trim().toLowerCase();
}

function readVehicleMakesCache() {
    try {
        const raw = localStorage.getItem(VEHICLE_MAKES_CACHE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        const brands = Array.isArray(parsed?.brands) ? parsed.brands.map((item) => String(item || "").trim()).filter(Boolean) : [];
        const savedAt = Number(parsed?.savedAt);
        if (brands.length === 0 || !Number.isFinite(savedAt) || savedAt <= 0) {
            return null;
        }
        return { brands, savedAt };
    } catch {
        return null;
    }
}

function saveVehicleMakesCache(brands) {
    if (!Array.isArray(brands) || brands.length === 0) {
        return;
    }
    try {
        localStorage.setItem(VEHICLE_MAKES_CACHE_KEY, JSON.stringify({
            savedAt: Date.now(),
            brands
        }));
    } catch {
        return;
    }
}

async function fetchPublicVehicleMakes() {
    const cached = readVehicleMakesCache();
    if (cached && Date.now() - cached.savedAt < VEHICLE_MAKES_CACHE_TTL_MS) {
        return cached.brands;
    }

    try {
        const response = await fetch(VEHICLE_MAKES_API_URL, { method: "GET" });
        if (!response.ok) {
            return cached?.brands || [];
        }
        const payload = await response.json();
        const rawResults = Array.isArray(payload?.Results) ? payload.Results : [];
        const makes = Array.from(
            new Set(
                rawResults
                    .map((item) => String(item?.Make_Name || "").trim())
                    .filter(Boolean)
            )
        ).sort((a, b) => a.localeCompare(b, "en"));

        if (makes.length > 0) {
            saveVehicleMakesCache(makes);
            return makes;
        }

        return cached?.brands || [];
    } catch {
        return cached?.brands || [];
    }
}

function getEquipmentItems(car) {
    if (Array.isArray(car.equipmentItems) && car.equipmentItems.length > 0) {
        return car.equipmentItems;
    }

    if (typeof car.equipment === "string" && car.equipment.trim()) {
        const cleaned = car.equipment.replace(/^Výbava:\s*/i, "");
        return cleaned.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [];
}

function getCarImages(car) {
    if (Array.isArray(car?.images) && car.images.length > 0) {
        return car.images.filter(Boolean);
    }
    if (typeof car?.image === "string" && car.image.trim()) {
        return [car.image.trim()];
    }
    return ["https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80"];
}

function getCarThumbnail(car) {
    const images = getCarImages(car);
    const rawIndex = Number(car?.thumbnailIndex);
    const index = Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex < images.length ? rawIndex : 0;
    return images[index] || images[0];
}

function createLocalizedMap(rawMap, fallbackValue = "") {
    const seed = String(fallbackValue || "");
    const localized = {};
    SUPPORTED_LANG_CODES.forEach((languageCode) => {
        const nextValue = rawMap && typeof rawMap[languageCode] === "string" ? rawMap[languageCode] : seed;
        localized[languageCode] = String(nextValue || "");
    });
    return localized;
}

function getLocalizedCarText(car, field, language) {
    const mapKey = `${field}I18n`;
    const localized = car?.[mapKey];
    if (localized && typeof localized === "object") {
        return localized[language] || localized.en || localized.sk || localized.cs || localized.de || car?.[field] || "";
    }
    return car?.[field] || "";
}

function getCarUpdatedAt(car) {
    const value = Number(car?.updatedAt);
    return Number.isFinite(value) && value > 0 ? value : 0;
}

function mergeCarsByLatest(localCars, cloudCars) {
    const mergedById = new Map();

    const upsert = (car) => {
        if (!car || !car.id) {
            return;
        }
        const current = mergedById.get(car.id);
        if (!current || getCarUpdatedAt(car) >= getCarUpdatedAt(current)) {
            mergedById.set(car.id, car);
        }
    };

    (Array.isArray(localCars) ? localCars : []).forEach(upsert);
    (Array.isArray(cloudCars) ? cloudCars : []).forEach(upsert);

    return [...mergedById.values()];
}

function touchCarForUpdate(car, nextFields) {
    const now = Date.now();
    const createdAt = Number.isFinite(Number(car?.createdAt)) && Number(car.createdAt) > 0 ? Number(car.createdAt) : now;
    return {
        ...car,
        ...nextFields,
        createdAt,
        updatedAt: now
    };
}

function createRequestId(prefix = "req") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function setRuntimeFirestoreIdToken(token) {
    runtimeFirestoreIdToken = String(token || "");
    window.ZMR_FIRESTORE_ID_TOKEN = runtimeFirestoreIdToken;
}

function saveFirebaseAuthSession(session) {
    if (!session || typeof session !== "object") {
        return;
    }
    try {
        localStorage.setItem(FIREBASE_AUTH_SESSION_KEY, JSON.stringify(session));
    } catch {
        return;
    }
}

function readFirebaseAuthSession() {
    try {
        const raw = localStorage.getItem(FIREBASE_AUTH_SESSION_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
}

function clearFirebaseAuthSession() {
    try {
        localStorage.removeItem(FIREBASE_AUTH_SESSION_KEY);
    } catch {
        return;
    }
}

function createFirebaseSessionFromAuthResponse(payload) {
    if (!payload || typeof payload !== "object" || !payload.idToken) {
        return null;
    }
    const expiresInSeconds = Math.max(60, Number(payload.expiresIn) || 3600);
    return {
        idToken: String(payload.idToken || ""),
        refreshToken: String(payload.refreshToken || ""),
        localId: String(payload.localId || ""),
        email: String(payload.email || ""),
        expiresAt: Date.now() + expiresInSeconds * 1000
    };
}

function isFirebaseSessionValid(session) {
    return Boolean(session?.idToken) && Number(session?.expiresAt) > Date.now() + 30000;
}

async function signInCmsWithFirebaseEmailPassword(email, password) {
    if (!FIRESTORE_API_KEY) {
        return null;
    }
    const normalizedEmail = String(email || "").trim();
    if (!normalizedEmail || !password) {
        return null;
    }
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(FIRESTORE_API_KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: normalizedEmail,
                password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        return createFirebaseSessionFromAuthResponse(payload);
    } catch {
        return null;
    }
}

async function refreshFirebaseAuthSession(refreshToken) {
    if (!FIRESTORE_API_KEY || !refreshToken) {
        return null;
    }
    try {
        const body = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: String(refreshToken)
        });
        const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(FIRESTORE_API_KEY)}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        return createFirebaseSessionFromAuthResponse({
            idToken: payload?.id_token,
            refreshToken: payload?.refresh_token,
            localId: payload?.user_id,
            expiresIn: payload?.expires_in
        });
    } catch {
        return null;
    }
}

async function ensureFirebaseCmsIdToken() {
    const existing = readFirebaseAuthSession();
    if (isFirebaseSessionValid(existing)) {
        setRuntimeFirestoreIdToken(existing.idToken);
        return true;
    }
    if (!existing?.refreshToken) {
        setRuntimeFirestoreIdToken("");
        return false;
    }
    const refreshed = await refreshFirebaseAuthSession(existing.refreshToken);
    if (!refreshed) {
        clearFirebaseAuthSession();
        setRuntimeFirestoreIdToken("");
        return false;
    }
    saveFirebaseAuthSession(refreshed);
    setRuntimeFirestoreIdToken(refreshed.idToken);
    return true;
}

async function translateTextsForLanguage(texts, targetLanguage) {
    if (!TRANSLATE_PROXY_URL || !Array.isArray(texts) || texts.length === 0) {
        return {};
    }
    try {
        const requestId = createRequestId("tr");
        const response = await fetch(TRANSLATE_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                texts,
                target: targetLanguage,
                source: "cms-localization",
                campaign: "website-translate",
                requestId
            })
        });
        if (!response.ok) {
            return {};
        }
        const data = await response.json();
        return data?.translations && typeof data.translations === "object" ? data.translations : {};
    } catch {
        return {};
    }
}

function createLocalizedCmsFieldMaps(baseFields, sourceLanguage) {
    const source = SUPPORTED_LANG_CODES.includes(sourceLanguage) ? sourceLanguage : "sk";
    const normalizedBase = {
        name: String(baseFields?.name || ""),
        description: String(baseFields?.description || ""),
        legal: String(baseFields?.legal || "")
    };

    const localized = {
        nameI18n: createLocalizedMap(null, normalizedBase.name),
        descriptionI18n: createLocalizedMap(null, normalizedBase.description),
        legalI18n: createLocalizedMap(null, normalizedBase.legal)
    };

    localized.nameI18n[source] = normalizedBase.name;
    localized.descriptionI18n[source] = normalizedBase.description;
    localized.legalI18n[source] = normalizedBase.legal;

    return { source, normalizedBase, localized };
}

async function buildLocalizedCmsFields(baseFields, sourceLanguage) {
    const { source, normalizedBase, localized } = createLocalizedCmsFieldMaps(baseFields, sourceLanguage);

    if (!TRANSLATE_PROXY_URL) {
        return localized;
    }

    const fieldOrder = ["name", "description", "legal"];
    const sourceTexts = fieldOrder.map((fieldName) => normalizedBase[fieldName]);

    for (const targetLanguage of SUPPORTED_LANG_CODES) {
        if (targetLanguage === source) {
            continue;
        }

        const translations = await translateTextsForLanguage(sourceTexts, targetLanguage);
        fieldOrder.forEach((fieldName, index) => {
            const sourceText = sourceTexts[index];
            const translatedText = translations[sourceText];
            const mapKey = `${fieldName}I18n`;
            localized[mapKey][targetLanguage] = translatedText ? String(translatedText) : sourceText;
        });
    }

    return localized;
}

function getCanonicalTechnicalLabel(label) {
    const key = String(label || "").trim().toLowerCase();
    return TECHNICAL_LABEL_CANONICAL_BY_KEY[key] || label;
}

function getCanonicalEquipmentItem(item) {
    const key = String(item || "").trim().toLowerCase();
    return EQUIPMENT_CANONICAL_BY_KEY[key] || item;
}

function getTechnicalData(car) {
    if (Array.isArray(car.technicalData) && car.technicalData.length > 0) {
        return car.technicalData;
    }

    return [
        { label: "Vehicle condition", value: car.reserved ? "Reserved" : (car.available ? "Available" : "Unavailable"), icon: "🚗" },
        { label: "Origin", value: car.origin || "German version", icon: "🌍" },
        { label: "Mileage", value: car.mileage || "-", icon: "📍" },
        { label: "Performance", value: `${car.horsepower || 0} hp`, icon: "⚡" },
        { label: "Drive type", value: car.drive || "-", icon: "🛞" },
        { label: "Fuel type", value: car.fuel || "-", icon: "⛽" },
        { label: "Number of seats", value: String(car.seats || "-"), icon: "💺" },
        { label: "Number of doors", value: String(car.doors || "-"), icon: "🚪" },
        { label: "Gearbox", value: formatTransmission(car), icon: "🕹️" },
        { label: "Number of vehicle owners", value: String(car.previousOwners ?? "-"), icon: "👤" }
    ];
}

function normalizeOriginValue(value) {
    const normalizedValue = String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
    const translation = TECHNICAL_VALUE_TRANSLATIONS_BY_KEY[normalizedValue];
    if (translation?.en) {
        return translation.en;
    }
    return String(value || "").trim() || "German version";
}

function getOriginFromCar(car) {
    if (car?.origin) {
        return normalizeOriginValue(car.origin);
    }
    const technicalRow = (Array.isArray(car?.technicalData) ? car.technicalData : [])
        .find((row) => getCanonicalTechnicalLabel(row?.label) === "Origin");
    if (technicalRow?.value) {
        return normalizeOriginValue(technicalRow.value);
    }
    return "German version";
}

function normalizeCar(car, index) {
    const transmission = sanitizeOption(car.transmission, TRANSMISSION_OPTIONS, "Automat");
    const doors = Number.isFinite(Number(car.doors)) ? Math.max(2, Number(car.doors)) : 2;
    const seats = Number.isFinite(Number(car.seats)) ? Math.max(2, Number(car.seats)) : 2;
    const previousOwners = Number.isFinite(Number(car.previousOwners)) ? Math.max(0, Number(car.previousOwners)) : 0;
    const manualGearsRaw = Number.isFinite(Number(car.manualGears)) ? Number(car.manualGears) : 0;
    const manualGears = transmission === "Manuál" ? Math.max(1, manualGearsRaw) : 0;
    const images = getCarImages(car);
    const rawThumbnailIndex = Number(car.thumbnailIndex);
    const thumbnailIndex = Number.isInteger(rawThumbnailIndex) && rawThumbnailIndex >= 0 && rawThumbnailIndex < images.length ? rawThumbnailIndex : 0;
    const nameI18n = createLocalizedMap(car.nameI18n, car.name || "");
    const descriptionI18n = createLocalizedMap(car.descriptionI18n, car.description || "");
    const legalI18n = createLocalizedMap(car.legalI18n, car.legal || "");
    const primaryName = nameI18n.sk || nameI18n.cs || nameI18n.en || car.name || "";
    const primaryDescription = descriptionI18n.sk || descriptionI18n.cs || descriptionI18n.en || car.description || "";
    const primaryLegal = legalI18n.sk || legalI18n.cs || legalI18n.en || car.legal || "";
    const createdAt = Number.isFinite(Number(car.createdAt)) && Number(car.createdAt) > 0 ? Number(car.createdAt) : 0;
    const updatedAt = Number.isFinite(Number(car.updatedAt)) && Number(car.updatedAt) > 0 ? Number(car.updatedAt) : createdAt;

    return {
        ...car,
        id: car.id || `zmr-${Date.now()}-${index}`,
        name: primaryName,
        description: primaryDescription,
        legal: primaryLegal,
        nameI18n,
        descriptionI18n,
        legalI18n,
        brand: car.brand || getBrandFromName(primaryName),
        origin: getOriginFromCar(car),
        horsepower: Number.isFinite(Number(car.horsepower)) ? Number(car.horsepower) : 0,
        doors,
        seats,
        previousOwners,
        drive: normalizeDriveValue(car.drive),
        fuel: normalizeFuelValue(car.fuel),
        transmission,
        manualGears,
        images,
        thumbnailIndex,
        image: images[thumbnailIndex] || images[0],
        reserved: Boolean(car.reserved),
        technicalData: Array.isArray(car.technicalData) ? car.technicalData : undefined,
        equipmentItems: getEquipmentItems(car),
        priceCzk: parsePriceCzk(car),
        available: Boolean(car.available),
        createdAt,
        updatedAt
    };
}

function formatTransmission(car) {
    if (car.transmission === "Manuál" && car.manualGears > 0) {
        return `${car.transmission} (${car.manualGears})`;
    }
    return car.transmission;
}

function translateTechnicalLabel(label, language) {
    const translation = TECHNICAL_LABEL_TRANSLATIONS[label];
    if (!translation) {
        return label;
    }
    return translation[language] || translation.en || label;
}

function translateTechnicalValue(value, language) {
    if (typeof value !== "string") {
        return value;
    }
    const normalizedValue = value.trim().replace(/\s+/g, " ").toLowerCase();
    const translation = TECHNICAL_VALUE_TRANSLATIONS[value] || TECHNICAL_VALUE_TRANSLATIONS_BY_KEY[normalizedValue];
    if (!translation) {
        return value;
    }
    return translation[language] || translation.en || value;
}

function translateEquipmentItem(item, language) {
    if (typeof item !== "string") {
        return item;
    }
    const normalized = item.trim().replace(/\s+/g, " ").toLowerCase();
    const translation = EQUIPMENT_ITEM_TRANSLATIONS[item] || EQUIPMENT_ITEM_TRANSLATIONS_BY_KEY[normalized];
    if (!translation) {
        return item;
    }
    return translation[language] || translation.en || item;
}

function translateTechnicalIconLabel(icon, language) {
    const translation = TECHNICAL_ICON_TRANSLATIONS[icon];
    if (!translation) {
        return "Icon";
    }
    return translation[language] || translation.en || "Icon";
}

function sanitizeTechnicalChecklistValue(label, value) {
    if (!TECHNICAL_NUMERIC_FIELD_LABELS.has(label)) {
        return value;
    }
    return String(value || "").replace(/[^\d]/g, "");
}

function getTechnicalSuggestionListId(label) {
    const slug = String(label || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `technical-values-${slug || "field"}`;
}

function normalizeTranslationValueKey(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function isLikelyTranslatableValue(value) {
    if (typeof value !== "string") {
        return false;
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return false;
    }
    if (/^[\d\s.,:/()%+-]+$/.test(trimmed)) {
        return false;
    }
    return true;
}

function getStoredTranslationCache() {
    try {
        const raw = localStorage.getItem(TRANSLATION_CACHE_KEY);
        if (!raw) {
            return {};
        }
        const parsed = JSON.parse(raw);
        return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
        return {};
    }
}

function saveStoredTranslationCache(cache) {
    try {
        localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
    } catch {
        // ignore cache write issues
    }
}

function getCachedTranslation(value, language) {
    const key = normalizeTranslationValueKey(value);
    if (!key) {
        return "";
    }
    const cache = getStoredTranslationCache();
    return cache?.[language]?.[key] || "";
}

function setCachedTranslations(language, translationsByKey) {
    if (!translationsByKey || Object.keys(translationsByKey).length === 0) {
        return;
    }
    const cache = getStoredTranslationCache();
    const languageBucket = { ...(cache[language] || {}) };
    Object.entries(translationsByKey).forEach(([key, translated]) => {
        if (key && translated) {
            languageBucket[key] = translated;
        }
    });
    cache[language] = languageBucket;
    saveStoredTranslationCache(cache);
}

async function fetchTechnicalValueTranslations(values, language) {
    const target = (language || "en").toLowerCase();
    if (!TRANSLATE_PROXY_URL || target === "en") {
        return {};
    }

    const uniqueValues = [...new Set(
        (Array.isArray(values) ? values : [])
            .map((value) => (typeof value === "string" ? value.trim() : ""))
            .filter(Boolean)
            .filter(isLikelyTranslatableValue)
    )];

    if (uniqueValues.length === 0) {
        return {};
    }

    const localResults = {};
    const toRequest = [];

    uniqueValues.forEach((value) => {
        const key = normalizeTranslationValueKey(value);
        const localTranslated = translateTechnicalValue(value, target);
        if (localTranslated !== value) {
            localResults[key] = localTranslated;
            return;
        }

        const cached = getCachedTranslation(value, target);
        if (cached) {
            localResults[key] = cached;
            return;
        }

        toRequest.push(value);
    });

    if (toRequest.length === 0) {
        return localResults;
    }

    const requestKey = `${target}::${toRequest.join("||")}`;
    if (pendingTechnicalTranslationRequests.has(requestKey)) {
        const pending = await pendingTechnicalTranslationRequests.get(requestKey);
        return { ...localResults, ...pending };
    }

    const requestId = createRequestId("tr-tech");
    const requestPromise = fetch(TRANSLATE_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            texts: toRequest,
            target,
            source: "technical-value-translation",
            campaign: "website-translate",
            requestId
        })
    })
        .then(async (response) => {
            if (!response.ok) {
                return {};
            }
            const data = await response.json();
            const entries = data?.translations && typeof data.translations === "object" ? data.translations : {};
            const normalized = {};
            Object.entries(entries).forEach(([original, translated]) => {
                const key = normalizeTranslationValueKey(original);
                if (key && translated) {
                    normalized[key] = String(translated);
                }
            });
            setCachedTranslations(target, normalized);
            return normalized;
        })
        .catch(() => ({}));

    pendingTechnicalTranslationRequests.set(requestKey, requestPromise);
    const remoteResults = await requestPromise;
    pendingTechnicalTranslationRequests.delete(requestKey);

    return { ...localResults, ...remoteResults };
}

function parseTechnicalDataRaw(raw) {
    if (!raw || !raw.trim()) {
        return undefined;
    }

    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const separatorIndex = line.indexOf(":");
            if (separatorIndex < 0) {
                return null;
            }

            const label = line.slice(0, separatorIndex).trim();
            const value = line.slice(separatorIndex + 1).trim();
            if (!label || !value) {
                return null;
            }

            return { label, value, icon: "🧾" };
        })
        .filter(Boolean);
}

function parseEquipmentItemsRaw(raw) {
    if (!raw || !raw.trim()) {
        return [];
    }

    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function createInitialTechnicalChecklistState() {
    const state = {};
    TECHNICAL_CHECKLIST_FIELDS.forEach((field) => {
        state[field.label] = {
            enabled: true,
            value: field.defaultValue,
            icon: field.defaultIcon
        };
    });
    return state;
}

function createTechnicalChecklistFromCar(car) {
    const state = {};
    TECHNICAL_CHECKLIST_FIELDS.forEach((field) => {
        state[field.label] = {
            enabled: false,
            value: "",
            icon: field.defaultIcon
        };
    });

    const rows = getTechnicalData(car);
    rows.forEach((row) => {
        const canonicalLabel = getCanonicalTechnicalLabel(row?.label);
        if (!state[canonicalLabel]) {
            return;
        }
        const sanitizedValue = sanitizeTechnicalChecklistValue(canonicalLabel, row?.value || "");
        state[canonicalLabel] = {
            enabled: true,
            value: canonicalLabel === "Performance" ? sanitizedValue : (TECHNICAL_NUMERIC_FIELD_LABELS.has(canonicalLabel) ? sanitizedValue : String(row?.value || "")),
            icon: row?.icon || state[canonicalLabel].icon
        };
    });

    return state;
}

function buildTechnicalValueSuggestions(cars) {
    const valuesByLabel = TECHNICAL_CHECKLIST_FIELDS.reduce((accumulator, field) => {
        accumulator[field.label] = new Set();
        const fallbackValue = sanitizeTechnicalChecklistValue(field.label, field.defaultValue || "").trim();
        if (fallbackValue) {
            accumulator[field.label].add(fallbackValue);
        }
        return accumulator;
    }, {});

    (Array.isArray(cars) ? cars : []).forEach((car) => {
        const technicalRows = getTechnicalData(car);
        technicalRows.forEach((row) => {
            const canonicalLabel = getCanonicalTechnicalLabel(row?.label);
            if (!valuesByLabel[canonicalLabel]) {
                return;
            }
            const sanitizedValue = sanitizeTechnicalChecklistValue(canonicalLabel, row?.value || "").trim();
            if (!sanitizedValue) {
                return;
            }
            valuesByLabel[canonicalLabel].add(sanitizedValue);
        });
    });

    return Object.entries(valuesByLabel).reduce((accumulator, [label, values]) => {
        const sortedValues = [...values].sort((a, b) => {
            if (TECHNICAL_NUMERIC_FIELD_LABELS.has(label)) {
                const parsedA = Number(a);
                const parsedB = Number(b);
                if (Number.isFinite(parsedA) && Number.isFinite(parsedB)) {
                    return parsedA - parsedB;
                }
            }
            return String(a).localeCompare(String(b));
        });
        accumulator[label] = sortedValues;
        return accumulator;
    }, {});
}

function createInitialEquipmentChecklistState() {
    const state = {};
    EQUIPMENT_CHECKLIST_ITEMS.forEach((item) => {
        state[item] = false;
    });
    return state;
}

function createEquipmentChecklistFromCar(car) {
    const state = createInitialEquipmentChecklistState();
    getEquipmentItems(car).forEach((item) => {
        const canonicalItem = getCanonicalEquipmentItem(item);
        if (Object.prototype.hasOwnProperty.call(state, canonicalItem)) {
            state[canonicalItem] = true;
        }
    });
    return state;
}

function estimateDataUrlBytes(dataUrl) {
    if (typeof dataUrl !== "string") {
        return Infinity;
    }
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex < 0) {
        return Infinity;
    }
    const base64 = dataUrl.slice(commaIndex + 1);
    return Math.floor((base64.length * 3) / 4);
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("File read failed"));
        reader.readAsDataURL(file);
    });
}

async function compressImageToDataUrl(file) {
    const source = await readFileAsDataUrl(file);
    const image = await new Promise((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Image decode failed"));
        element.src = source;
    });

    const sourceWidth = Math.max(1, Number(image.naturalWidth) || Number(image.width) || 1);
    const sourceHeight = Math.max(1, Number(image.naturalHeight) || Number(image.height) || 1);
    const scale = Math.min(1, 1600 / sourceWidth, 1200 / sourceHeight);
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d");
    if (!context) {
        return source;
    }
    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    let quality = 0.82;
    let output = canvas.toDataURL("image/jpeg", quality);
    while (estimateDataUrlBytes(output) > 380000 && quality > 0.5) {
        quality = Math.max(0.5, quality - 0.08);
        output = canvas.toDataURL("image/jpeg", quality);
    }

    return estimateDataUrlBytes(output) <= estimateDataUrlBytes(source) ? output : source;
}

function readFilesAsDataUrls(files) {
    const fileList = Array.from(files || []);
    return Promise.all(
        fileList.map(async (file) => {
            if (!(file instanceof File)) {
                return "";
            }
            const mimeType = String(file.type || "").toLowerCase();
            if (!mimeType.startsWith("image/")) {
                return "";
            }
            try {
                return await compressImageToDataUrl(file);
            } catch {
                return await readFileAsDataUrl(file);
            }
        })
    );
}

function buildTechnicalDataFromChecklist(checklist, baseForm, transmission, manualGears) {
    const conditionValue = baseForm.status === "reserved"
        ? "Reserved"
        : baseForm.status === "unavailable"
            ? "Unavailable"
            : "Available";

    return [
        { label: "Vehicle condition", value: conditionValue, icon: "🚗" },
        { label: "Origin", value: normalizeOriginValue(baseForm.origin), icon: "🌍" },
        { label: "Mileage", value: baseForm.mileage || "-", icon: "📍" },
        { label: "Performance", value: `${Math.round(parseNumber(baseForm.horsepower) || 0)} hp`, icon: "⚡" },
        { label: "Drive type", value: baseForm.drive || "-", icon: "🛞" },
        { label: "Fuel type", value: baseForm.fuel || "-", icon: "⛽" },
        { label: "Number of seats", value: String(Math.max(2, Math.round(parseNumber(baseForm.seats) || 0))), icon: "💺" },
        { label: "Number of doors", value: String(Math.max(2, Math.round(parseNumber(baseForm.doors) || 0))), icon: "🚪" },
        { label: "Gearbox", value: transmission === "Manuál" && manualGears > 0 ? `${transmission} (${manualGears})` : transmission, icon: "🕹️" },
        { label: "Number of vehicle owners", value: String(Math.max(0, Math.round(parseNumber(baseForm.previousOwners) || 0))), icon: "👤" }
    ];
}

function DarkSelect({ value, onChange, options, placeholder, ariaLabel }) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);
    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        const handleOutside = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, []);

    const handlePick = (nextValue) => {
        onChange(nextValue);
        setIsOpen(false);
    };

    return (
        <div className="dark-select" ref={rootRef}>
            <button
                type="button"
                className={isOpen ? "dark-select-trigger open" : "dark-select-trigger"}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={ariaLabel}
                aria-expanded={isOpen}
            >
                <span>{selected ? selected.label : placeholder}</span>
                <span className="dark-select-caret" aria-hidden="true">▾</span>
            </button>
            {isOpen && (
                <div className="dark-select-menu">
                    {placeholder && (
                        <button type="button" className={!value ? "dark-select-option active" : "dark-select-option"} onClick={() => handlePick("")}>{placeholder}</button>
                    )}
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={option.value === value ? "dark-select-option active" : "dark-select-option"}
                            onClick={() => handlePick(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function getCars() {
    return [];
}

function saveCars() {
    return;
}
function isDataUrlImage(value) {
    return typeof value === "string" && value.trim().toLowerCase().startsWith("data:");
}

function sanitizeCarForCloud(car) {
    if (!car || typeof car !== "object") {
        return car;
    }
    const images = getCarImages(car).map((image) => String(image || "").trim()).filter(Boolean);
    const normalizedImages = images.slice(0, 8);
    const safeImages = normalizedImages.length > 0
        ? normalizedImages
        : ["https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80"];
    const rawThumbnail = Number(car.thumbnailIndex);
    const thumbnailIndex = Number.isInteger(rawThumbnail) && rawThumbnail >= 0 && rawThumbnail < safeImages.length ? rawThumbnail : 0;
    return {
        ...car,
        images: safeImages,
        thumbnailIndex,
        image: safeImages[thumbnailIndex] || safeImages[0]
    };
}

function sanitizeCarsForCloud(cars) {
    if (!Array.isArray(cars)) {
        return [];
    }
    return cars.map((car) => sanitizeCarForCloud(car));
}
async function fetchCarsFromCloud() {
    const firestoreCars = await fetchCarsFromFirestore();
    if (firestoreCars) {
        return firestoreCars;
    }
    const firebaseCars = await fetchCarsFromFirebase();
    if (firebaseCars) {
        return firebaseCars;
    }
    if (!CARS_API_URL) {
        return null;
    }
    try {
        const response = await fetch(CARS_API_URL, { method: "GET" });
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        const list = Array.isArray(payload?.cars) ? payload.cars : [];
        return list.length > 0 ? list : null;
    } catch {
        return null;
    }
}

async function saveCarsToCloud(cars) {
    if (!Array.isArray(cars)) {
        return false;
    }
    const cloudCars = sanitizeCarsForCloud(cars);
    const firestoreSaved = await saveCarsToFirestore(cloudCars);
    if (firestoreSaved) {
        return true;
    }
    const firebaseSaved = await saveCarsToFirebase(cloudCars);
    if (firebaseSaved) {
        return true;
    }
    if (!CARS_API_URL) {
        return false;
    }
    try {
        const response = await fetch(CARS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requestId: createRequestId("cars"),
                source: "cars-sync",
                campaign: "website-cars-sync",
                cars: cloudCars
            })
        });
        return response.ok;
    } catch {
        return false;
    }
}
function buildFirebaseCarsUrl() {
    if (!FIREBASE_DB_URL) {
        return "";
    }
    const baseUrl = String(FIREBASE_DB_URL).replace(/\/+$/, "");
    const path = String(FIREBASE_CARS_PATH || "zmrCars").replace(/^\/+/, "").replace(/\/+$/, "");
    const authQuery = FIREBASE_AUTH_TOKEN ? `?auth=${encodeURIComponent(FIREBASE_AUTH_TOKEN)}` : "";
    return `${baseUrl}/${path}.json${authQuery}`;
}

function mapFirebaseCarsPayloadToList(payload) {
    if (Array.isArray(payload)) {
        return payload.filter((car) => car && typeof car === "object");
    }
    if (!payload || typeof payload !== "object") {
        return [];
    }
    return Object.values(payload).filter((car) => car && typeof car === "object");
}

async function fetchCarsFromFirebase() {
    const url = buildFirebaseCarsUrl();
    if (!url) {
        return null;
    }
    try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        const list = mapFirebaseCarsPayloadToList(payload);
        return list.length > 0 ? list : null;
    } catch {
        return null;
    }
}

async function saveCarsToFirebase(cars) {
    if (!Array.isArray(cars)) {
        return false;
    }
    await ensureFirebaseCmsIdToken();
    const url = buildFirebaseCarsUrl();
    if (!url) {
        return false;
    }
    const carMap = cars.reduce((accumulator, car) => {
        if (car && car.id) {
            accumulator[car.id] = car;
        }
        return accumulator;
    }, {});

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carMap)
        });
        return response.ok;
    } catch {
        return false;
    }
}

function encodeFirestoreValue(value) {
    if (value === null || typeof value === "undefined") {
        return { nullValue: null };
    }
    if (typeof value === "string") {
        return { stringValue: value };
    }
    if (typeof value === "boolean") {
        return { booleanValue: value };
    }
    if (typeof value === "number") {
        if (Number.isInteger(value)) {
            return { integerValue: String(value) };
        }
        return { doubleValue: value };
    }
    if (Array.isArray(value)) {
        return {
            arrayValue: {
                values: value.map((item) => encodeFirestoreValue(item))
            }
        };
    }
    if (typeof value === "object") {
        const fields = Object.entries(value).reduce((accumulator, [key, item]) => {
            accumulator[key] = encodeFirestoreValue(item);
            return accumulator;
        }, {});
        return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
}

function decodeFirestoreValue(value) {
    if (!value || typeof value !== "object") {
        return null;
    }
    if (Object.prototype.hasOwnProperty.call(value, "stringValue")) {
        return value.stringValue;
    }
    if (Object.prototype.hasOwnProperty.call(value, "booleanValue")) {
        return Boolean(value.booleanValue);
    }
    if (Object.prototype.hasOwnProperty.call(value, "integerValue")) {
        const parsed = Number(value.integerValue);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    if (Object.prototype.hasOwnProperty.call(value, "doubleValue")) {
        const parsed = Number(value.doubleValue);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    if (Object.prototype.hasOwnProperty.call(value, "nullValue")) {
        return null;
    }
    if (value.arrayValue) {
        const values = Array.isArray(value.arrayValue.values) ? value.arrayValue.values : [];
        return values.map((item) => decodeFirestoreValue(item));
    }
    if (value.mapValue) {
        const fields = value.mapValue.fields && typeof value.mapValue.fields === "object" ? value.mapValue.fields : {};
        return Object.entries(fields).reduce((accumulator, [key, item]) => {
            accumulator[key] = decodeFirestoreValue(item);
            return accumulator;
        }, {});
    }
    return null;
}

function buildFirestoreDocumentUrl() {
    if (!FIRESTORE_PROJECT_ID || !FIRESTORE_API_KEY) {
        return "";
    }
    const projectId = encodeURIComponent(String(FIRESTORE_PROJECT_ID).trim());
    const key = encodeURIComponent(String(FIRESTORE_API_KEY).trim());
    const path = String(FIRESTORE_DOCUMENT_PATH || "zmrSync/cars").replace(/^\/+/, "").replace(/\/+$/, "");
    if (!path) {
        return "";
    }
    return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}?key=${key}`;
}

function getFirestoreHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (runtimeFirestoreIdToken) {
        headers.Authorization = `Bearer ${runtimeFirestoreIdToken}`;
    }
    return headers;
}

async function fetchCarsFromFirestore() {
    const url = buildFirestoreDocumentUrl();
    if (!url) {
        return null;
    }
    try {
        const response = await fetch(url, { method: "GET", headers: getFirestoreHeaders() });
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        const fields = payload?.fields && typeof payload.fields === "object" ? payload.fields : {};
        const carsValue = fields.cars ? decodeFirestoreValue(fields.cars) : null;
        if (Array.isArray(carsValue) && carsValue.length > 0) {
            return carsValue;
        }
        return null;
    } catch {
        return null;
    }
}

async function saveCarsToFirestore(cars) {
    if (!Array.isArray(cars)) {
        return false;
    }
    await ensureFirebaseCmsIdToken();
    const url = buildFirestoreDocumentUrl();
    if (!url) {
        return false;
    }
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: getFirestoreHeaders(),
            body: JSON.stringify({
                fields: {
                    cars: encodeFirestoreValue(cars),
                    updatedAt: encodeFirestoreValue(Date.now())
                }
            })
        });
        return response.ok;
    } catch {
        return false;
    }
}

function readCarIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function readCarFiltersFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return {
        search: params.get("q") || "",
        fuel: params.get("fuel") || "",
        brand: params.get("brand") || "",
        drive: params.get("drive") || "",
        transmission: params.get("transmission") || "",
        doors: params.get("doors") || "",
        seatsFrom: params.get("seatsFrom") || params.get("seats") || "",
        seatsTo: params.get("seatsTo") || "",
        horsepowerFrom: params.get("hpFrom") || "",
        horsepowerTo: params.get("hpTo") || ""
    };
}

function syncCarFiltersToQuery(filters) {
    const params = new URLSearchParams(window.location.search);
    const mapping = {
        q: filters.search,
        fuel: filters.fuel,
        brand: filters.brand,
        drive: filters.drive,
        transmission: filters.transmission,
        doors: filters.doors,
        seatsFrom: filters.seatsFrom,
        seatsTo: filters.seatsTo,
        seats: "",
        hpFrom: filters.horsepowerFrom,
        hpTo: filters.horsepowerTo
    };

    Object.entries(mapping).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
    });

    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
}

function getCurrencyForLanguage(language) {
    return language === "cs" ? "CZK" : "EUR";
}

function formatPrice(priceCzk, language) {
    const currency = getCurrencyForLanguage(language);
    const locale = language === "sk" ? "sk-SK" : language === "de" ? "de-DE" : language === "en" ? "en-US" : "cs-CZ";
    const amount = currency === "CZK" ? priceCzk : priceCzk / CZK_TO_EUR_RATE;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatReservationDateTime(dateValue, language) {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const locale = language === "sk" ? "sk-SK" : language === "de" ? "de-DE" : language === "en" ? "en-US" : "cs-CZ";
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "medium"
    }).format(date);
}

async function sendReservationEmailViaProxy(payload) {
    if (!RESERVATION_PROXY_URL) {
        return { ok: false, error: "missing-endpoint" };
    }

    const isFormSubmitEndpoint = /formsubmit\.co\/ajax\//i.test(RESERVATION_PROXY_URL);
    const requesterName = [payload?.form?.firstName, payload?.form?.lastName].filter(Boolean).join(" ").trim();
    const requesterEmail = String(payload?.form?.email || "").trim();
    const subject = String(payload?.subject || "Reservation request").trim();
    const message = String(payload?.text || "").trim();

    const formSubmitPayload = {
        name: requesterName || "Website reservation",
        email: requesterEmail,
        subject,
        message,
        _subject: subject,
        _replyto: requesterEmail,
        _captcha: "false",
        _template: "table"
    };

    try {
        const response = await fetch(RESERVATION_PROXY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(isFormSubmitEndpoint ? { Accept: "application/json" } : {})
            },
            body: JSON.stringify(isFormSubmitEndpoint ? formSubmitPayload : payload)
        });

        if (!response.ok) {
            return { ok: false, error: `http-${response.status}` };
        }

        const data = await response.json().catch(() => ({}));
        if (isFormSubmitEndpoint) {
            if (data?.success === true || data?.success === "true") {
                return { ok: true };
            }
            return { ok: false, error: data?.message ? `formsubmit-${String(data.message)}` : "invalid-response" };
        }
        if (data?.ok) {
            return { ok: true };
        }

        return { ok: false, error: "invalid-response" };
    } catch {
        return { ok: false, error: "network" };
    }
}
function getReservationTexts(language) {
    if (language === "de") {
        return {
            statusReserved: "Reserviert",
            reserveButton: "Reservieren",
            reserveUnavailable: "Fahrzeug kann nicht reserviert werden",
            reserveTitle: "Fahrzeug reservieren",
            firstName: "Vorname",
            lastName: "Nachname",
            email: "E-Mail",
            phone: "Telefon",
            sendReservation: "Reservierungsanfrage senden",
            reservedSuccess: "Reservierungsanfrage wurde erfolgreich gesendet.",
            reserveErrorConfig: "Reservierungsdienst ist nicht konfiguriert.",
            reserveErrorSend: "Reservierung konnte nicht gesendet werden. Bitte versuche es erneut.",
            reserveSending: "Reservierung wird gesendet...",
            alreadyReserved: "Dieses Fahrzeug ist bereits reserviert.",
            reservationSubject: (carName) => `Reservierung Fahrzeug: ${carName}`,
            reservationBody: (car, form, reservedAtIso, reservedAtLocal) => `Fahrzeug: ${car.name}\nID: ${car.id}\nJahr: ${car.year}\nPreis: ${car.priceCzk} CZK\nReserviert am: ${reservedAtLocal || reservedAtIso}\nUTC: ${reservedAtIso}\n\nReservierungsanfrage von:\nVorname: ${form.firstName}\nNachname: ${form.lastName}\nE-Mail: ${form.email}\nTelefon: ${form.phone}\n\nLanguage: DE\nSource: Vehicle detail page\nCampaign: website-reservation`
        };
    }
    if (language === "en") {
        return {
            statusReserved: "Reserved",
            reserveButton: "Reserve",
            reserveUnavailable: "Vehicle cannot be reserved",
            reserveTitle: "Reserve vehicle",
            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            phone: "Phone",
            sendReservation: "Send reservation request",
            reservedSuccess: "Reservation request was sent successfully.",
            reserveErrorConfig: "Reservation service is not configured.",
            reserveErrorSend: "Reservation could not be sent. Please try again.",
            reserveSending: "Sending reservation...",
            alreadyReserved: "This vehicle is already reserved.",
            reservationSubject: (carName) => `Vehicle reservation: ${carName}`,
            reservationBody: (car, form, reservedAtIso, reservedAtLocal) => `Vehicle: ${car.name}\nID: ${car.id}\nYear: ${car.year}\nPrice: ${car.priceCzk} CZK\nReserved at: ${reservedAtLocal || reservedAtIso}\nUTC: ${reservedAtIso}\n\nReservation request from:\nFirst name: ${form.firstName}\nLast name: ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nLanguage: EN\nSource: Vehicle detail page\nCampaign: website-reservation`
        };
    }
    if (language === "sk") {
        return {
        statusReserved: "Rezervované",
        reserveButton: "Rezervovať",
        reserveUnavailable: "Vozidlo nie je možné rezervovať",
        reserveTitle: "Rezervácia vozidla",
        firstName: "Meno",
        lastName: "Priezvisko",
        email: "E-mail",
        phone: "Telefón",
        sendReservation: "Odoslať rezerváciu",
        reservedSuccess: "Rezervácia bola úspešne odoslaná.",
        reserveErrorConfig: "Rezervačná služba nie je nakonfigurovaná.",
        reserveErrorSend: "Rezerváciu sa nepodarilo odoslať. Skús to prosím znova.",
        reserveSending: "Odosielam rezerváciu...",
        alreadyReserved: "Toto vozidlo je už rezervované.",
        reservationSubject: (carName) => `Rezervácia vozidla: ${carName}`,
        reservationBody: (car, form, reservedAtIso, reservedAtLocal) => `Vozidlo: ${car.name}\nID: ${car.id}\nRok: ${car.year}\nCena: ${car.priceCzk} Kč\nRezervované: ${reservedAtLocal || reservedAtIso}\nUTC: ${reservedAtIso}\n\nŽiadosť o rezerváciu:\nMeno: ${form.firstName}\nPriezvisko: ${form.lastName}\nE-mail: ${form.email}\nTelefón: ${form.phone}\n\nLanguage: SK\nSource: Vehicle detail page\nCampaign: website-reservation`
    };
    }
    return {
        statusReserved: "Rezervováno",
        reserveButton: "Rezervovat",
        reserveUnavailable: "Vozidlo nelze rezervovat",
        reserveTitle: "Rezervace vozidla",
        firstName: "Jméno",
        lastName: "Příjmení",
        email: "E-mail",
        phone: "Telefon",
        sendReservation: "Odeslat rezervaci",
        reservedSuccess: "Rezervace byla úspěšně odeslána.",
        reserveErrorConfig: "Rezervační služba není nakonfigurovaná.",
        reserveErrorSend: "Rezervaci se nepodařilo odeslat. Zkuste to prosím znovu.",
        reserveSending: "Odesílám rezervaci...",
        alreadyReserved: "Toto vozidlo je už rezervované.",
        reservationSubject: (carName) => `Rezervace vozidla: ${carName}`,
        reservationBody: (car, form, reservedAtIso, reservedAtLocal) => `Vozidlo: ${car.name}\nID: ${car.id}\nRok: ${car.year}\nCena: ${car.priceCzk} Kč\nRezervováno: ${reservedAtLocal || reservedAtIso}\nUTC: ${reservedAtIso}\n\nŽádost o rezervaci:\nJméno: ${form.firstName}\nPříjmení: ${form.lastName}\nE-mail: ${form.email}\nTelefon: ${form.phone}\n\nLanguage: CS\nSource: Vehicle detail page\nCampaign: website-reservation`
    };
}

function getCarAvailabilityRank(car) {
    if (!car?.available) {
        return 2;
    }
    if (car?.reserved) {
        return 1;
    }
    return 0;
}

function Navigation({ activePage, texts, className = "", onNavigate }) {
    const items = [
        { key: "cars", label: texts.nav.cars, href: "/auta" },
        { key: "services", label: texts.nav.services, href: "/sluzby" },
        { key: "about", label: texts.nav.about, href: "/o-nas" },
        { key: "contact", label: texts.nav.contact, href: "/kontakt" },
    ];

    return (
        <nav className={className ? `nav ${className}` : "nav"}>
            {items.map((item) => (
                <a
                    key={item.key}
                    href={item.href}
                    className={item.key === activePage ? "nav-link active" : "nav-link"}
                    onClick={() => onNavigate?.()}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}

function LanguageSwitcher({ language, onChange, texts }) {
    const languageSelectOptions = useMemo(() => LANGUAGE_OPTIONS.map((item) => ({
        value: item.code,
        label: `${item.flag} ${item.label}`
    })), []);

    return (
        <div className="language-switcher" role="group" aria-label={texts.common.language}>
            <DarkSelect
                value={language}
                onChange={(value) => onChange(value || "cs")}
                options={languageSelectOptions}
                ariaLabel={texts.common.language}
            />
        </div>
    );
}

function PageShell({ page, title, subtitle, language, onLanguageChange, texts, children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuLabel = language === "de" ? "Menü" : "Menu";
    const cmsLoginLabel = language === "de"
        ? "CMS Anmeldung"
        : language === "en"
            ? "CMS login"
            : language === "sk"
                ? "Prihlásenie do CMS"
                : "Přihlášení do CMS";

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [page, language]);

    useEffect(() => {
        const closeDesktopMenu = () => {
            if (window.innerWidth > 860) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", closeDesktopMenu);
        return () => window.removeEventListener("resize", closeDesktopMenu);
    }, []);

    return (
        <>
            <header className="top-header">
                <div className="top-inner">
                    <a className="brand" href="/">
                        <img src="sources/ZMRAutomovite-logo.png" alt="ZMR Automotive logo" className="logo" />
                    </a>
                    <div className="header-tools">
                        <button
                            type="button"
                            className={isMobileMenuOpen ? "menu-toggle open" : "menu-toggle"}
                            aria-label={menuLabel}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="primary-mobile-nav"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        >
                            <span aria-hidden="true">{isMobileMenuOpen ? "✕" : "☰"}</span>
                            <span>{menuLabel}</span>
                        </button>
                        <div id="primary-mobile-nav" className={isMobileMenuOpen ? "mobile-nav-wrap open" : "mobile-nav-wrap"}>
                            <Navigation activePage={page} texts={texts} className="primary-nav" onNavigate={() => setIsMobileMenuOpen(false)} />
                        </div>
                        <a className="cms-login-icon" href="/cms" aria-label={cmsLoginLabel} title={cmsLoginLabel}>
                            <span aria-hidden="true">🔐</span>
                            <span className="sr-only">{cmsLoginLabel}</span>
                        </a>
                        <LanguageSwitcher language={language} onChange={onLanguageChange} texts={texts} />
                    </div>
                </div>
            </header>

            <section className="hero-block">
                <div className="container">
                    <h1>{title}</h1>
                    <p className="hero-subtitle">{subtitle}</p>
                </div>
            </section>

            <main className="container page-content">{children}</main>
        </>
    );
}
function HomePage({ texts }) {
    const homeKpis = Array.isArray(texts.home.kpis) ? texts.home.kpis : [];
    const homePillars = Array.isArray(texts.home.pillars) ? texts.home.pillars : [];
    const homeWorkflowSteps = Array.isArray(texts.home.workflowSteps) ? texts.home.workflowSteps : [];
    const homePillarIcons = ["🧭", "📡", "🤝", "🚚"];

    return (
        <>
            <section className="card">
                <h2>{texts.home.whyTitle}</h2>
                <p>{texts.home.whyP1}</p>
                <p>{texts.home.whyP2}</p>
                {texts.home.whyP3 ? <p>{texts.home.whyP3}</p> : null}
                {texts.home.whyP4 ? <p>{texts.home.whyP4}</p> : null}
            </section>

            <section className="card split-card">
                <div>
                    <h2>{texts.home.approachTitle}</h2>
                    <p>{texts.home.approachText}</p>
                </div>
                <div>
                    <h2>{texts.home.outputTitle}</h2>
                    <p>{texts.home.outputText}</p>
                </div>
            </section>

            {homeKpis.length > 0 && (
                <section className="card">
                    <h2>{texts.home.kpiTitle || texts.home.whyTitle}</h2>
                    <div className="services-kpi-strip" aria-label="Home highlights">
                        {homeKpis.map((kpi) => (
                            <span key={kpi} className="services-kpi-chip">{kpi}</span>
                        ))}
                    </div>
                </section>
            )}

            {homePillars.length > 0 && (
                <section className="card services-section">
                    <h2>{texts.home.pillarsTitle || texts.home.outputTitle}</h2>
                    <div className="grid wide-grid">
                        {homePillars.map((pillar, index) => (
                            <article key={`${pillar.title}-${index}`} className="service-item">
                                <div className="service-item-head">
                                    <span className="service-item-icon" aria-hidden="true">{homePillarIcons[index] || "✔"}</span>
                                    <h3>{pillar.title}</h3>
                                </div>
                                <p>{pillar.text}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {homeWorkflowSteps.length > 0 && (
                <section className="card services-section">
                    <h2>{texts.home.workflowTitle || texts.contact.processTitle}</h2>
                    <div className="home-workflow-grid">
                        {homeWorkflowSteps.map((step, index) => (
                            <article key={`${step.title || step}-${index}`} className="home-workflow-item">
                                <span className="home-step-badge" aria-hidden="true">{index + 1}</span>
                                <div>
                                    <h3>{step.title || `${index + 1}.`}</h3>
                                    <p>{step.text || step}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="card home-cta">
                <h2>{texts.home.ctaTitle || texts.contact.title}</h2>
                <p>{texts.home.ctaText || texts.contact.p1}</p>
                <div className="home-cta-actions">
                    <a href="/sluzby" className="button-link">{texts.home.ctaPrimary || texts.nav.services}</a>
                    <a href="/kontakt" className="button-link button-secondary">{texts.home.ctaSecondary || texts.nav.contact}</a>
                </div>
            </section>
        </>
    );
}

function AboutPage({ texts, language }) {
    const aboutQuote = language === "cs"
        ? "„Stavíme na osobním přístupu, transparentnosti a kvalitně odvedené práci. S námi je dovoz i kontrola vozu jednoduchá, bezpečná a bez zbytečných komplikací.“"
        : language === "sk"
            ? "„Staviame na osobnom prístupe, transparentnosti a kvalitne odvedenej práci. S nami je dovoz aj kontrola vozidla jednoduchá, bezpečná a bez zbytočných komplikácií.“"
        : language === "de"
            ? "„Wir setzen auf persönliche Betreuung, Transparenz und saubere Arbeit. Mit uns sind Import und Fahrzeugprüfung einfach, sicher und ohne unnötige Komplikationen.“"
            : language === "en"
                ? "\"We build every project on personal support, transparency, and high-quality execution. With us, both import and vehicle inspection stay simple, safe, and free of unnecessary complications.\""
                : "„Staviame na osobnom prístupe, transparentnosti a kvalitne odvedenej práci. S nami je dovoz aj kontrola vozidla jednoduchá, bezpečná a bez zbytočných komplikácií.“";

    const extendedAbout = language === "cs"
        ? [
            "Zákazníkům zajišťujeme kompletní proces dovozu – od výběru vozu, prověření historie, technické kontroly před nákupem, přes dopravu až po vyřízení potřebné administrativy a registraci.",
            "Každý vůz pečlivě kontrolujeme, aby měl klient jistotu skutečného technického stavu a jasnou představu o dalších krocích.",
            "Kromě dovozu nabízíme nezávislé technické kontroly všech typů vozidel – osobních, užitkových i sportovních. Naším cílem je minimalizovat rizika při nákupu vozidla a dodat zákazníkům jistotu a klid.",
            "Rozsah služeb pokrývá celý proces dovozu z Japonska nebo USA i profesionální prověření vozidel v České republice a zahraničí před jejich koupí."
        ]
        : language === "sk"
        ? [
            "Klientom zabezpečujeme kompletný proces dovozu – od výberu vozidla, preverenia histórie a technickej kontroly pred kúpou, cez dopravu až po vybavenie potrebnej administratívy a registrácie.",
            "Každé vozidlo dôsledne kontrolujeme, aby mal klient istotu reálneho technického stavu a jasnú predstavu o ďalších krokoch.",
            "Okrem dovozu poskytujeme aj nezávislé technické kontroly všetkých typov vozidiel – osobných, úžitkových aj športových. Naším cieľom je minimalizovať riziká pri kúpe vozidla a priniesť klientom istotu a pokoj.",
            "Rozsah služieb pokrýva celý proces dovozu z Japonska alebo USA aj profesionálne preverenie vozidiel v Českej republike a v zahraničí pred ich kúpou."
        ]
        : language === "de"
        ? [
            "Wir sichern unseren Kunden den kompletten Importprozess: von der Fahrzeugauswahl, Historienprüfung und technischen Kontrolle vor dem Kauf über den Transport bis zur gesamten Administration und Zulassung.",
            "Jedes Fahrzeug prüfen wir sorgfältig, damit Sie den realen technischen Zustand kennen und klare nächste Schritte haben.",
            "Neben dem Import bieten wir unabhängige technische Prüfungen für alle Fahrzeugtypen an – Pkw, Nutzfahrzeuge und Sportwagen. Unser Ziel ist es, Kauf-Risiken zu minimieren und Ihnen Sicherheit und Ruhe zu geben.",
            "Unser Leistungsumfang deckt den gesamten Import aus Japan oder den USA sowie professionelle Vorkaufprüfungen in Tschechien und im Ausland ab."
        ]
        : language === "en"
        ? [
            "We provide a complete import process—from vehicle selection, history verification, and technical pre-purchase checks to transport, paperwork, and registration.",
            "Every vehicle is thoroughly inspected so you clearly understand its actual technical condition and the next practical steps.",
            "In addition to import services, we deliver independent technical inspections for all vehicle types—passenger, commercial, and sports. Our goal is to reduce purchase risk and give clients confidence and peace of mind.",
            "Our service scope covers full import from Japan or the USA as well as professional pre-purchase verification in Czechia and abroad."
        ]
        : [];

    return (
        <>
            <section className="card">
                <h2>{texts.about.title}</h2>
                <p>{texts.about.p1}</p>
                <p>{texts.about.p2}</p>
                <blockquote>
                    <p>{aboutQuote}</p>
                    <cite>— ZMR Automotive</cite>
                </blockquote>
                {extendedAbout.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </section>

            <section className="card">
                <h2>{texts.about.locationTitle}</h2>
                <p>{texts.about.locationText}</p>
                <div className="map-wrap">
                    <iframe
                        title="Google mapa Praha"
                        src="https://www.google.com/maps?q=Praha&output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </>
    );
}

function ServicesPage({ texts, language }) {
    const serviceContent = SERVICES_PAGE_CONTENT[language] || SERVICES_PAGE_CONTENT.sk;
    const serviceIcons = ["🔍", "🧪", "🚢", "🛠️", "✅"];
    const languageContextSuffix = `%0D%0A%0D%0ALanguage:%20${encodeURIComponent(String(language || "cs").toUpperCase())}%0D%0ASource:%20Services%20page%0D%0ACampaign:%20website-services`;
    const withLanguageContext = (encodedBody) => `${String(encodedBody || "")}${languageContextSuffix}`;

    return (
        <>
            <section className="card">
                <h2>{texts.services.title}</h2>
                <p>{texts.services.intro}</p>
                <div className="services-kpi-strip" aria-label="Services highlights">
                    {serviceContent.kpis.map((kpi) => (
                        <span key={kpi} className="services-kpi-chip">{kpi}</span>
                    ))}
                </div>
            </section>

            <section className="grid wide-grid">
                {texts.services.items.map((service, index) => (
                    <article key={service.title} className="service-item">
                        <div className="service-item-head">
                            <span className="service-item-icon" aria-hidden="true">{serviceIcons[index] || "✔"}</span>
                            <h3>{service.title}</h3>
                        </div>
                        <p>{service.text}</p>
                    </article>
                ))}
            </section>

            <section className="card services-section">
                <h2>{serviceContent.highlightsTitle}</h2>
                <div className="services-highlights-grid">
                    {serviceContent.highlights.map((item) => (
                        <article key={item.title} className="services-highlight-item">
                            <span className="services-highlight-icon" aria-hidden="true">{item.icon}</span>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="card services-section">
                <h2>{serviceContent.processTitle}</h2>
                <div className="services-process-grid">
                    {serviceContent.processSteps.map((step) => (
                        <article key={step.title} className="services-process-item">
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="card services-section">
                <h2>{serviceContent.deliverablesTitle}</h2>
                <div className="services-deliverables-grid">
                    {serviceContent.deliverables.map((item) => (
                        <div key={item} className="services-deliverable-item">
                            <span aria-hidden="true">✔</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="card services-section">
                <div className="services-variants-grid">
                    <article className="services-variant-card luxury">
                        <h3>{serviceContent.luxuryTitle}</h3>
                        <ul>
                            {serviceContent.luxuryPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <a
                            href={`mailto:info@zmrautomovite.cz?subject=${encodeURIComponent(serviceContent.luxurySubject)}&body=${withLanguageContext(serviceContent.luxuryBody)}`}
                            className="button-link button-secondary"
                        >
                            {serviceContent.luxuryButton}
                        </a>
                    </article>
                    <article className="services-variant-card technical">
                        <h3>{serviceContent.technicalTitle}</h3>
                        <ul>
                            {serviceContent.technicalPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <a
                            href={`mailto:info@zmrautomovite.cz?subject=${encodeURIComponent(serviceContent.technicalSubject)}&body=${withLanguageContext(serviceContent.technicalBody)}`}
                            className="button-link button-secondary"
                        >
                            {serviceContent.technicalButton}
                        </a>
                    </article>
                </div>
            </section>

            <section className="card services-cta">
                <h2>{serviceContent.ctaTitle}</h2>
                <p>{serviceContent.ctaText}</p>
                <div className="services-cta-actions">
                    <a href="/kontakt" className="button-link">{serviceContent.ctaButton}</a>
                    <a
                        href={`mailto:info@zmrautomovite.cz?subject=${encodeURIComponent(serviceContent.customSubject)}&body=${withLanguageContext(serviceContent.customBody)}`}
                        className="button-link button-secondary"
                    >
                        {serviceContent.customButton}
                    </a>
                </div>
            </section>
        </>
    );
}

function ContactPage({ texts, language }) {
    const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [contactStatus, setContactStatus] = useState("");
    const [isContactSending, setIsContactSending] = useState(false);

    const contactLabels = language === "de"
            ? { title: "Unverbindliche Anfrage", name: "Name", email: "E-Mail", phone: "Telefon", message: "Ihre Nachricht", button: "Anfrage senden", sending: "Anfrage wird gesendet...", success: "Danke, Ihre Anfrage wurde erfolgreich gesendet.", error: "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut." }
            : language === "en"
                ? { title: "Non-binding inquiry", name: "Name", email: "Email", phone: "Phone", message: "Your message", button: "Send inquiry", sending: "Sending inquiry...", success: "Thank you, your inquiry was sent successfully.", error: "Inquiry could not be sent. Please try again." }
                : language === "sk"
                    ? { title: "Nezáväzný dopyt", name: "Meno", email: "E-mail", phone: "Telefón", message: "Vaša správa", button: "Odoslať dopyt", sending: "Odosielam dopyt...", success: "Ďakujeme, dopyt bol úspešne odoslaný.", error: "Dopyt sa nepodarilo odoslať. Skúste to prosím znova." }
                    : { title: "Nezávazná poptávka", name: "Jméno", email: "E-mail", phone: "Telefon", message: "Váš dotaz", button: "Odeslat dotaz", sending: "Odesílám dotaz...", success: "Děkujeme, dotaz byl úspěšně odeslán.", error: "Dotaz se nepodařilo odeslat. Zkuste to prosím znovu." };

    const submitContactInquiry = async (event) => {
        event.preventDefault();
        if (isContactSending) {
            return;
        }

        setContactStatus(contactLabels.sending);
        setIsContactSending(true);

        const payload = {
            requestId: createRequestId("contact"),
            language,
            source: "contact-page",
            campaign: "website-contact-inquiry",
            toEmail: RESERVATION_EMAIL,
            subject: `Kontaktní poptávka (${String(language || "cs").toUpperCase()})`,
            text: `Source: contact-page\nLanguage: ${String(language || "cs").toUpperCase()}\n\nName: ${String(contactForm.name || "")}\nEmail: ${String(contactForm.email || "")}\nPhone: ${String(contactForm.phone || "")}\n\nMessage:\n${String(contactForm.message || "")}`,
            form: {
                name: String(contactForm.name || ""),
                email: String(contactForm.email || ""),
                phone: String(contactForm.phone || ""),
                message: String(contactForm.message || "")
            }
        };

        const result = await sendReservationEmailViaProxy(payload);
        if (!result.ok) {
            setContactStatus(contactLabels.error);
            setIsContactSending(false);
            return;
        }

        setContactForm({ name: "", email: "", phone: "", message: "" });
        setContactStatus(contactLabels.success);
        setIsContactSending(false);
    };

    return (
        <>
            <section className="card">
                <h2>{texts.contact.title}</h2>
                <p>{texts.contact.p1}</p>
                <p>
                    Telefón: <a href="tel:+420000000000">+420 000 000 000</a>
                    <br />
                    E-mail: <a href="mailto:info@zmrautomovite.cz">info@zmrautomovite.cz</a>
                </p>
            </section>

            <section className="card">
                <h2>{texts.contact.processTitle}</h2>
                <p>{texts.contact.processText}</p>
            </section>

            <section className="card inquiry-card">
                <h2>{contactLabels.title}</h2>
                <form className="form-grid inquiry-form" onSubmit={submitContactInquiry} autoComplete="off">
                    <label>
                        {contactLabels.name}
                        <input type="text" value={contactForm.name} onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))} required />
                    </label>
                    <label>
                        {contactLabels.email}
                        <input type="email" value={contactForm.email} onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))} required />
                    </label>
                    <label>
                        {contactLabels.phone}
                        <input type="tel" value={contactForm.phone} onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))} />
                    </label>
                    <label className="full-width">
                        {contactLabels.message}
                        <textarea rows={5} value={contactForm.message} onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))} required></textarea>
                    </label>
                    <button type="submit" className="button-link" disabled={isContactSending}>{contactLabels.button}</button>
                </form>
                {contactStatus && <p className="car-meta">{contactStatus}</p>}
            </section>
        </>
    );
}

function CarsPage({ cars, language, texts }) {
    const reservationTexts = useMemo(() => getReservationTexts(language), [language]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [fuel, setFuel] = useState("");
    const [horsepowerFrom, setHorsepowerFrom] = useState("");
    const [horsepowerTo, setHorsepowerTo] = useState("");
    const [doors, setDoors] = useState("");
    const [seatsFrom, setSeatsFrom] = useState("");
    const [seatsTo, setSeatsTo] = useState("");
    const [brand, setBrand] = useState("");
    const [drive, setDrive] = useState("");
    const [transmission, setTransmission] = useState("");
    const resetFiltersLabel = RESET_LABELS[language] || RESET_LABELS.cs;
    const resultsLabel = RESULTS_LABELS[language] || RESULTS_LABELS.cs;
    const autoResetNoticeLabel = AUTO_RESET_FILTERS_LABELS[language] || AUTO_RESET_FILTERS_LABELS.cs;
    const [showAutoResetNotice, setShowAutoResetNotice] = useState(false);
    const [pageLimit] = useState(CARS_PER_PAGE);

    const fuelOptions = useMemo(() => FUEL_OPTIONS, []);
    const brandOptions = useMemo(() => Array.from(new Set(cars.map((car) => car.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)), [cars, language]);
    const driveOptions = useMemo(() => DRIVE_OPTIONS, []);
    const seatValues = useMemo(() => cars.map((car) => Number(car.seats)).filter((count) => Number.isFinite(count) && count >= 2), [cars]);
    const seatsMinBound = 2;
    const seatsMaxBound = seatValues.length > 0 ? Math.max(...seatValues) : 9;
    const seatsFromCurrent = Number.isFinite(parseNumber(seatsFrom)) ? Math.min(seatsMaxBound, Math.max(seatsMinBound, parseNumber(seatsFrom))) : seatsMinBound;
    const seatsToCurrent = Number.isFinite(parseNumber(seatsTo)) ? Math.max(seatsMinBound, Math.min(seatsMaxBound, parseNumber(seatsTo))) : seatsMaxBound;
    const seatsRangeFrom = Math.min(seatsFromCurrent, seatsToCurrent);
    const seatsRangeTo = Math.max(seatsFromCurrent, seatsToCurrent);
    const hasSeatsFilter = seatsFromCurrent > seatsMinBound || seatsToCurrent < seatsMaxBound;
    const horsepowerValues = useMemo(() => cars.map((car) => Number(car.horsepower)).filter((count) => Number.isFinite(count) && count >= 0), [cars]);
    const horsepowerMinBound = HORSEPOWER_MIN_FILTER;
    const horsepowerMaxBound = Math.max(HORSEPOWER_MIN_FILTER, horsepowerValues.length > 0 ? Math.max(...horsepowerValues) : 500);
    const horsepowerFromCurrent = Number.isFinite(parseNumber(horsepowerFrom)) ? Math.min(horsepowerMaxBound, Math.max(horsepowerMinBound, parseNumber(horsepowerFrom))) : horsepowerMinBound;
    const horsepowerToCurrent = Number.isFinite(parseNumber(horsepowerTo)) ? Math.max(horsepowerMinBound, Math.min(horsepowerMaxBound, parseNumber(horsepowerTo))) : horsepowerMaxBound;
    const horsepowerRangeFrom = Math.min(horsepowerFromCurrent, horsepowerToCurrent);
    const horsepowerRangeTo = Math.max(horsepowerFromCurrent, horsepowerToCurrent);
    const hasHorsepowerFilter = horsepowerFromCurrent > horsepowerMinBound || horsepowerToCurrent < horsepowerMaxBound;
    const doorOptions = useMemo(() => Array.from(new Set(cars.map((car) => Number(car.doors)).filter((count) => Number.isFinite(count) && count > 0))).sort((a, b) => a - b), [cars]);
    const fuelSelectOptions = useMemo(() => fuelOptions.map((option) => ({ value: option, label: option })), [fuelOptions]);
    const brandSelectOptions = useMemo(() => brandOptions.map((option) => ({ value: option, label: option })), [brandOptions]);
    const driveSelectOptions = useMemo(() => driveOptions.map((option) => ({ value: option, label: option })), [driveOptions]);
    const transmissionSelectOptions = useMemo(() => TRANSMISSION_OPTIONS.map((option) => ({ value: option, label: option })), []);
    const doorSelectOptions = useMemo(() => doorOptions.map((option) => ({ value: String(option), label: String(option) })), [doorOptions]);
    const filteredCars = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();
        const hpFromValue = hasHorsepowerFilter ? horsepowerRangeFrom : undefined;
        const hpToValue = hasHorsepowerFilter ? horsepowerRangeTo : undefined;
        const seatsFromValue = hasSeatsFilter ? seatsRangeFrom : undefined;
        const seatsToValue = hasSeatsFilter ? seatsRangeTo : undefined;
        const noFiltersSet = !query && !fuel && !brand && !drive && !transmission && !doors && !hasSeatsFilter && !hasHorsepowerFilter;

        if (noFiltersSet) {
            return [...cars].sort((a, b) => getCarAvailabilityRank(a) - getCarAvailabilityRank(b));
        }

        return cars
            .filter((car) => {
                const matchesQuery = !query || [car.name, car.brand, car.fuel, car.transmission, car.drive].join(" ").toLowerCase().includes(query);
                const matchesFuel = !fuel || car.fuel === fuel;
                const matchesBrand = !brand || car.brand === brand;
                const matchesDrive = !drive || car.drive === drive;
                const matchesTransmission = !transmission || car.transmission === transmission;
                const matchesDoors = !doors || String(car.doors) === String(doors);
                const carSeats = Number(car.seats);
                const matchesMinSeats = !Number.isFinite(seatsFromValue) || carSeats >= seatsFromValue;
                const matchesMaxSeats = !Number.isFinite(seatsToValue) || carSeats <= seatsToValue;
                const carHorsepower = Number(car.horsepower);
                const matchesMinHorsepower = !Number.isFinite(hpFromValue) || carHorsepower >= hpFromValue;
                const matchesMaxHorsepower = !Number.isFinite(hpToValue) || carHorsepower <= hpToValue;

                return matchesQuery && matchesFuel && matchesBrand && matchesDrive && matchesTransmission && matchesDoors && matchesMinSeats && matchesMaxSeats && matchesMinHorsepower && matchesMaxHorsepower;
            })
            .sort((a, b) => getCarAvailabilityRank(a) - getCarAvailabilityRank(b));
    }, [cars, debouncedSearch, fuel, brand, drive, transmission, doors, hasSeatsFilter, seatsRangeFrom, seatsRangeTo, hasHorsepowerFilter, horsepowerRangeFrom, horsepowerRangeTo]);
    const carsForRender = useMemo(() => {
        if (filteredCars.length > 0) {
            return filteredCars;
        }
        if (cars.length > 0) {
            return [...cars].sort((a, b) => getCarAvailabilityRank(a) - getCarAvailabilityRank(b));
        }
        return [];
    }, [filteredCars, cars]);
    const limitedCarsForRender = useMemo(() => carsForRender.slice(0, pageLimit), [carsForRender, pageLimit]);

    const hasActiveFilters = Boolean(search || fuel || hasHorsepowerFilter || hasSeatsFilter || doors || brand || drive || transmission);
    const activeFilterChips = [];

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(search);
        }, 150);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [search]);

    useEffect(() => {
        const handlePopState = () => {
            const nextFilters = readCarFiltersFromQuery();
            setSearch(nextFilters.search);
            setDebouncedSearch(nextFilters.search);
            setFuel(nextFilters.fuel);
            setBrand(nextFilters.brand);
            setDrive(nextFilters.drive);
            setTransmission(nextFilters.transmission);
            setDoors(nextFilters.doors);
            setSeatsFrom(nextFilters.seatsFrom);
            setSeatsTo(nextFilters.seatsTo);
            setHorsepowerFrom(nextFilters.horsepowerFrom);
            setHorsepowerTo(nextFilters.horsepowerTo);
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        setSearch("");
        setDebouncedSearch("");
        setFuel("");
        setBrand("");
        setDrive("");
        setTransmission("");
        setDoors("");
        setSeatsFrom("");
        setSeatsTo("");
        setHorsepowerFrom("");
        setHorsepowerTo("");
        syncCarFiltersToQuery({
            search: "",
            fuel: "",
            brand: "",
            drive: "",
            transmission: "",
            doors: "",
            seatsFrom: "",
            seatsTo: "",
            horsepowerFrom: "",
            horsepowerTo: ""
        });
    }, []);

    useEffect(() => {
        syncCarFiltersToQuery({
            search: debouncedSearch,
            fuel,
            brand,
            drive,
            transmission,
            doors,
            seatsFrom: hasSeatsFilter ? String(seatsRangeFrom) : "",
            seatsTo: hasSeatsFilter ? String(seatsRangeTo) : "",
            horsepowerFrom: hasHorsepowerFilter ? String(horsepowerRangeFrom) : "",
            horsepowerTo: hasHorsepowerFilter ? String(horsepowerRangeTo) : ""
        });
    }, [debouncedSearch, fuel, brand, drive, transmission, doors, hasSeatsFilter, seatsRangeFrom, seatsRangeTo, hasHorsepowerFilter, horsepowerRangeFrom, horsepowerRangeTo]);

    if (search) {
        activeFilterChips.push({ key: "search", label: `${texts.cars.search}: ${search}`, clear: () => setSearch("") });
    }
    if (fuel) {
        activeFilterChips.push({ key: "fuel", label: `${texts.cars.fuel}: ${fuel}`, clear: () => setFuel("") });
    }
    if (brand) {
        activeFilterChips.push({ key: "brand", label: `${texts.cars.brand}: ${brand}`, clear: () => setBrand("") });
    }
    if (drive) {
        activeFilterChips.push({ key: "drive", label: `${texts.cars.drive}: ${drive}`, clear: () => setDrive("") });
    }
    if (transmission) {
        activeFilterChips.push({ key: "transmission", label: `${texts.cars.transmission}: ${transmission}`, clear: () => setTransmission("") });
    }
    if (doors) {
        activeFilterChips.push({ key: "doors", label: `${texts.cars.doors}: ${doors}`, clear: () => setDoors("") });
    }
    if (hasSeatsFilter) {
        activeFilterChips.push({ key: "seatsFrom", label: `${texts.cars.seatsFrom}: ${seatsRangeFrom}`, clear: () => { setSeatsFrom(""); setSeatsTo(""); } });
        activeFilterChips.push({ key: "seatsTo", label: `${texts.cars.seatsTo}: ${seatsRangeTo}`, clear: () => { setSeatsFrom(""); setSeatsTo(""); } });
    }
    if (hasHorsepowerFilter) {
        activeFilterChips.push({ key: "hpFrom", label: `${texts.cars.hpFrom}: ${horsepowerRangeFrom}`, clear: () => { setHorsepowerFrom(""); setHorsepowerTo(""); } });
        activeFilterChips.push({ key: "hpTo", label: `${texts.cars.hpTo}: ${horsepowerRangeTo}`, clear: () => { setHorsepowerFrom(""); setHorsepowerTo(""); } });
    }

    const clearFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setFuel("");
        setHorsepowerFrom("");
        setHorsepowerTo("");
        setDoors("");
        setSeatsFrom("");
        setSeatsTo("");
        setBrand("");
        setDrive("");
        setTransmission("");
    };

    useEffect(() => {
        if (filteredCars.length === 0 && hasActiveFilters) {
            clearFilters();
            setShowAutoResetNotice(true);
        }
    }, [filteredCars.length, hasActiveFilters]);

    useEffect(() => {
        if (!showAutoResetNotice) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setShowAutoResetNotice(false);
        }, 3200);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [showAutoResetNotice]);

    const applyQuickSeats = (minSeats) => {
        setSeatsFrom(String(Math.max(seatsMinBound, minSeats)));
        setSeatsTo(String(seatsMaxBound));
    };

    const isQuickSeatActive = (minSeats) => hasSeatsFilter && seatsFromCurrent === Math.max(seatsMinBound, minSeats) && seatsToCurrent === seatsMaxBound;

    return (
        <>
            <section className="card filters-card">
                <div className="filters-head">
                    <h2>{texts.cars.filterTitle}</h2>
                    <div className="filters-tools">
                        <span className="results-badge">{limitedCarsForRender.length} {resultsLabel}</span>
                        <button type="button" className="filters-reset" onClick={clearFilters} disabled={!hasActiveFilters}>
                            ↺ {resetFiltersLabel}
                        </button>
                    </div>
                </div>
                {showAutoResetNotice && <p className="filters-auto-reset-notice">{autoResetNoticeLabel}</p>}
                <label className="search-row">
                    <span>{texts.cars.search}</span>
                    <div className="search-input-wrap">
                        <span className="search-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79L19 21.5 21.5 19l-4.5-5zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
                            </svg>
                        </span>
                        <input type="text" autoComplete="off" placeholder={texts.cars.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
                    </div>
                </label>
                <div className="seats-quick-row">
                    <span>{texts.cars.quickSeats}</span>
                    <div className="seats-quick-buttons">
                        <button type="button" className={isQuickSeatActive(2) ? "quick-seat-btn active" : "quick-seat-btn"} aria-pressed={isQuickSeatActive(2)} onClick={() => applyQuickSeats(2)}>2+</button>
                        <button type="button" className={isQuickSeatActive(5) ? "quick-seat-btn active" : "quick-seat-btn"} aria-pressed={isQuickSeatActive(5)} onClick={() => applyQuickSeats(5)}>5+</button>
                        <button type="button" className={isQuickSeatActive(7) ? "quick-seat-btn active" : "quick-seat-btn"} aria-pressed={isQuickSeatActive(7)} onClick={() => applyQuickSeats(7)}>7+</button>
                    </div>
                </div>
                {activeFilterChips.length > 0 && (
                    <div className="active-filters-wrap">
                        <span className="active-filters-label">{texts.cars.activeFilters}</span>
                        <div className="active-filters-list">
                            {activeFilterChips.map((chip) => (
                                <button key={chip.key} type="button" className="filter-chip" onClick={chip.clear}>
                                    <span>{chip.label}</span>
                                    <span aria-hidden="true">✕</span>
                                </button>
                            ))}
                            <button type="button" className="filter-chip clear-all" onClick={clearFilters}>
                                {texts.cars.clearAll}
                            </button>
                        </div>
                    </div>
                )}
                <div className="filters-grid">
                    <label>
                        {texts.cars.fuel}
                        <DarkSelect value={fuel} onChange={setFuel} options={fuelSelectOptions} placeholder={texts.cars.fuelAll} ariaLabel={texts.cars.fuel} />
                    </label>
                    <label>
                        {texts.cars.brand}
                        <DarkSelect value={brand} onChange={setBrand} options={brandSelectOptions} placeholder={texts.cars.brandAll} ariaLabel={texts.cars.brand} />
                    </label>
                    <label>
                        {texts.cars.drive}
                        <DarkSelect value={drive} onChange={setDrive} options={driveSelectOptions} placeholder={texts.cars.driveAll} ariaLabel={texts.cars.drive} />
                    </label>
                    <label>
                        {texts.cars.doors}
                        <DarkSelect value={doors} onChange={setDoors} options={doorSelectOptions} placeholder={texts.cars.doorsAll} ariaLabel={texts.cars.doors} />
                    </label>
                    <label>
                        {texts.cars.transmission}
                        <DarkSelect value={transmission} onChange={setTransmission} options={transmissionSelectOptions} placeholder={texts.cars.transmissionAll} ariaLabel={texts.cars.transmission} />
                    </label>
                    <div className="hp-range-field">
                        <span>{texts.cars.hpFrom}</span>
                        <div className="hp-range-values">
                            <strong>{horsepowerFromCurrent} {texts.common.horsepowerUnit}</strong>
                            <strong>{horsepowerMaxBound} {texts.common.horsepowerUnit}</strong>
                        </div>
                        <div className="single-range-row">
                            <span>{texts.cars.hpFrom}</span>
                            <input
                                type="range"
                                min={horsepowerMinBound}
                                max={horsepowerMaxBound}
                                value={horsepowerFromCurrent}
                                onChange={(event) => {
                                    const next = Math.min(Number(event.target.value), horsepowerMaxBound);
                                    setHorsepowerFrom(String(next));
                                    setHorsepowerTo(String(horsepowerMaxBound));
                                }}
                            />
                        </div>
                        <div className="range-bounds" aria-hidden="true">
                            <span>{horsepowerMinBound} {texts.common.horsepowerUnit}</span>
                            <span>{horsepowerMaxBound} {texts.common.horsepowerUnit}</span>
                        </div>
                    </div>
                    <div className="seat-range-field">
                        <span>{texts.cars.seatsFrom}</span>
                        <div className="hp-range-values">
                            <strong>{seatsFromCurrent} {texts.cars.seatsUnit}</strong>
                            <strong>{seatsMaxBound} {texts.cars.seatsUnit}</strong>
                        </div>
                        <div className="single-range-row">
                            <span>{texts.cars.seatsFrom}</span>
                            <input
                                type="range"
                                min={seatsMinBound}
                                max={seatsMaxBound}
                                value={seatsFromCurrent}
                                onChange={(event) => {
                                    const next = Math.min(Number(event.target.value), seatsMaxBound);
                                    setSeatsFrom(String(next));
                                    setSeatsTo(String(seatsMaxBound));
                                }}
                            />
                        </div>
                        <div className="range-bounds" aria-hidden="true">
                            <span>{seatsMinBound} {texts.cars.seatsUnit}</span>
                            <span>{seatsMaxBound} {texts.cars.seatsUnit}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid wide-grid">
                {limitedCarsForRender.map((car) => (
                    (() => {
                        const localizedName = getLocalizedCarText(car, "name", language);
                        const localizedDescription = getLocalizedCarText(car, "description", language);
                        return (
                    <article key={car.id} className="car-card">
                        <img src={getCarThumbnail(car)} alt={localizedName} className="car-image" />
                        <div className="car-content">
                            <h2>{localizedName}</h2>
                            <p className="car-meta">
                                {car.year} • {car.mileage} • {car.fuel} • {car.drive}
                            </p>
                            <div className="car-spec-grid">
                                <p className="car-meta">{car.doors} {texts.common.doorsUnit} • {formatTransmission(car)}</p>
                                <p className="car-meta">{car.horsepower} {texts.common.horsepowerUnit} • {car.seats} {texts.cars.seatsUnit || "sedadiel"}</p>
                            </div>
                            <p>{localizedDescription}</p>
                            <p className={car.reserved ? "status reserved" : (car.available ? "status available" : "status unavailable")}>
                                {car.reserved ? reservationTexts.statusReserved : (car.available ? texts.common.statusAvailable : texts.common.statusUnavailable)}
                            </p>
                            <div className="car-footer">
                                <strong>{formatPrice(car.priceCzk, language)}</strong>
                                <a href={`/vozidlo?id=${encodeURIComponent(car.id)}`} className="button-link">{texts.cars.detailButton}</a>
                            </div>
                        </div>
                    </article>
                        );
                    })()
                ))}
            </section>

            {limitedCarsForRender.length === 0 && (
                <section className="card">
                    <p>{texts.cars.noResults}</p>
                </section>
            )}
        </>
    );
}

function CarDetailPage({ cars, setCars, language, texts, isCarsLoading = false }) {
    const reservationTexts = useMemo(() => getReservationTexts(language), [language]);
    const carId = readCarIdFromQuery();
    const car = cars.find((item) => item.id === carId) || cars[0];
    const hasCar = Boolean(car);
    const [dynamicTechnicalValues, setDynamicTechnicalValues] = useState({});
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reservationForm, setReservationForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [reservationMessage, setReservationMessage] = useState("");
    const [isReservationSending, setIsReservationSending] = useState(false);

    const technicalRows = hasCar ? getTechnicalData(car) : [];
    const equipmentRows = hasCar ? getEquipmentItems(car) : [];
    const detailImages = hasCar ? getCarImages(car) : [];
    const detailMainImage = detailImages[Math.min(selectedImageIndex, detailImages.length - 1)] || detailImages[0];
    const localizedName = hasCar ? getLocalizedCarText(car, "name", language) : "";
    const localizedDescription = hasCar ? getLocalizedCarText(car, "description", language) : "";
    const localizedLegal = hasCar ? getLocalizedCarText(car, "legal", language) : "";

    useEffect(() => {
        if (!hasCar) {
            return;
        }
        setSelectedImageIndex(Number.isInteger(car?.thumbnailIndex) ? car.thumbnailIndex : 0);
        setReservationMessage("");
    }, [hasCar, car?.id]);

    const submitReservation = async (event) => {
        event.preventDefault();
        if (!hasCar || !car.available || car.reserved || isReservationSending) {
            setReservationMessage(reservationTexts.alreadyReserved);
            return;
        }

        setReservationMessage(reservationTexts.reserveSending);
        setIsReservationSending(true);
        const reservedAt = new Date();
        const reservedAtIso = reservedAt.toISOString();
        const reservedAtLocal = formatReservationDateTime(reservedAt, language);

        const reservationPayload = {
            requestId: createRequestId("res"),
            language,
            source: "vehicle-detail-page",
            campaign: "website-reservation",
            toEmail: RESERVATION_EMAIL,
            subject: reservationTexts.reservationSubject(localizedName),
            text: reservationTexts.reservationBody(car, reservationForm, reservedAtIso, reservedAtLocal),
            reservedAt: {
                iso: reservedAtIso,
                local: reservedAtLocal
            },
            car: {
                id: car.id,
                name: localizedName,
                year: car.year,
                priceCzk: car.priceCzk
            },
            form: {
                firstName: String(reservationForm.firstName || ""),
                lastName: String(reservationForm.lastName || ""),
                email: String(reservationForm.email || ""),
                phone: String(reservationForm.phone || "")
            }
        };

        const reservationResult = await sendReservationEmailViaProxy(reservationPayload);
        if (!reservationResult.ok) {
            setReservationMessage(reservationResult.error === "missing-endpoint" ? reservationTexts.reserveErrorConfig : reservationTexts.reserveErrorSend);
            setIsReservationSending(false);
            return;
        }

        const updatedCars = cars.map((item) => item.id === car.id ? touchCarForUpdate(item, { reserved: true }) : item);
        setCars(updatedCars);
        saveCars(updatedCars);

        setReservationMessage(reservationTexts.reservedSuccess);
        setIsReservationSending(false);
    };

    useEffect(() => {
        if (!hasCar) {
            return undefined;
        }
        let active = true;
        setDynamicTechnicalValues({});

        const values = technicalRows.map((row) => row?.value).filter(Boolean);
        fetchTechnicalValueTranslations(values, language).then((translations) => {
            if (!active || !translations || Object.keys(translations).length === 0) {
                return;
            }
            setDynamicTechnicalValues(translations);
        });

        return () => {
            active = false;
        };
    }, [hasCar, car?.id, language]);

    if (!hasCar && isCarsLoading) {
        return (
            <section className="card">
                <h2>{texts.pages.carDetail.title}</h2>
                <p>{texts.common?.loading || "Načítavam vozidlo…"}</p>
            </section>
        );
    }

    if (!hasCar) {
        return (
            <section className="card">
                <h2>{texts.carDetail.notFoundTitle}</h2>
                <p>{texts.carDetail.notFoundText}</p>
            </section>
        );
    }

    return (
        <>
            <section className="card detail-card">
                <div>
                    <img src={detailMainImage} alt={localizedName} className="detail-image" />
                    {detailImages.length > 1 && (
                        <div className="detail-gallery-thumbs">
                            {detailImages.map((src, index) => (
                                <button key={`${src}-${index}`} type="button" className={index === selectedImageIndex ? "detail-thumb active" : "detail-thumb"} onClick={() => setSelectedImageIndex(index)}>
                                    <img src={src} alt={`${localizedName} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h2>{localizedName}</h2>
                    <p className="car-meta">
                                {car.year} • {car.mileage} • {car.fuel} • {car.drive}
                            </p>
                            <div className="car-spec-grid">
                                <p className="car-meta">{car.doors} {texts.common.doorsUnit} • {formatTransmission(car)}</p>
                                <p className="car-meta">{car.horsepower} {texts.common.horsepowerUnit} • {car.seats} {texts.cars.seatsUnit || "sedadiel"}</p>
                            </div>
                    <p className="car-meta">👤 {texts.carDetail.previousOwners}: {car.previousOwners}</p>
                    <p>{localizedDescription}</p>
                    <p><strong>{texts.common.price}:</strong> {formatPrice(car.priceCzk, language)}</p>
                    <p className={car.reserved ? "status reserved" : (car.available ? "status available" : "status unavailable")}>
                        {car.reserved ? reservationTexts.statusReserved : (car.available ? texts.common.statusAvailable : texts.common.statusUnavailable)}
                    </p>
                    <h3>{texts.carDetail.legalTitle}</h3>
                    <p>{localizedLegal}</p>
                    <div className="reservation-box">
                        <h3>{reservationTexts.reserveTitle}</h3>
                        {!car.reserved && car.available && (
                            <form className="reservation-form" onSubmit={submitReservation}>
                                <input type="text" value={reservationForm.firstName} onChange={(e) => setReservationForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder={reservationTexts.firstName} required disabled={isReservationSending} />
                                <input type="text" value={reservationForm.lastName} onChange={(e) => setReservationForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder={reservationTexts.lastName} required disabled={isReservationSending} />
                                <input type="email" value={reservationForm.email} onChange={(e) => setReservationForm((prev) => ({ ...prev, email: e.target.value }))} placeholder={reservationTexts.email} required disabled={isReservationSending} />
                                <input type="tel" value={reservationForm.phone} onChange={(e) => setReservationForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder={reservationTexts.phone} required disabled={isReservationSending} />
                                <button type="submit" className="button-link" disabled={isReservationSending}>{isReservationSending ? reservationTexts.reserveSending : reservationTexts.reserveButton}</button>
                            </form>
                        )}
                        {reservationMessage && <p className="car-meta">{reservationMessage}</p>}
                        {(!car.available || car.reserved) && <p className="car-meta">{reservationTexts.reserveUnavailable}</p>}
                    </div>
                </div>
            </section>

            <section className="card detail-accordions">
                <details className="modern-accordion" open>
                    <summary>
                        <span>📋 {texts.carDetail.technicalTitle}</span>
                        <span className="accordion-arrow">▾</span>
                    </summary>
                    <div className="accordion-content technical-grid">
                        {technicalRows.map((row, index) => (
                            <article key={`${row.label}-${index}`} className="technical-item">
                                <span className="technical-icon" title={translateTechnicalIconLabel(row.icon || "🧾", language)} aria-label={translateTechnicalIconLabel(row.icon || "🧾", language)}>{row.icon || "•"}</span>
                                <div>
                                    <h4>{translateTechnicalLabel(row.label, language)}</h4>
                                    <p>{dynamicTechnicalValues[normalizeTranslationValueKey(row.value)] || translateTechnicalValue(row.value, language)}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </details>

                <details className="modern-accordion">
                    <summary>
                        <span>🧰 {texts.carDetail.equipmentTitle}</span>
                        <span className="accordion-arrow">▾</span>
                    </summary>
                    <div className="accordion-content equipment-grid">
                        {equipmentRows.map((item, index) => (
                            <div key={`${item}-${index}`} className="equipment-item">
                                <span aria-hidden="true">✔</span>
                                <span>{translateEquipmentItem(item, language)}</span>
                            </div>
                        ))}
                    </div>
                </details>
            </section>
        </>
    );
}

function CmsPage({ cars, setCars, language, texts }) {
    const [isLogged, setIsLogged] = useState(localStorage.getItem(CMS_AUTH_KEY) === "1");
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [syncMessage, setSyncMessage] = useState("");
    const [syncMessageType, setSyncMessageType] = useState("info");
    const [editingCarId, setEditingCarId] = useState(null);
    const [dragImageIndex, setDragImageIndex] = useState(null);
    const [dragOverImageIndex, setDragOverImageIndex] = useState(null);
    const [liveMessage, setLiveMessage] = useState("");
    const [isBrandSuggestionsOpen, setIsBrandSuggestionsOpen] = useState(false);
    const [publicBrandOptions, setPublicBrandOptions] = useState([]);
    const [form, setForm] = useState({
        name: "",
        brand: "",
        origin: "German version",
        year: "",
        priceCzk: "",
        mileage: "",
        horsepower: "",
        doors: "",
        seats: "",
        previousOwners: "",
        drive: "",
        fuel: "",
        transmission: "Automat",
        manualGears: "",
        images: [],
        thumbnailIndex: 0,
        description: "",
        legal: "",
        equipment: "",
        status: "available",
        reserved: false,
        available: true
    });
    const [localizedCmsDraftFields, setLocalizedCmsDraftFields] = useState(() => createLocalizedCmsFieldMaps({ name: "", description: "", legal: "" }, language).localized);
    const [isCmsAutoTranslating, setIsCmsAutoTranslating] = useState(false);
    const [technicalChecklist, setTechnicalChecklist] = useState(createInitialTechnicalChecklistState);
    const [equipmentChecklist, setEquipmentChecklist] = useState(createInitialEquipmentChecklistState);
    const cmsUiTexts = useMemo(() => {
        if (language === "de") {
            return {
                edit: "Bearbeiten",
                update: "Änderungen speichern",
                cancelEdit: "Bearbeitung abbrechen",
                setThumbnail: "Als Vorschau festlegen",
                thumbnail: "Vorschau",
                removeImage: "Entfernen",
                imageReadError: "Hochgeladene Bilder konnten nicht gelesen werden.",
                dragHint: "Zum Ändern der Reihenfolge ziehen",
                keyboardHint: "Mit Pfeiltasten verschieben",
                movedToPosition: (position, total) => `Bild auf Position ${position} von ${total} verschoben.`,
                thumbnailSet: (position, total) => `Vorschaubild auf Position ${position} von ${total} eingestellt.`,
                imageRemoved: (position, total) => `Bild ${position} entfernt. Verbleibend: ${total}.`,
                imagesAdded: (added, total) => `Es wurden ${added} Bilder hinzugefügt. Insgesamt: ${total}.`,
                reservedLabel: "Fahrzeug ist reserviert",
                toggleReserved: "Reservierung umschalten",
                statusLabel: "Fahrzeugstatus",
                statusAvailable: "Verfügbar",
                statusReserved: "Reserviert",
                statusUnavailable: "Nicht verfügbar",
                autoTranslatePending: "Automatische Übersetzung läuft für alle Sprachversionen…",
                autoTranslateReady: "Texte sind für alle Sprachversionen synchronisiert.",
                autoTranslateDisabled: "Automatische Übersetzung ist derzeit nicht konfiguriert."
            };
        }
        if (language === "en") {
            return {
                edit: "Edit",
                update: "Save changes",
                cancelEdit: "Cancel edit",
                setThumbnail: "Set as thumbnail",
                thumbnail: "Thumbnail",
                removeImage: "Remove",
                imageReadError: "Unable to read uploaded images.",
                dragHint: "Drag to reorder",
                keyboardHint: "Move with arrow keys",
                movedToPosition: (position, total) => `Image moved to position ${position} of ${total}.`,
                thumbnailSet: (position, total) => `Thumbnail set to position ${position} of ${total}.`,
                imageRemoved: (position, total) => `Image ${position} removed. Remaining: ${total}.`,
                imagesAdded: (added, total) => `${added} images added. Total: ${total}.`,
                reservedLabel: "Vehicle is reserved",
                toggleReserved: "Toggle reservation",
                statusLabel: "Vehicle status",
                statusAvailable: "Available",
                statusReserved: "Reserved",
                statusUnavailable: "Unavailable",
                autoTranslatePending: "Auto-translation is running for all language versions…",
                autoTranslateReady: "Texts are synchronized across all language versions.",
                autoTranslateDisabled: "Auto-translation is not configured right now."
            };
        }
        if (language === "sk") {
            return {
            edit: "Upraviť",
            update: "Uložiť zmeny",
            cancelEdit: "Zrušiť úpravu",
            setThumbnail: "Nastaviť náhľad",
            thumbnail: "Náhľad",
            removeImage: "Odstrániť",
            imageReadError: "Nepodarilo sa načítať nahrané obrázky.",
            dragHint: "Potiahni pre zmenu poradia",
            keyboardHint: "Presuň šípkami",
            movedToPosition: (position, total) => `Obrázok presunutý na pozíciu ${position} z ${total}.`,
            thumbnailSet: (position, total) => `Náhľad nastavený na pozíciu ${position} z ${total}.`,
            imageRemoved: (position, total) => `Obrázok ${position} odstránený. Zostáva: ${total}.`,
            imagesAdded: (added, total) => `Pridané obrázky: ${added}. Celkovo: ${total}.`,
            reservedLabel: "Vozidlo je rezervované",
            toggleReserved: "Prepnúť rezerváciu",
            statusLabel: "Stav vozidla",
            statusAvailable: "Dostupné",
            statusReserved: "Rezervované",
            statusUnavailable: "Nedostupné",
            autoTranslatePending: "Automatický preklad pre všetky jazykové mutácie práve prebieha…",
            autoTranslateReady: "Texty sú zosynchronizované pre všetky jazykové mutácie.",
            autoTranslateDisabled: "Automatický preklad teraz nie je nakonfigurovaný."
        };
        }
        return {
            edit: "Upravit",
            update: "Uložit změny",
            cancelEdit: "Zrušit úpravy",
            setThumbnail: "Nastavit náhled",
            thumbnail: "Náhled",
            removeImage: "Odstranit",
            imageReadError: "Nepodařilo se načíst nahrané obrázky.",
            dragHint: "Přetáhněte pro změnu pořadí",
            keyboardHint: "Přesuňte šipkami",
            movedToPosition: (position, total) => `Obrázek přesunut na pozici ${position} z ${total}.`,
            thumbnailSet: (position, total) => `Náhled nastaven na pozici ${position} z ${total}.`,
            imageRemoved: (position, total) => `Obrázek ${position} odstraněn. Zbývá: ${total}.`,
            imagesAdded: (added, total) => `Přidáno obrázků: ${added}. Celkem: ${total}.`,
            reservedLabel: "Vozidlo je rezervované",
            toggleReserved: "Přepnout rezervaci",
            statusLabel: "Stav vozidla",
            statusAvailable: "Dostupné",
            statusReserved: "Rezervováno",
            statusUnavailable: "Nedostupné",
            autoTranslatePending: "Automatický překlad do všech jazykových mutací právě probíhá…",
            autoTranslateReady: "Texty jsou synchronizované pro všechny jazykové mutace.",
            autoTranslateDisabled: "Automatický překlad nyní není nakonfigurovaný."
        };
    }, [language]);

    const cmsValidationTexts = useMemo(() => {
        if (language === "de") {
            return { invalidBrand: "Ungültige Marke. Wählen Sie eine bestehende Marke aus." };
        }
        if (language === "en") {
            return { invalidBrand: "Invalid brand. Choose one of the existing brands." };
        }
        if (language === "sk") {
            return { invalidBrand: "Neplatná značka. Vyber značku z existujúceho zoznamu." };
        }
        return { invalidBrand: "Neplatná značka. Vyberte značku z existujícího seznamu." };
    }, [language]);

    const existingBrandOptions = useMemo(
        () => Array.from(new Set((Array.isArray(cars) ? cars : []).map((car) => String(car?.brand || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)),
        [cars, language]
    );
    const cmsBrandOptions = useMemo(
        () => Array.from(new Set([...publicBrandOptions, ...existingBrandOptions].map((brand) => String(brand || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)),
        [publicBrandOptions, existingBrandOptions, language]
    );
    const cmsBrandSuggestions = useMemo(() => {
        const query = normalizeBrandKey(form.brand);
        if (!query) {
            return cmsBrandOptions.slice(0, 12);
        }

        const startsWith = [];
        const includes = [];
        cmsBrandOptions.forEach((option) => {
            const normalizedOption = normalizeBrandKey(option);
            if (normalizedOption.startsWith(query)) {
                startsWith.push(option);
                return;
            }
            if (normalizedOption.includes(query)) {
                includes.push(option);
            }
        });
        return [...startsWith, ...includes].slice(0, 12);
    }, [cmsBrandOptions, form.brand]);
    const hasCmsTranslatableInput = useMemo(
        () => [form.name, form.description, form.legal].some((value) => String(value || "").trim().length > 0),
        [form.name, form.description, form.legal]
    );
    const originSelectOptions = useMemo(() => ORIGIN_TECHNICAL_VALUES.map((option) => ({ value: option, label: translateTechnicalValue(option, language) })), [language]);
    const isPublicBrandListAvailable = publicBrandOptions.length > 0;

    const getStatusFromCar = (car) => {
        if (!car?.available) {
            return "unavailable";
        }
        if (car?.reserved) {
            return "reserved";
        }
        return "available";
    };

    const applyStatusToCar = (car, status) => {
        const nextStatus = ["available", "reserved", "unavailable"].includes(status) ? status : "available";
        if (nextStatus === "reserved") {
            return { ...car, available: true, reserved: true };
        }
        if (nextStatus === "unavailable") {
            return { ...car, available: false, reserved: false };
        }
        return { ...car, available: true, reserved: false };
    };

    const statusSelectOptions = useMemo(() => ([
        { value: "available", label: cmsUiTexts.statusAvailable },
        { value: "reserved", label: cmsUiTexts.statusReserved },
        { value: "unavailable", label: cmsUiTexts.statusUnavailable }
    ]), [cmsUiTexts]);

    const announceLiveMessage = (message) => {
        setLiveMessage("");
        setIsBrandSuggestionsOpen(false);
        window.setTimeout(() => {
            setLiveMessage(message);
        }, 10);
    };

    const moveFormImage = (fromIndex, toIndex) => {
        setForm((prev) => {
            if (!Array.isArray(prev.images) || prev.images.length < 2) {
                return prev;
            }
            if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prev.images.length || toIndex >= prev.images.length) {
                return prev;
            }

            const nextImages = [...prev.images];
            const [movedImage] = nextImages.splice(fromIndex, 1);
            nextImages.splice(toIndex, 0, movedImage);
            announceLiveMessage(cmsUiTexts.movedToPosition(toIndex + 1, nextImages.length));

            let nextThumbnailIndex = prev.thumbnailIndex;
            if (prev.thumbnailIndex === fromIndex) {
                nextThumbnailIndex = toIndex;
            } else if (fromIndex < prev.thumbnailIndex && toIndex >= prev.thumbnailIndex) {
                nextThumbnailIndex = prev.thumbnailIndex - 1;
            } else if (fromIndex > prev.thumbnailIndex && toIndex <= prev.thumbnailIndex) {
                nextThumbnailIndex = prev.thumbnailIndex + 1;
            }

            return {
                ...prev,
                images: nextImages,
                thumbnailIndex: Math.max(0, Math.min(nextThumbnailIndex, nextImages.length - 1))
            };
        });
    };

    const handleImageCardKeyDown = (event, index) => {
        if (!Array.isArray(form.images) || form.images.length < 2) {
            return;
        }

        let targetIndex = null;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            targetIndex = Math.max(0, index - 1);
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            targetIndex = Math.min(form.images.length - 1, index + 1);
        } else if (event.key === "Home") {
            targetIndex = 0;
        } else if (event.key === "End") {
            targetIndex = form.images.length - 1;
        }

        if (targetIndex === null || targetIndex === index) {
            return;
        }

        event.preventDefault();
        moveFormImage(index, targetIndex);
        window.requestAnimationFrame(() => {
            const nextCard = document.getElementById(`cms-image-card-${targetIndex}`);
            nextCard?.focus();
        });
    };

    const driveSelectOptions = useMemo(() => DRIVE_OPTIONS.map((option) => ({ value: option, label: option })), []);
    const fuelSelectOptions = useMemo(() => FUEL_OPTIONS.map((option) => ({ value: option, label: option })), []);
    const transmissionSelectOptions = useMemo(() => TRANSMISSION_OPTIONS.map((option) => ({ value: option, label: option })), []);

    useEffect(() => {
        if (!isLogged) {
            setRuntimeFirestoreIdToken("");
            return;
        }
        ensureFirebaseCmsIdToken();
    }, [isLogged]);

    useEffect(() => {
        let active = true;
        fetchPublicVehicleMakes().then((makes) => {
            if (!active) {
                return;
            }
            setPublicBrandOptions(Array.isArray(makes) ? makes : []);
        });

        return () => {
            active = false;
        };
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        const firebaseSession = await signInCmsWithFirebaseEmailPassword(credentials.email, credentials.password);
        if (firebaseSession) {
            saveFirebaseAuthSession(firebaseSession);
            setRuntimeFirestoreIdToken(firebaseSession.idToken);
            localStorage.setItem(CMS_AUTH_KEY, "1");
            setIsLogged(true);
            setError("");
            return;
        }

        setError(texts.cms.loginError);
    };

    const handleLogout = () => {
        clearFirebaseAuthSession();
        setRuntimeFirestoreIdToken("");
        localStorage.removeItem(CMS_AUTH_KEY);
        setIsLogged(false);
    };

    const resetCmsForm = () => {
        setEditingCarId(null);
        setDragImageIndex(null);
        setDragOverImageIndex(null);
        setLiveMessage("");
        setIsBrandSuggestionsOpen(false);
        setForm({
            name: "",
            brand: "",
            origin: "German version",
            year: "",
            priceCzk: "",
            mileage: "",
            horsepower: "",
            doors: "",
            seats: "",
            previousOwners: "",
            drive: "",
            fuel: "",
            transmission: "Automat",
            manualGears: "",
            images: [],
            thumbnailIndex: 0,
            description: "",
            legal: "",
            equipment: "",
            status: "available",
            reserved: false,
            available: true
        });
        setTechnicalChecklist(createInitialTechnicalChecklistState());
        setEquipmentChecklist(createInitialEquipmentChecklistState());
    };

    const beginEditCar = (car) => {
        setEditingCarId(car.id);
        setIsBrandSuggestionsOpen(false);
        setError("");
        setForm({
            name: car.name || "",
            brand: car.brand || "",
            origin: getOriginFromCar(car),
            year: car.year || "",
            priceCzk: String(car.priceCzk || ""),
            mileage: car.mileage || "",
            horsepower: String(car.horsepower || ""),
            doors: String(car.doors || ""),
            seats: String(car.seats || ""),
            previousOwners: String(car.previousOwners ?? 0),
            drive: car.drive || "",
            fuel: car.fuel || "",
            transmission: car.transmission || "Automat",
            manualGears: String(car.manualGears || ""),
            images: getCarImages(car),
            thumbnailIndex: Number.isInteger(car.thumbnailIndex) ? car.thumbnailIndex : 0,
            description: car.description || "",
            legal: car.legal || "",
            equipment: car.equipment || "",
            status: getStatusFromCar(car),
            reserved: Boolean(car.reserved),
            available: Boolean(car.available)
        });
        setTechnicalChecklist(createTechnicalChecklistFromCar(car));
        setEquipmentChecklist(createEquipmentChecklistFromCar(car));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        try {
            const uploadedImages = await readFilesAsDataUrls(files);
            setForm((prev) => {
                const nextImages = [...prev.images, ...uploadedImages].filter(Boolean);
                announceLiveMessage(cmsUiTexts.imagesAdded(uploadedImages.length, nextImages.length));
                return {
                    ...prev,
                    images: nextImages,
                    thumbnailIndex: Math.min(prev.thumbnailIndex, Math.max(0, nextImages.length - 1))
                };
            });
            event.target.value = "";
        } catch {
            setError(cmsUiTexts.imageReadError);
        }
    };

    const removeFormImage = (index) => {
        setForm((prev) => {
            const nextImages = prev.images.filter((_, imageIndex) => imageIndex !== index);
            const nextThumbnailIndex = nextImages.length === 0 ? 0 : Math.min(prev.thumbnailIndex === index ? 0 : prev.thumbnailIndex, nextImages.length - 1);
            announceLiveMessage(cmsUiTexts.imageRemoved(index + 1, nextImages.length));
            return {
                ...prev,
                images: nextImages,
                thumbnailIndex: nextThumbnailIndex
            };
        });
    };


    const selectCmsBrandSuggestion = (brand) => {
        setForm((prev) => ({ ...prev, brand: brand || "" }));
        setIsBrandSuggestionsOpen(false);
    };
    const addCar = async (event) => {
        event.preventDefault();

        const normalizedBrand = normalizeBrandKey(form.brand);
        const matchedBrand = cmsBrandOptions.find((option) => normalizeBrandKey(option) === normalizedBrand) || "";
        const fallbackBrand = String(form.brand || "").trim();
        const selectedBrand = matchedBrand || (!isPublicBrandListAvailable ? fallbackBrand : "");
        if (!selectedBrand) {
            setError(cmsValidationTexts.invalidBrand);
            return;
        }

        const transmission = sanitizeOption(form.transmission, TRANSMISSION_OPTIONS, "Automat");
        const manualGears = transmission === "Manuál" ? Math.max(1, Math.round(parseNumber(form.manualGears) || 0)) : 0;
        const technicalData = buildTechnicalDataFromChecklist(technicalChecklist, form, transmission, manualGears);
        const equipmentItems = EQUIPMENT_CHECKLIST_ITEMS.filter((item) => equipmentChecklist[item]);
        if (!form.drive || !form.fuel) {
            setError(texts.cms.requiredDriveFuel || "Palivo a náhon sú povinné.");
            return;
        }
        if (transmission === "Manuál" && manualGears < 1) {
            setError(texts.cms.manualGearsRequired || "Pri manuáli je povinné zadať počet prevodov.");
            return;
        }

        const images = form.images.length > 0 ? form.images : ["https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80"];
        const thumbnailIndex = Math.max(0, Math.min(Number(form.thumbnailIndex) || 0, images.length - 1));

        const localizedCmsFields = await buildLocalizedCmsFields({
            name: form.name,
            description: form.description,
            legal: form.legal
        }, language);

        const existingCar = editingCarId ? cars.find((car) => car.id === editingCarId) : null;
        const now = Date.now();

        const baseCar = {
            id: editingCarId || `zmr-${Date.now()}`,
            name: form.name,
            brand: selectedBrand,
            origin: normalizeOriginValue(form.origin),
            year: form.year,
            priceCzk: Math.round(parseNumber(form.priceCzk) || 0),
            mileage: form.mileage,
            horsepower: Math.round(parseNumber(form.horsepower) || 0),
            doors: Math.max(2, Math.round(parseNumber(form.doors) || 0)),
            seats: Math.max(2, Math.round(parseNumber(form.seats) || 0)),
            previousOwners: Math.max(0, Math.round(parseNumber(form.previousOwners) || 0)),
            drive: normalizeDriveValue(form.drive),
            fuel: normalizeFuelValue(form.fuel),
            transmission,
            manualGears,
            images,
            thumbnailIndex,
            image: images[thumbnailIndex] || images[0],
            description: form.description,
            legal: form.legal,
            nameI18n: localizedCmsFields.nameI18n,
            descriptionI18n: localizedCmsFields.descriptionI18n,
            legalI18n: localizedCmsFields.legalI18n,
            technicalData,
            equipmentItems,
            equipment: equipmentItems.length > 0 ? `Výbava: ${equipmentItems.slice(0, 8).join(", ")}` : form.equipment,
            reserved: false,
            available: true,
            createdAt: Number.isFinite(Number(existingCar?.createdAt)) && Number(existingCar.createdAt) > 0 ? Number(existingCar.createdAt) : now,
            updatedAt: now
        };

        const carWithStatus = applyStatusToCar(baseCar, form.status);

        const updated = editingCarId
            ? cars.map((car) => (car.id === editingCarId ? touchCarForUpdate(car, carWithStatus) : car))
            : [carWithStatus, ...cars];
        setCars(updated);
        saveCars(updated);
        const cloudSaved = await saveCarsToCloud(updated);
        if (cloudSaved) {
            setError("");
            resetCmsForm();
            return;
        }
        setError("Uloženie do databázy zlyhalo. Prihláste sa znova a uložte ešte raz.");
    };

    const setCarStatus = (id, status) => {
        const updated = cars.map((car) => car.id === id ? touchCarForUpdate(car, applyStatusToCar(car, status)) : car);
        setCars(updated);
        saveCars(updated);
    };

    const toggleAvailability = (id) => {
        const updated = cars.map((car) => car.id === id ? touchCarForUpdate(car, { available: !car.available }) : car);
        setCars(updated);
        saveCars(updated);
    };

    const toggleReserved = (id) => {
        const updated = cars.map((car) => car.id === id ? touchCarForUpdate(car, { reserved: !car.reserved }) : car);
        setCars(updated);
        saveCars(updated);
    };

    const removeCar = (id) => {
        const updated = cars.filter((car) => car.id !== id);
        setCars(updated);
        saveCars(updated);
    };

    if (!isLogged) {
        return (
            <section className="card cms-card">
                <h2>{texts.cms.loginTitle}</h2>
                <p>{texts.cms.loginInfo}</p>
                {syncMessage && <p className={syncMessageType === "error" ? "error-text" : "car-meta"}>{syncMessage}</p>}
                {error && <p className="error-text">{error}</p>}
                <form className="form-grid" onSubmit={handleLogin} autoComplete="off">
                    <label>
                        {texts.cms.username}
                        <input
                            type="email"
                            autoComplete="off"
                            value={credentials.email}
                            onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        {texts.cms.password}
                        <input
                            type="password"
                            autoComplete="new-password"
                            value={credentials.password}
                            onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                            required
                        />
                    </label>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="button-link">{texts.cms.loginButton}</button>
                </form>
            </section>
        );
    }

    return (
        <>
            <section className="card cms-card">
                <div className="cms-head">
                    <h2>{texts.cms.manageTitle}</h2>
                    <button className="button-link button-secondary" onClick={handleLogout}>{texts.cms.logoutButton}</button>
                </div>
                <p>{texts.cms.intro}</p>
                {syncMessage && <p className={syncMessageType === "error" ? "error-text" : "car-meta"}>{syncMessage}</p>}
                {error && <p className="error-text">{error}</p>}
                <form className="form-grid" onSubmit={addCar} autoComplete="off">
                    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{liveMessage}</p>
                    <label>{cmsUiTexts.statusLabel}
                        <DarkSelect
                            value={form.status}
                            onChange={(value) => setForm((prev) => ({ ...prev, status: value || "available" }))}
                            options={statusSelectOptions}
                            ariaLabel={cmsUiTexts.statusLabel}
                        />
                    </label>
                    <label>{translateTechnicalLabel("Origin", language)}
                        <DarkSelect
                            value={form.origin}
                            onChange={(value) => setForm((prev) => ({ ...prev, origin: value || "German version" }))}
                            options={originSelectOptions}
                            ariaLabel={translateTechnicalLabel("Origin", language)}
                        />
                    </label>
                    <label>{texts.cms.fields.name}<input type="text" name="vehicleModel" autoComplete="off" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.brand}
                        <div className="cms-brand-autocomplete">
                            <input
                                type="text"
                                autoComplete="off"
                                value={form.brand}
                                placeholder={texts.cms.fields.brand}
                                onFocus={() => setIsBrandSuggestionsOpen(true)}
                                onBlur={() => {
                                    window.setTimeout(() => setIsBrandSuggestionsOpen(false), 120);
                                }}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setForm((prev) => ({ ...prev, brand: nextValue }));
                                    setIsBrandSuggestionsOpen(true);
                                }}
                                aria-label={texts.cms.fields.brand}
                                required
                            />
                            {isBrandSuggestionsOpen && cmsBrandSuggestions.length > 0 && (
                                <div className="cms-brand-menu" role="listbox" aria-label={texts.cms.fields.brand}>
                                    {cmsBrandSuggestions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`cms-brand-option${normalizeBrandKey(form.brand) === normalizeBrandKey(option) ? " active" : ""}`}
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                selectCmsBrandSuggestion(option);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <label>{texts.cms.fields.year}<input type="text" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.priceCzk}<input type="number" min="0" value={form.priceCzk} onChange={(e) => setForm((prev) => ({ ...prev, priceCzk: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.mileage}<input type="text" value={form.mileage} onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.horsepower}<input type="number" min="0" value={form.horsepower} onChange={(e) => setForm((prev) => ({ ...prev, horsepower: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.doors}<input type="number" min="2" max="6" value={form.doors} onChange={(e) => setForm((prev) => ({ ...prev, doors: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.seats || "Počet sedadiel"}<input type="number" min="2" max="9" value={form.seats} onChange={(e) => setForm((prev) => ({ ...prev, seats: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.previousOwners || "Počet predošlých majiteľov"}<input type="number" min="0" value={form.previousOwners} onChange={(e) => setForm((prev) => ({ ...prev, previousOwners: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.drive}
                        <DarkSelect value={form.drive} onChange={(value) => setForm((prev) => ({ ...prev, drive: value }))} options={driveSelectOptions} placeholder="-" ariaLabel={texts.cms.fields.drive} />
                    </label>
                    <label>{texts.cms.fields.fuel}
                        <DarkSelect value={form.fuel} onChange={(value) => setForm((prev) => ({ ...prev, fuel: value }))} options={fuelSelectOptions} placeholder="-" ariaLabel={texts.cms.fields.fuel} />
                    </label>
                    <label>{texts.cms.fields.transmission}
                        <DarkSelect value={form.transmission} onChange={(value) => setForm((prev) => ({ ...prev, transmission: value || "Automat" }))} options={transmissionSelectOptions} ariaLabel={texts.cms.fields.transmission} />
                    </label>
                    {form.transmission === "Manuál" && (
                        <label>{texts.cms.fields.manualGears || "Počet prevodov"}<input type="number" min="1" max="10" value={form.manualGears} onChange={(e) => setForm((prev) => ({ ...prev, manualGears: e.target.value }))} required /></label>
                    )}
                    <label className="full-width">{texts.cms.fields.image}<input type="file" accept="image/*" multiple onChange={handleImageUpload} /></label>
                    {form.images.length > 0 && (
                        <div className="full-width cms-image-gallery">
                            {form.images.map((src, index) => (
                                <article
                                    key={`${src}-${index}`}
                                    id={`cms-image-card-${index}`}
                                    className={`${index === form.thumbnailIndex ? "cms-image-item active" : "cms-image-item"}${dragImageIndex === index ? " dragging" : ""}${dragOverImageIndex === index && dragImageIndex !== index ? " drag-over" : ""}`}
                                    draggable
                                    title={`${cmsUiTexts.dragHint} • ${cmsUiTexts.keyboardHint}`}
                                    tabIndex={0}
                                    aria-label={`${cmsUiTexts.thumbnail} ${index + 1}. ${cmsUiTexts.keyboardHint}`}
                                    onDragStart={(event) => {
                                        setDragImageIndex(index);
                                        setDragOverImageIndex(index);
                                        event.dataTransfer.effectAllowed = "move";
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragOverImageIndex(index);
                                        event.dataTransfer.dropEffect = "move";
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        if (dragImageIndex !== null) {
                                            moveFormImage(dragImageIndex, index);
                                        }
                                        setDragImageIndex(null);
                                        setDragOverImageIndex(null);
                                    }}
                                    onDragEnd={() => {
                                        setDragImageIndex(null);
                                        setDragOverImageIndex(null);
                                    }}
                                    onKeyDown={(event) => handleImageCardKeyDown(event, index)}
                                >
                                    <img src={src} alt={`Preview ${index + 1}`} />
                                    <div className="cms-image-actions">
                                        <button type="button" className="button-link button-secondary" onClick={() => {
                                            setForm((prev) => ({ ...prev, thumbnailIndex: index }));
                                            announceLiveMessage(cmsUiTexts.thumbnailSet(index + 1, form.images.length));
                                        }}>
                                            {index === form.thumbnailIndex ? cmsUiTexts.thumbnail : cmsUiTexts.setThumbnail}
                                        </button>
                                        <button type="button" className="button-link danger" onClick={() => removeFormImage(index)}>{cmsUiTexts.removeImage}</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <label className="full-width">{texts.cms.fields.description}<textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required /></label>
                    <label className="full-width">{texts.cms.fields.legal}<textarea value={form.legal} onChange={(e) => setForm((prev) => ({ ...prev, legal: e.target.value }))} required /></label>
                    <div className="full-width checklist-block">
                        <p className="checklist-title">{texts.cms.fields.equipmentItemsRaw}</p>
                        <small>{texts.cms.equipmentHelp}</small>
                        <div className="checklist-grid equipment-grid-cms">
                            {EQUIPMENT_CHECKLIST_ITEMS.map((item) => (
                                <label key={item} className="checkbox-row checklist-item">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(equipmentChecklist[item])}
                                        onChange={(e) => setEquipmentChecklist((prev) => ({ ...prev, [item]: e.target.checked }))}
                                    />
                                    {translateEquipmentItem(item, language)}
                                </label>
                            ))}
                        </div>
                    </div>
                    <label className="full-width">{texts.cms.fields.equipment}<textarea value={form.equipment} onChange={(e) => setForm((prev) => ({ ...prev, equipment: e.target.value }))} required /></label>
                    <button type="submit" className="button-link">{editingCarId ? cmsUiTexts.update : texts.cms.addButton}</button>
                    {editingCarId && (
                        <button type="button" className="button-link button-secondary" onClick={resetCmsForm}>{cmsUiTexts.cancelEdit}</button>
                    )}
                </form>
            </section>

            <section className="card cms-card">
                <h2>{texts.cms.currentCars}</h2>
                <div className="cms-list">
                    {cars.map((car) => (
                        (() => {
                            const localizedName = getLocalizedCarText(car, "name", language);
                            return (
                        <article key={car.id} className="cms-item">
                            <div>
                                <h3>{localizedName}</h3>
                                <p>{car.year} • {formatPrice(car.priceCzk, language)} • {car.mileage}</p>
                                <p>{car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.seats} {texts.cars.seatsUnit || "sedadiel"} • {car.drive} • {formatTransmission(car)}</p>
                                <p>👤 {texts.carDetail.previousOwners}: {car.previousOwners}</p>
                                <p className={car.reserved ? "status reserved" : (car.available ? "status available" : "status unavailable")}>
                                    {car.reserved ? getReservationTexts(language).statusReserved : (car.available ? texts.common.statusAvailable : texts.common.statusUnavailable)}
                                </p>
                            </div>
                            <div className="cms-actions">
                                <button className="button-link button-secondary" onClick={() => beginEditCar(car)}>
                                    {cmsUiTexts.edit}
                                </button>
                                <div className="cms-status-select">
                                    <DarkSelect
                                        value={getStatusFromCar(car)}
                                        onChange={(value) => setCarStatus(car.id, value || "available")}
                                        options={statusSelectOptions}
                                        ariaLabel={cmsUiTexts.statusLabel}
                                    />
                                </div>
                                <button className="button-link danger" onClick={() => removeCar(car.id)}>
                                    {texts.cms.remove}
                                </button>
                            </div>
                        </article>
                            );
                        })()
                    ))}
                </div>
            </section>
        </>
    );
}

function App() {
    const rootElement = document.getElementById("root");
    const page = rootElement?.dataset?.page || "home";
    const isCarsDataPage = page === "cars" || page === "car-detail" || page === "cms";
    const [cars, setCars] = useState(() => (isCarsDataPage ? getCars() : []));
    const [language, setLanguage] = useState(getLanguagePreference);
    const [isCloudSyncReady, setIsCloudSyncReady] = useState(false);
    const [isCarsLoading, setIsCarsLoading] = useState(isCarsDataPage);
    const shouldDeferCloudSync = page !== "car-detail";
    const texts = useMemo(() => I18N[language] || I18N.cs, [language]);

    useEffect(() => {
        if (!isCarsDataPage) {
            setIsCloudSyncReady(false);
            setIsCarsLoading(false);
            return;
        }

        let active = true;
        setIsCloudSyncReady(false);
        const localCars = getCars();
        setCars(localCars);
        setIsCarsLoading(localCars.length === 0);

        const runCloudSync = () => {
            fetchCarsFromCloud().then((cloudCars) => {
                if (!active) {
                    return;
                }
                const normalizedCloudCars = Array.isArray(cloudCars) ? cloudCars.map((car, index) => normalizeCar(car, index)) : [];
                const mergedCars = mergeCarsByLatest(localCars, normalizedCloudCars);
                const normalizedMergedCars = mergedCars.map((car, index) => normalizeCar(car, index));
                setCars(normalizedMergedCars);
                saveCars(normalizedMergedCars);
                setIsCloudSyncReady(true);
                setIsCarsLoading(false);
            });
        };

        let idleCallbackId = null;
        let timeoutId = null;
        if (shouldDeferCloudSync && typeof window.requestIdleCallback === "function") {
            idleCallbackId = window.requestIdleCallback(runCloudSync, { timeout: 1200 });
        } else {
            timeoutId = window.setTimeout(runCloudSync, 0);
        }

        return () => {
            active = false;
            if (idleCallbackId !== null && typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleCallbackId);
            }
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [isCarsDataPage, shouldDeferCloudSync]);

    useEffect(() => {
        if (!isCarsDataPage) {
            return;
        }
        saveCars(cars);
        if (!isCloudSyncReady) {
            return;
        }

        const syncTimeoutId = window.setTimeout(() => {
            saveCarsToCloud(cars);
        }, 650);

        return () => {
            window.clearTimeout(syncTimeoutId);
        };
    }, [cars, isCloudSyncReady, isCarsDataPage]);

    useEffect(() => {
        saveLanguagePreference(language);
        document.documentElement.lang = language;
    }, [language]);

    const pageConfig = useMemo(() => {
        switch (page) {
            case "about":
                return {
                    title: texts.pages.about.title,
                    subtitle: texts.pages.about.subtitle,
                    content: <AboutPage texts={texts} language={language} />
                };
            case "services":
                return {
                    title: texts.pages.services.title,
                    subtitle: texts.pages.services.subtitle,
                    content: <ServicesPage texts={texts} language={language} />
                };
            case "cars":
                return {
                    title: texts.pages.cars.title,
                    subtitle: texts.pages.cars.subtitle,
                    content: <CarsPage cars={cars} language={language} texts={texts} />
                };
            case "car-detail":
                return {
                    title: texts.pages.carDetail.title,
                    subtitle: texts.pages.carDetail.subtitle,
                    content: <CarDetailPage cars={cars} setCars={setCars} language={language} texts={texts} isCarsLoading={isCarsLoading} />
                };
            case "contact":
                return {
                    title: texts.pages.contact.title,
                    subtitle: texts.pages.contact.subtitle,
                    content: <ContactPage texts={texts} language={language} />
                };
            case "cms":
                return {
                    title: texts.pages.cms.title,
                    subtitle: texts.pages.cms.subtitle,
                    content: <CmsPage cars={cars} setCars={setCars} language={language} texts={texts} />
                };
            case "home":
            default:
                return {
                    title: texts.pages.home.title,
                    subtitle: texts.pages.home.subtitle,
                    content: <HomePage texts={texts} language={language} />
                };
        }
    }, [page, cars, language, texts, isCarsLoading]);

    return (
        <PageShell page={page} title={pageConfig.title} subtitle={pageConfig.subtitle} language={language} onLanguageChange={setLanguage} texts={texts}>
            {pageConfig.content}
        </PageShell>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

