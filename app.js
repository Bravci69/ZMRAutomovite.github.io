const { useEffect, useMemo, useRef, useState } = React;

const CARS_STORAGE_KEY = "zmrCars";
const CMS_AUTH_KEY = "zmrCmsAuth";
const LANGUAGE_STORAGE_KEY = "zmrLanguage";
const CZK_TO_EUR_RATE = 25;
const HORSEPOWER_MIN_FILTER = 256;
const RESERVATION_EMAIL = "jakubchmura9@gmail.com";
const TRANSLATE_PROXY_URL = window.ZMR_TRANSLATE_PROXY_URL || "";
const RESERVATION_PROXY_URL = window.ZMR_RESERVATION_PROXY_URL || "/api/reservation";
const TRANSLATION_CACHE_KEY = "zmrTechnicalTranslations";
const SUPPORTED_LANG_CODES = ["cs", "sk", "de", "en"];
const FUEL_OPTIONS = ["Nafta", "Benzín", "Elektrina", "Plug inhybrid", "Plyn"];
const DRIVE_OPTIONS = ["Všetky 4", "Predný", "Zadný"];
const TRANSMISSION_OPTIONS = ["Automat", "Manuál"];
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
    "Plug in hybrid": { cs: "Plug-in hybrid", sk: "Plug-in hybrid", de: "Plug-in-Hybrid", en: "Plug in hybrid" },
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
            home: { title: "ZMR Automovité", subtitle: "Reprezentativní služby pro kontrolu a dovoz vozidel bez kompromisů." },
            about: { title: "O nás", subtitle: "Zkušenosti, transparentnost a důraz na bezpečný nákup vozidla." },
            services: { title: "Služby", subtitle: "Komplexní řešení kontroly, dovozu a přípravy vozidla na provoz." },
            cars: { title: "Nabídka vozidel", subtitle: "Přehled aktuálně dostupných vozidel s detailním popisem stavu, výbavy a legislativních informací." },
            carDetail: { title: "Detail vozidla", subtitle: "Kompletní informace o vybraném vozidle včetně legislativy a výbavy." },
            contact: { title: "Kontakt", subtitle: "Jsme připraveni pomoci s kontrolou, dovozem i výběrem vhodného vozidla." },
            cms: { title: "CMS vozidel", subtitle: "Interní zóna pro správu nabídky vozidel." }
        },
        home: {
            whyTitle: "Proč si vybrat ZMR Automovité",
            whyP1: "Naším cílem je, aby klient přesně věděl, co kupuje. Nejde jen o rychlý pohled na vozidlo, ale o detailní proces prověření technického stavu, historie, výbavy a legislativní připravenosti.",
            whyP2: "Spolupráce je transparentní od prvního kontaktu: domluvíme rozsah kontroly, připravíme výstupní zprávu, vysvětlíme rizika a navrhneme další postup.",
            approachTitle: "Komplexní přístup",
            approachText: "Pokrýváme celý proces od výběru modelu přes obhlídku až po dovoz a základní servis.",
            outputTitle: "Jasné výstupy",
            outputText: "Dostanete srozumitelné informace o stavu, legislativě, výbavě i možných investicích po koupi."
        },
        about: {
            title: "O naší společnosti",
            p1: "ZMR Automovité je tým zaměřený na odbornou kontrolu vozidel a podporu při koupi nebo dovozu auta ze zahraničí.",
            p2: "Klademe důraz na transparentní komunikaci, technickou přesnost a srozumitelný proces i pro klienty bez hlubších zkušeností.",
            locationTitle: "Naše lokalita – Praha",
            locationText: "Základnu máme v Praze a služby poskytujeme klientům z celé ČR i okolních států."
        },
        services: {
            title: "Rozsah služeb",
            intro: "Služby jsou navržené tak, aby pokryly celý životní cyklus nákupu vozidla.",
            items: [
                { title: "Kontrola stavu vozidla", text: "Každé vozidlo prověřujeme vizuálně i technicky včetně diagnostiky a ověření historie." },
                { title: "Kontrola po celé ČR", text: "Za vozidlem vyjíždíme po celé České republice i do sousedních států." },
                { title: "Dovoz z USA a Japonska", text: "Zajistíme výběr, prověření, přepravu i administrativu dovozu." },
                { title: "Základní servis a STK", text: "Před předáním připravíme vozidlo po technické stránce i na STK." },
                { title: "Vlastní nabídka vozidel", text: "Pravidelně doplňujeme nabídku ověřených vozidel s transparentním stavem." }
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
            loginInfo: "Přístup pro zaměstnance. Testovací údaje: admin / admin.",
            username: "Uživatelské jméno",
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
            home: { title: "ZMR Automovité", subtitle: "Reprezentatívne služby pre kontrolu a dovoz vozidiel bez kompromisov." },
            about: { title: "O nás", subtitle: "Skúsenosti, transparentnosť a dôraz na bezpečný nákup vozidla." },
            services: { title: "Služby", subtitle: "Komplexné riešenia kontroly, dovozu a prípravy vozidla na prevádzku." },
            cars: { title: "Ponuka vozidiel", subtitle: "Prehľad aktuálne dostupných vozidiel s detailným popisom stavu, výbavy a legislatívnych informácií." },
            carDetail: { title: "Detail vozidla", subtitle: "Kompletné informácie o vybranom vozidle vrátane legislatívy a výbavy." },
            contact: { title: "Kontakt", subtitle: "Sme pripravení pomôcť s kontrolou, dovozom aj výberom vhodného vozidla." },
            cms: { title: "CMS vozidiel", subtitle: "Interná zóna pre správu ponuky vozidiel." }
        },
        home: {
            whyTitle: "Prečo si vybrať ZMR Automovité",
            whyP1: "Naším cieľom je, aby klient presne vedel, čo kupuje. Neponúkame len rýchly pohľad na vozidlo, ale detailné preverenie stavu, histórie aj legislatívy.",
            whyP2: "Spoluprácu vedieme transparentne od prvého kontaktu až po odovzdanie odporúčaní.",
            approachTitle: "Komplexný prístup",
            approachText: "Pokrývame výber, obhliadku, kontrolu, dovoz aj základný servis.",
            outputTitle: "Jasné výstupy",
            outputText: "Dostanete zrozumiteľné informácie o stave, legislatíve, výbave aj ďalších nákladoch."
        },
        about: {
            title: "O našej spoločnosti",
            p1: "ZMR Automovité je tím zameraný na odbornú kontrolu vozidiel a podporu pri kúpe alebo dovoze auta zo zahraničia.",
            p2: "Dôraz kladieme na transparentnú komunikáciu, technickú presnosť a zrozumiteľný proces.",
            locationTitle: "Naša lokalita – Praha",
            locationText: "Základňu máme v Prahe a služby poskytujeme klientom z celej ČR aj okolitých štátov."
        },
        services: {
            title: "Rozsah služieb",
            intro: "Služby sú navrhnuté tak, aby pokryli celý životný cyklus nákupu vozidla.",
            items: [
                { title: "Kontrola stavu vozidla", text: "Každé vozidlo preverujeme vizuálne aj technicky vrátane diagnostiky a histórie." },
                { title: "Kontrola po celej ČR", text: "Za vozidlom vycestujeme po celej Českej republike aj do susedných štátov." },
                { title: "Dovoz z USA a Japonska", text: "Zabezpečíme výber, preverenie, prepravu aj administratívu dovozu." },
                { title: "Základný servis a STK", text: "Pred odovzdaním pripravíme vozidlo po technickej stránke aj na STK." },
                { title: "Vlastná ponuka vozidiel", text: "Priebežne dopĺňame ponuku overených vozidiel s transparentným stavom." }
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
            loginTitle: "CMS prihlásenie", loginInfo: "Prístup pre zamestnancov. Testovacie údaje: admin / admin.", username: "Prihlasovacie meno", password: "Heslo", loginButton: "Prihlásiť sa", loginError: "Nesprávne prihlasovacie údaje.", requiredDriveFuel: "Palivo a náhon sú povinné.", manualGearsRequired: "Pri manuáli je povinné zadať počet prevodov.", manageTitle: "Správa vozidiel", logoutButton: "Odhlásiť sa", intro: "Tu môžete pridávať nové autá, nahrávať fotku, vyplniť popis, legislatívne informácie a výbavu.", technicalHelp: "Formát: každý riadok ako Názov: Hodnota", equipmentHelp: "Každý riadok = 1 položka výbavy",
            fields: { name: "Model vozidla", brand: "Značka", year: "Rok výroby", priceCzk: "Cena (v Kč)", mileage: "Nájazd", horsepower: "Výkon (k)", doors: "Počet dverí", seats: "Počet sedadiel", previousOwners: "Počet predošlých majiteľov", drive: "Náhon", fuel: "Palivo", transmission: "Prevodovka", manualGears: "Počet prevodov", image: "Fotka vozidla", description: "Základný popis", legal: "Legislatívne informácie", equipment: "Výbava", technicalDataRaw: "Technické údaje (Názov: Hodnota)", equipmentItemsRaw: "Výbava (1 položka na riadok)", available: "Vozidlo je dostupné" },
            addButton: "Pridať vozidlo", currentCars: "Aktuálne vozidlá", toggleAvailability: "Zmeniť dostupnosť", remove: "Odstrániť"
        }
    },
    de: {
        nav: { home: "Start", about: "Über uns", services: "Leistungen", cars: "Fahrzeuge", contact: "Kontakt", cms: "CMS" },
        common: { language: "Sprache", statusAvailable: "Verfügbar", statusUnavailable: "Derzeit nicht verfügbar", price: "Preis", horsepowerUnit: "PS", doorsUnit: "Türen" },
        pages: {
            home: { title: "ZMR Automovité", subtitle: "Professionelle Services für Fahrzeugprüfung und Import ohne Kompromisse." },
            about: { title: "Über uns", subtitle: "Erfahrung, Transparenz und Fokus auf sicheren Fahrzeugkauf." },
            services: { title: "Leistungen", subtitle: "Komplette Lösungen für Prüfung, Import und Fahrzeugvorbereitung." },
            cars: { title: "Fahrzeugangebot", subtitle: "Übersicht der verfügbaren Fahrzeuge mit detaillierten Informationen." },
            carDetail: { title: "Fahrzeugdetails", subtitle: "Vollständige Informationen zu Fahrzeug, Ausstattung und Rechtlichem." },
            contact: { title: "Kontakt", subtitle: "Wir unterstützen Sie bei Prüfung, Import und Auswahl des passenden Fahrzeugs." },
            cms: { title: "Fahrzeug-CMS", subtitle: "Interner Bereich zur Verwaltung des Fahrzeugangebots." }
        },
        home: { whyTitle: "Warum ZMR Automovité", whyP1: "Wir prüfen Fahrzeuge umfassend statt nur oberflächlich.", whyP2: "Von der Erstberatung bis zur finalen Empfehlung transparent begleitet.", approachTitle: "Ganzheitlicher Ansatz", approachText: "Auswahl, Prüfung, Import und Service aus einer Hand.", outputTitle: "Klare Ergebnisse", outputText: "Sie erhalten verständliche und belastbare Informationen für die Entscheidung." },
        about: { title: "Über unser Unternehmen", p1: "ZMR Automovité ist auf professionelle Fahrzeugprüfung und Importberatung spezialisiert.", p2: "Wir setzen auf transparente Kommunikation und technische Präzision.", locationTitle: "Unser Standort – Prag", locationText: "Unser Sitz ist in Prag, wir betreuen Kunden in Tschechien und Nachbarländern." },
        services: { title: "Leistungsumfang", intro: "Unsere Leistungen decken den gesamten Fahrzeugkaufprozess ab.", items: [{ title: "Fahrzeugzustandsprüfung", text: "Technische und visuelle Prüfung inkl. Diagnose und Historie." }, { title: "Prüfung in ganz Tschechien", text: "Wir reisen landesweit und auch in Nachbarstaaten." }, { title: "Import aus USA und Japan", text: "Wir übernehmen Auswahl, Prüfung, Transport und Formalitäten." }, { title: "Basisservice und TÜV-Vorbereitung", text: "Technische Vorbereitung vor Übergabe." }, { title: "Eigenes Fahrzeugangebot", text: "Laufend aktualisiertes Angebot geprüfter Fahrzeuge." }] },
        contact: { title: "Kontakt", p1: "Bei Kauf, Prüfung oder Import unterstützen wir Sie gerne.", processTitle: "Ablauf", processText: "Nach Ihrer Anfrage erstellen wir einen Plan und liefern klare Empfehlungen." },
        cars: { filterTitle: "Suche und Filter", search: "Suche", searchPlaceholder: "Modell, Marke, Antrieb...", fuel: "Kraftstoff", fuelAll: "Alle Kraftstoffe", brand: "Marke", brandAll: "Alle Marken", drive: "Antrieb", driveAll: "Alle Antriebe", transmission: "Getriebe", transmissionAll: "Alle Getriebe", hpFrom: "Leistung von (PS)", hpTo: "Leistung bis (PS)", doors: "Türen", doorsAll: "Alle", seats: "Sitze", seatsAll: "Alle", seatsFrom: "Sitze ab", seatsTo: "Sitze bis", quickSeats: "Schnellauswahl", seatsUnit: "Sitze", activeFilters: "Aktive Filter", clearAll: "Alle löschen", detailButton: "Fahrzeugdetails", noResults: "Für die gewählten Filter wurden keine Fahrzeuge gefunden." },
        carDetail: { notFoundTitle: "Fahrzeug nicht gefunden", notFoundText: "Aktuell ist kein Fahrzeug verfügbar.", technicalTitle: "Technische Daten", legalTitle: "Rechtliche Informationen", equipmentTitle: "Ausstattung", previousOwners: "Anzahl Vorbesitzer" },
        cms: {
            loginTitle: "CMS-Anmeldung", loginInfo: "Mitarbeiterzugang. Testdaten: admin / admin.", username: "Benutzername", password: "Passwort", loginButton: "Anmelden", loginError: "Falsche Anmeldedaten.", requiredDriveFuel: "Kraftstoff und Antrieb sind Pflichtfelder.", manualGearsRequired: "Bei manuellem Getriebe ist die Anzahl der Gänge erforderlich.", manageTitle: "Fahrzeugverwaltung", logoutButton: "Abmelden", intro: "Hier können Sie Fahrzeuge hinzufügen und bearbeiten.", technicalHelp: "Format: jede Zeile als Bezeichnung: Wert", equipmentHelp: "Jede Zeile = 1 Ausstattungsmerkmal",
            fields: { name: "Modell", brand: "Marke", year: "Baujahr", priceCzk: "Preis (in CZK)", mileage: "Kilometerstand", horsepower: "Leistung (PS)", doors: "Anzahl Türen", seats: "Anzahl Sitze", previousOwners: "Anzahl Vorbesitzer", drive: "Antrieb", fuel: "Kraftstoff", transmission: "Getriebe", manualGears: "Anzahl Gänge", image: "Fahrzeugfoto", description: "Kurzbeschreibung", legal: "Rechtliche Informationen", equipment: "Ausstattung", technicalDataRaw: "Technische Daten (Bezeichnung: Wert)", equipmentItemsRaw: "Ausstattung (1 Punkt pro Zeile)", available: "Fahrzeug ist verfügbar" },
            addButton: "Fahrzeug hinzufügen", currentCars: "Aktuelle Fahrzeuge", toggleAvailability: "Verfügbarkeit ändern", remove: "Entfernen"
        }
    },
    en: {
        nav: { home: "Home", about: "About", services: "Services", cars: "Cars", contact: "Contact", cms: "CMS" },
        common: { language: "Language", statusAvailable: "Available", statusUnavailable: "Currently unavailable", price: "Price", horsepowerUnit: "hp", doorsUnit: "doors" },
        pages: {
            home: { title: "ZMR Automovité", subtitle: "Premium vehicle inspection and import services without compromise." },
            about: { title: "About Us", subtitle: "Experience, transparency and focus on safe vehicle purchase." },
            services: { title: "Services", subtitle: "Complete solutions for inspection, import and vehicle preparation." },
            cars: { title: "Vehicle Offer", subtitle: "Overview of currently available vehicles with detailed information." },
            carDetail: { title: "Vehicle Detail", subtitle: "Complete vehicle details including legal info and equipment." },
            contact: { title: "Contact", subtitle: "We are ready to help with inspection, import and vehicle selection." },
            cms: { title: "Vehicle CMS", subtitle: "Internal area for managing vehicle inventory." }
        },
        home: { whyTitle: "Why choose ZMR Automovité", whyP1: "We provide in-depth vehicle checks, not just a quick glance.", whyP2: "Transparent cooperation from first contact to final recommendation.", approachTitle: "Comprehensive approach", approachText: "Selection, inspection, import and basic service in one place.", outputTitle: "Clear outputs", outputText: "You get clear information about condition, legal requirements and expected costs." },
        about: { title: "About our company", p1: "ZMR Automovité specializes in professional vehicle inspection and import support.", p2: "We emphasize transparent communication and technical precision.", locationTitle: "Our location – Prague", locationText: "We are based in Prague and serve clients across Czechia and neighboring countries." },
        services: { title: "Service scope", intro: "Our services cover the full lifecycle of buying a vehicle.", items: [{ title: "Vehicle condition inspection", text: "Visual and technical check including diagnostics and history verification." }, { title: "Inspection across Czechia", text: "We can travel across Czechia and neighboring countries." }, { title: "Import from USA and Japan", text: "We handle selection, verification, transport and administration." }, { title: "Basic service and inspection prep", text: "We prepare the vehicle technically before handover." }, { title: "Own vehicle inventory", text: "We continuously add verified vehicles with transparent condition." }] },
        contact: { title: "Contact", p1: "If you are buying, inspecting or importing a car, we can help.", processTitle: "Cooperation process", processText: "After receiving your request, we prepare a plan and provide recommendations." },
        cars: { filterTitle: "Search and filters", search: "Search", searchPlaceholder: "Model, brand, drive...", fuel: "Fuel", fuelAll: "All fuels", brand: "Brand", brandAll: "All brands", drive: "Drive", driveAll: "All drive types", transmission: "Transmission", transmissionAll: "All transmissions", hpFrom: "Power from (hp)", hpTo: "Power to (hp)", doors: "Doors", doorsAll: "All", seats: "Seats", seatsAll: "All", seatsFrom: "Seats from", seatsTo: "Seats to", quickSeats: "Quick seats", seatsUnit: "seats", activeFilters: "Active filters", clearAll: "Clear all", detailButton: "Vehicle detail", noResults: "No vehicles found for the selected filters." },
        carDetail: { notFoundTitle: "Vehicle not found", notFoundText: "There are currently no vehicles available.", technicalTitle: "Technical data", legalTitle: "Legal information", equipmentTitle: "Equipment", previousOwners: "Number of previous owners" },
        cms: {
            loginTitle: "CMS login", loginInfo: "Staff access. Test credentials: admin / admin.", username: "Username", password: "Password", loginButton: "Sign in", loginError: "Invalid login credentials.", requiredDriveFuel: "Fuel and drive are required.", manualGearsRequired: "Manual transmission requires the number of gears.", manageTitle: "Vehicle management", logoutButton: "Sign out", intro: "You can add new cars, upload photos and fill in details.", technicalHelp: "Format: each line as Label: Value", equipmentHelp: "Each line = 1 equipment item",
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
    if (["plug inhybrid", "plug-in hybrid", "plugin hybrid", "phev"].includes(raw)) {
        return "Plug inhybrid";
    }
    if (["plyn", "lpg", "cng", "gas"].includes(raw)) {
        return "Plyn";
    }
    return sanitizeOption(value, FUEL_OPTIONS, "Benzín");
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

async function translateTextsForLanguage(texts, targetLanguage) {
    if (!TRANSLATE_PROXY_URL || !Array.isArray(texts) || texts.length === 0) {
        return {};
    }
    try {
        const response = await fetch(TRANSLATE_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts, target: targetLanguage })
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

async function buildLocalizedCmsFields(baseFields, sourceLanguage) {
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
        available: Boolean(car.available)
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

    const requestPromise = fetch(TRANSLATE_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: toRequest, target })
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

function readFilesAsDataUrls(files) {
    const fileList = Array.from(files || []);
    return Promise.all(
        fileList.map((file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        }))
    );
}

function buildTechnicalDataFromChecklist(checklist, baseForm, transmission, manualGears) {
    const fallbackByLabel = {
        "Vehicle condition": baseForm.available ? "Available" : "Unavailable",
        "Mileage": baseForm.mileage,
        "Performance": `${Math.round(parseNumber(baseForm.horsepower) || 0)} hp`,
        "Drive type": baseForm.drive,
        "Fuel type": baseForm.fuel,
        "Number of seats": String(Math.max(2, Math.round(parseNumber(baseForm.seats) || 0))),
        "Number of doors": String(Math.max(2, Math.round(parseNumber(baseForm.doors) || 0))),
        "Gearbox": transmission === "Manuál" && manualGears > 0 ? `${transmission} (${manualGears})` : transmission,
        "Number of vehicle owners": String(Math.max(0, Math.round(parseNumber(baseForm.previousOwners) || 0)))
    };

    const rows = TECHNICAL_CHECKLIST_FIELDS
        .map((field) => {
            const selected = checklist[field.label];
            if (!selected?.enabled) {
                return null;
            }
            let rawValue = selected.value?.trim() || fallbackByLabel[field.label] || "";
            if (TECHNICAL_NUMERIC_FIELD_LABELS.has(field.label)) {
                rawValue = rawValue.replace(/[^\d]/g, "");
            }
            if (field.label === "Performance" && rawValue && !/hp$/i.test(rawValue)) {
                rawValue = `${rawValue} hp`;
            }
            if (!rawValue) {
                return null;
            }
            return {
                label: field.label,
                value: rawValue,
                icon: selected.icon || field.defaultIcon || "🧾"
            };
        })
        .filter(Boolean);

    return rows.length > 0 ? rows : undefined;
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
    const fallbackCars = defaultCars.map((car, index) => normalizeCar(car, index));
    const raw = localStorage.getItem(CARS_STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(fallbackCars));
        return fallbackCars;
    }

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized = parsed.map((car, index) => normalizeCar(car, index));
            localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(normalized));
            return normalized;
        }
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(fallbackCars));
        return fallbackCars;
    } catch {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(fallbackCars));
        return fallbackCars;
    }
}

function saveCars(cars) {
    try {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
    } catch (error) {
        console.error("Nepodarilo sa uložiť vozidlá do localStorage.", error);
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
    const locale = language === "cs" ? "cs-CZ" : language === "sk" ? "sk-SK" : language === "de" ? "de-DE" : "en-US";
    const amount = currency === "CZK" ? priceCzk : priceCzk / CZK_TO_EUR_RATE;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

async function sendReservationEmailViaProxy(payload) {
    if (!RESERVATION_PROXY_URL) {
        return { ok: false, error: "missing-endpoint" };
    }

    try {
        const response = await fetch(RESERVATION_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            return { ok: false, error: `http-${response.status}` };
        }

        const data = await response.json().catch(() => ({}));
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
            reservationBody: (car, form) => `Fahrzeug: ${car.name}\nID: ${car.id}\nJahr: ${car.year}\nPreis: ${car.priceCzk} CZK\n\nReservierungsanfrage von:\nVorname: ${form.firstName}\nNachname: ${form.lastName}\nE-Mail: ${form.email}\nTelefon: ${form.phone}`
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
            reservationBody: (car, form) => `Vehicle: ${car.name}\nID: ${car.id}\nYear: ${car.year}\nPrice: ${car.priceCzk} CZK\n\nReservation request from:\nFirst name: ${form.firstName}\nLast name: ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}`
        };
    }
    if (language === "cs") {
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
            reservationBody: (car, form) => `Vozidlo: ${car.name}\nID: ${car.id}\nRok: ${car.year}\nCena: ${car.priceCzk} Kč\n\nŽádost o rezervaci:\nJméno: ${form.firstName}\nPříjmení: ${form.lastName}\nE-mail: ${form.email}\nTelefon: ${form.phone}`
        };
    }
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
        reservationBody: (car, form) => `Vozidlo: ${car.name}\nID: ${car.id}\nRok: ${car.year}\nCena: ${car.priceCzk} Kč\n\nŽiadosť o rezerváciu:\nMeno: ${form.firstName}\nPriezvisko: ${form.lastName}\nE-mail: ${form.email}\nTelefón: ${form.phone}`
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

function Navigation({ activePage, texts }) {
    const items = [
        { key: "home", label: texts.nav.home, href: "index.html" },
        { key: "about", label: texts.nav.about, href: "o-nas.html" },
        { key: "services", label: texts.nav.services, href: "sluzby.html" },
        { key: "cars", label: texts.nav.cars, href: "auta.html" },
        { key: "contact", label: texts.nav.contact, href: "kontakt.html" },
        { key: "cms", label: "CMS", href: "cms.html" }
    ];

    return (
        <nav className="nav">
            {items.map((item) => (
                <a
                    key={item.key}
                    href={item.href}
                    className={item.key === activePage ? "nav-link active" : "nav-link"}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}

function LanguageSwitcher({ language, onChange, texts }) {
    return (
        <div className="language-switcher" role="group" aria-label={texts.common.language}>
            {LANGUAGE_OPTIONS.map((item) => (
                <button
                    key={item.code}
                    type="button"
                    className={item.code === language ? "flag-button active" : "flag-button"}
                    onClick={() => onChange(item.code)}
                    aria-label={item.label}
                    title={item.label}
                >
                    <span aria-hidden="true">{item.flag}</span>
                </button>
            ))}
        </div>
    );
}

function PageShell({ page, title, subtitle, language, onLanguageChange, texts, children }) {
    return (
        <>
            <header className="top-header">
                <div className="top-inner">
                    <a className="brand" href="main.html">
                        <img src="sources/ZMRAutomovite-logo.png" alt="ZMR Automovité logo" className="logo" />
                    </a>
                    <div className="header-tools">
                        <Navigation activePage={page} texts={texts} />
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
    return (
        <>
            <section className="card">
                <h2>{texts.home.whyTitle}</h2>
                <p>{texts.home.whyP1}</p>
                <p>{texts.home.whyP2}</p>
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
        </>
    );
}

function AboutPage({ texts }) {
    return (
        <>
            <section className="card">
                <h2>{texts.about.title}</h2>
                <p>{texts.about.p1}</p>
                <p>{texts.about.p2}</p>
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

function ServicesPage({ texts }) {
    return (
        <>
            <section className="card">
                <h2>{texts.services.title}</h2>
                <p>{texts.services.intro}</p>
            </section>

            <section className="grid wide-grid">
                {texts.services.items.map((service) => (
                    <article key={service.title} className="service-item">
                        <h3>{service.title}</h3>
                        <p>{service.text}</p>
                    </article>
                ))}
            </section>
        </>
    );
}

function ContactPage({ texts }) {
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
    const seatsRangeStartPercent = seatsMaxBound > seatsMinBound ? ((seatsRangeFrom - seatsMinBound) / (seatsMaxBound - seatsMinBound)) * 100 : 0;
    const seatsRangeEndPercent = seatsMaxBound > seatsMinBound ? ((seatsRangeTo - seatsMinBound) / (seatsMaxBound - seatsMinBound)) * 100 : 100;
    const horsepowerRangeStartPercent = horsepowerMaxBound > horsepowerMinBound ? ((horsepowerRangeFrom - horsepowerMinBound) / (horsepowerMaxBound - horsepowerMinBound)) * 100 : 0;
    const horsepowerRangeEndPercent = horsepowerMaxBound > horsepowerMinBound ? ((horsepowerRangeTo - horsepowerMinBound) / (horsepowerMaxBound - horsepowerMinBound)) * 100 : 100;
    const bubbleOverlapThreshold = window.innerWidth <= 640 ? 18 : 14;
    const seatsBubbleTooClose = Math.abs(seatsRangeEndPercent - seatsRangeStartPercent) < bubbleOverlapThreshold;
    const horsepowerBubbleTooClose = Math.abs(horsepowerRangeEndPercent - horsepowerRangeStartPercent) < bubbleOverlapThreshold;
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
                        <span className="results-badge">{filteredCars.length} {resultsLabel}</span>
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
                        <input type="text" placeholder={texts.cars.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
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
                        {texts.cars.transmission}
                        <DarkSelect value={transmission} onChange={setTransmission} options={transmissionSelectOptions} placeholder={texts.cars.transmissionAll} ariaLabel={texts.cars.transmission} />
                    </label>
                    <div className="hp-range-field">
                        <span>{texts.cars.hpFrom} / {texts.cars.hpTo}</span>
                        <div className="hp-range-values">
                            <strong>{horsepowerFromCurrent} {texts.common.horsepowerUnit}</strong>
                            <strong>{horsepowerToCurrent} {texts.common.horsepowerUnit}</strong>
                        </div>
                        <div
                            className="range-thumb-bubbles"
                            style={{
                                "--from-pos": `${horsepowerRangeStartPercent}%`,
                                "--to-pos": `${horsepowerRangeEndPercent}%`
                            }}
                            aria-hidden="true"
                        >
                            <span className={horsepowerBubbleTooClose ? "range-bubble from shift-left" : "range-bubble from"}>{horsepowerFromCurrent}</span>
                            <span className={horsepowerBubbleTooClose ? "range-bubble to shift-right" : "range-bubble to"}>{horsepowerToCurrent}</span>
                        </div>
                        <div
                            className="range-fill-track"
                            style={{
                                "--range-start": `${horsepowerRangeStartPercent}%`,
                                "--range-end": `${horsepowerRangeEndPercent}%`
                            }}
                        ></div>
                        <div className="hp-range-sliders">
                            <input
                                className="range-input-from"
                                type="range"
                                min={horsepowerMinBound}
                                max={horsepowerMaxBound}
                                value={horsepowerFromCurrent}
                                onChange={(event) => {
                                    const next = Math.min(Number(event.target.value), horsepowerToCurrent);
                                    setHorsepowerFrom(String(next));
                                }}
                            />
                            <input
                                className="range-input-to"
                                type="range"
                                min={horsepowerMinBound}
                                max={horsepowerMaxBound}
                                value={horsepowerToCurrent}
                                onChange={(event) => {
                                    const next = Math.max(Number(event.target.value), horsepowerFromCurrent);
                                    setHorsepowerTo(String(next));
                                }}
                            />
                        </div>
                        <div className="range-bounds" aria-hidden="true">
                            <span>{horsepowerMinBound} {texts.common.horsepowerUnit}</span>
                            <span>{horsepowerMaxBound} {texts.common.horsepowerUnit}</span>
                        </div>
                    </div>
                    <label>
                        {texts.cars.doors}
                        <DarkSelect value={doors} onChange={setDoors} options={doorSelectOptions} placeholder={texts.cars.doorsAll} ariaLabel={texts.cars.doors} />
                    </label>
                    <div className="seat-range-field">
                        <span>{texts.cars.seatsFrom} / {texts.cars.seatsTo}</span>
                        <div className="hp-range-values">
                            <strong>{seatsFromCurrent} {texts.cars.seatsUnit}</strong>
                            <strong>{seatsToCurrent} {texts.cars.seatsUnit}</strong>
                        </div>
                        <div
                            className="range-thumb-bubbles"
                            style={{
                                "--from-pos": `${seatsRangeStartPercent}%`,
                                "--to-pos": `${seatsRangeEndPercent}%`
                            }}
                            aria-hidden="true"
                        >
                            <span className={seatsBubbleTooClose ? "range-bubble from shift-left" : "range-bubble from"}>{seatsFromCurrent}</span>
                            <span className={seatsBubbleTooClose ? "range-bubble to shift-right" : "range-bubble to"}>{seatsToCurrent}</span>
                        </div>
                        <div
                            className="range-fill-track"
                            style={{
                                "--range-start": `${seatsRangeStartPercent}%`,
                                "--range-end": `${seatsRangeEndPercent}%`
                            }}
                        ></div>
                        <div className="hp-range-sliders">
                            <input
                                className="range-input-from"
                                type="range"
                                min={seatsMinBound}
                                max={seatsMaxBound}
                                value={seatsFromCurrent}
                                onChange={(event) => {
                                    const next = Math.min(Number(event.target.value), seatsToCurrent);
                                    setSeatsFrom(String(next));
                                }}
                            />
                            <input
                                className="range-input-to"
                                type="range"
                                min={seatsMinBound}
                                max={seatsMaxBound}
                                value={seatsToCurrent}
                                onChange={(event) => {
                                    const next = Math.max(Number(event.target.value), seatsFromCurrent);
                                    setSeatsTo(String(next));
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
                {filteredCars.map((car) => (
                    <article key={car.id} className="car-card">
                        <img src={getCarThumbnail(car)} alt={car.name} className="car-image" />
                        <div className="car-content">
                            <h2>{car.name}</h2>
                            <p className="car-meta">
                                {car.year} • {car.mileage} • {car.fuel} • {formatTransmission(car)}
                            </p>
                            <p className="car-meta">
                                {car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.seats} {texts.cars.seatsUnit || "sedadiel"} • {car.drive}
                            </p>
                            <p>{car.description}</p>
                            <p className={car.reserved ? "status reserved" : (car.available ? "status available" : "status unavailable")}>
                                {car.reserved ? reservationTexts.statusReserved : (car.available ? texts.common.statusAvailable : texts.common.statusUnavailable)}
                            </p>
                            <div className="car-footer">
                                <strong>{formatPrice(car.priceCzk, language)}</strong>
                                <a href={`vozidlo.html?id=${encodeURIComponent(car.id)}`} className="button-link">{texts.cars.detailButton}</a>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {filteredCars.length === 0 && (
                <section className="card">
                    <p>{texts.cars.noResults}</p>
                </section>
            )}
        </>
    );
}

function CarDetailPage({ cars, setCars, language, texts }) {
    const reservationTexts = useMemo(() => getReservationTexts(language), [language]);
    const carId = readCarIdFromQuery();
    const car = cars.find((item) => item.id === carId) || cars[0];
    const [dynamicTechnicalValues, setDynamicTechnicalValues] = useState({});
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reservationForm, setReservationForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [reservationMessage, setReservationMessage] = useState("");
    const [isReservationSending, setIsReservationSending] = useState(false);

    if (!car) {
        return (
            <section className="card">
                <h2>{texts.carDetail.notFoundTitle}</h2>
                <p>{texts.carDetail.notFoundText}</p>
            </section>
        );
    }

    const technicalRows = getTechnicalData(car);
    const equipmentRows = getEquipmentItems(car);
    const detailImages = getCarImages(car);
    const detailMainImage = detailImages[Math.min(selectedImageIndex, detailImages.length - 1)] || detailImages[0];

    useEffect(() => {
        setSelectedImageIndex(Number.isInteger(car?.thumbnailIndex) ? car.thumbnailIndex : 0);
        setReservationMessage("");
    }, [car?.id]);

    const submitReservation = async (event) => {
        event.preventDefault();
        if (!car || !car.available || car.reserved || isReservationSending) {
            setReservationMessage(reservationTexts.alreadyReserved);
            return;
        }

        setReservationMessage(reservationTexts.reserveSending);
        setIsReservationSending(true);

        const reservationPayload = {
            language,
            toEmail: RESERVATION_EMAIL,
            subject: reservationTexts.reservationSubject(car.name),
            text: reservationTexts.reservationBody(car, reservationForm),
            car: {
                id: car.id,
                name: car.name,
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

        const updatedCars = cars.map((item) => item.id === car.id ? { ...item, reserved: true } : item);
        setCars(updatedCars);
        saveCars(updatedCars);

        setReservationMessage(reservationTexts.reservedSuccess);
        setIsReservationSending(false);
    };

    useEffect(() => {
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
    }, [car?.id, language]);

    return (
        <>
            <section className="card detail-card">
                <div>
                    <img src={detailMainImage} alt={car.name} className="detail-image" />
                    {detailImages.length > 1 && (
                        <div className="detail-gallery-thumbs">
                            {detailImages.map((src, index) => (
                                <button key={`${src}-${index}`} type="button" className={index === selectedImageIndex ? "detail-thumb active" : "detail-thumb"} onClick={() => setSelectedImageIndex(index)}>
                                    <img src={src} alt={`${car.name} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h2>{car.name}</h2>
                    <p className="car-meta">
                        {car.year} • {car.mileage} • {car.fuel} • {formatTransmission(car)}
                    </p>
                    <p className="car-meta">
                        {car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.seats} {texts.cars.seatsUnit || "sedadiel"} • {car.drive}
                    </p>
                    <p className="car-meta">👤 {texts.carDetail.previousOwners}: {car.previousOwners}</p>
                    <p>{car.description}</p>
                    <p><strong>{texts.common.price}:</strong> {formatPrice(car.priceCzk, language)}</p>
                    <p className={car.reserved ? "status reserved" : (car.available ? "status available" : "status unavailable")}>
                        {car.reserved ? reservationTexts.statusReserved : (car.available ? texts.common.statusAvailable : texts.common.statusUnavailable)}
                    </p>
                    <h3>{texts.carDetail.legalTitle}</h3>
                    <p>{car.legal}</p>
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
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [editingCarId, setEditingCarId] = useState(null);
    const [dragImageIndex, setDragImageIndex] = useState(null);
    const [dragOverImageIndex, setDragOverImageIndex] = useState(null);
    const [liveMessage, setLiveMessage] = useState("");
    const [form, setForm] = useState({
        name: "",
        brand: "",
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
        reserved: false,
        available: true
    });
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
                toggleReserved: "Reservierung umschalten"
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
                toggleReserved: "Toggle reservation"
            };
        }
        if (language === "cs") {
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
                toggleReserved: "Přepnout rezervaci"
            };
        }
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
            toggleReserved: "Prepnúť rezerváciu"
        };
    }, [language]);

    const announceLiveMessage = (message) => {
        setLiveMessage("");
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

    const handleLogin = (event) => {
        event.preventDefault();
        if (credentials.username === "admin" && credentials.password === "admin") {
            localStorage.setItem(CMS_AUTH_KEY, "1");
            setIsLogged(true);
            setError("");
            return;
        }
        setError(texts.cms.loginError);
    };

    const handleLogout = () => {
        localStorage.removeItem(CMS_AUTH_KEY);
        setIsLogged(false);
    };

    const resetCmsForm = () => {
        setEditingCarId(null);
        setDragImageIndex(null);
        setDragOverImageIndex(null);
        setLiveMessage("");
        setForm({
            name: "",
            brand: "",
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
            reserved: false,
            available: true
        });
        setTechnicalChecklist(createInitialTechnicalChecklistState());
        setEquipmentChecklist(createInitialEquipmentChecklistState());
    };

    const beginEditCar = (car) => {
        setEditingCarId(car.id);
        setError("");
        setForm({
            name: car.name || "",
            brand: car.brand || "",
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

    const addCar = (event) => {
        event.preventDefault();

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

        const baseCar = {
            id: editingCarId || `zmr-${Date.now()}`,
            name: form.name,
            brand: form.brand,
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
            technicalData,
            equipmentItems,
            equipment: equipmentItems.length > 0 ? `Výbava: ${equipmentItems.slice(0, 8).join(", ")}` : form.equipment,
            reserved: Boolean(form.reserved),
            available: form.available
        };

        const updated = editingCarId
            ? cars.map((car) => (car.id === editingCarId ? { ...car, ...baseCar } : car))
            : [baseCar, ...cars];
        setCars(updated);
        saveCars(updated);
        setError("");
        resetCmsForm();
    };

    const toggleAvailability = (id) => {
        const updated = cars.map((car) => car.id === id ? { ...car, available: !car.available } : car);
        setCars(updated);
        saveCars(updated);
    };

    const toggleReserved = (id) => {
        const updated = cars.map((car) => car.id === id ? { ...car, reserved: !car.reserved } : car);
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
                <form className="form-grid" onSubmit={handleLogin}>
                    <label>
                        {texts.cms.username}
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        {texts.cms.password}
                        <input
                            type="password"
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
                <form className="form-grid" onSubmit={addCar}>
                    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{liveMessage}</p>
                    <label>{texts.cms.fields.name}<input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.brand}<input type="text" value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} required /></label>
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
                        <p className="checklist-title">{texts.cms.fields.technicalDataRaw}</p>
                        <small>{texts.cms.technicalHelp}</small>
                        <div className="checklist-grid technical-grid-cms">
                            {TECHNICAL_CHECKLIST_FIELDS.map((field) => {
                                const row = technicalChecklist[field.label] || { enabled: false, value: "", icon: field.defaultIcon };
                                const isNumericField = TECHNICAL_NUMERIC_FIELD_LABELS.has(field.label);
                                return (
                                    <div key={field.label} className="checklist-item technical-check-item">
                                        <label className="checkbox-row">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(row.enabled)}
                                                onChange={(e) => setTechnicalChecklist((prev) => ({
                                                    ...prev,
                                                    [field.label]: { ...row, enabled: e.target.checked }
                                                }))}
                                            />
                                            <span className="fixed-tech-icon" title={translateTechnicalIconLabel(row.icon || field.defaultIcon, language)} aria-label={translateTechnicalIconLabel(row.icon || field.defaultIcon, language)}>{row.icon || field.defaultIcon}</span>
                                            {translateTechnicalLabel(field.label, language)}
                                        </label>
                                        <input
                                            type={isNumericField ? "number" : "text"}
                                            min={isNumericField ? "0" : undefined}
                                            inputMode={isNumericField ? "numeric" : undefined}
                                            pattern={isNumericField ? "[0-9]*" : undefined}
                                            value={row.value}
                                            onChange={(e) => setTechnicalChecklist((prev) => ({
                                                ...prev,
                                                [field.label]: { ...row, value: sanitizeTechnicalChecklistValue(field.label, e.target.value) }
                                            }))}
                                            disabled={!row.enabled}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
                    <label className="checkbox-row full-width">
                        <input
                            type="checkbox"
                            checked={form.reserved}
                            onChange={(e) => setForm((prev) => ({ ...prev, reserved: e.target.checked }))}
                        />
                        {cmsUiTexts.reservedLabel}
                    </label>
                    <label className="checkbox-row full-width">
                        <input
                            type="checkbox"
                            checked={form.available}
                            onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                        />
                        {texts.cms.fields.available}
                    </label>
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
                        <article key={car.id} className="cms-item">
                            <div>
                                <h3>{car.name}</h3>
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
                                <button className="button-link button-secondary" onClick={() => toggleReserved(car.id)}>
                                    {cmsUiTexts.toggleReserved}
                                </button>
                                <button className="button-link button-secondary" onClick={() => toggleAvailability(car.id)}>
                                    {texts.cms.toggleAvailability}
                                </button>
                                <button className="button-link danger" onClick={() => removeCar(car.id)}>
                                    {texts.cms.remove}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

function App() {
    const rootElement = document.getElementById("root");
    const page = rootElement?.dataset?.page || "home";
    const [cars, setCars] = useState(getCars);
    const [language, setLanguage] = useState(getLanguagePreference);
    const texts = useMemo(() => I18N[language] || I18N.cs, [language]);

    useEffect(() => {
        saveCars(cars);
    }, [cars]);

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
                    content: <AboutPage texts={texts} />
                };
            case "services":
                return {
                    title: texts.pages.services.title,
                    subtitle: texts.pages.services.subtitle,
                    content: <ServicesPage texts={texts} />
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
                    content: <CarDetailPage cars={cars} setCars={setCars} language={language} texts={texts} />
                };
            case "contact":
                return {
                    title: texts.pages.contact.title,
                    subtitle: texts.pages.contact.subtitle,
                    content: <ContactPage texts={texts} />
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
                    content: <HomePage texts={texts} />
                };
        }
    }, [page, cars, language, texts]);

    return (
        <PageShell page={page} title={pageConfig.title} subtitle={pageConfig.subtitle} language={language} onLanguageChange={setLanguage} texts={texts}>
            {pageConfig.content}
        </PageShell>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);