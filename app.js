const { useEffect, useMemo, useState } = React;

const CARS_STORAGE_KEY = "zmrCars";
const CMS_AUTH_KEY = "zmrCmsAuth";
const LANGUAGE_STORAGE_KEY = "zmrLanguage";
const CZK_TO_EUR_RATE = 25;
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
            hpFrom: "Výkon od (k)",
            hpTo: "Výkon do (k)",
            doors: "Dveře",
            doorsAll: "Všechny",
            activeFilters: "Aktivní filtry",
            clearAll: "Zrušit vše",
            detailButton: "Detail vozidla",
            noResults: "Pro zadané filtry nebyla nalezena žádná vozidla."
        },
        carDetail: {
            notFoundTitle: "Vozidlo nebylo nalezeno",
            notFoundText: "Momentálně není dostupné žádné vozidlo. Zkuste to prosím později.",
            legalTitle: "Legislativní informace",
            equipmentTitle: "Výbava"
        },
        cms: {
            loginTitle: "CMS přihlášení",
            loginInfo: "Přístup pro zaměstnance. Testovací údaje: admin / admin.",
            username: "Uživatelské jméno",
            password: "Heslo",
            loginButton: "Přihlásit se",
            loginError: "Nesprávné přihlašovací údaje.",
            manageTitle: "Správa vozidel",
            logoutButton: "Odhlásit se",
            intro: "Můžete přidávat nová vozidla, nahrát fotku, vyplnit popis, legislativní informace i výbavu.",
            fields: {
                name: "Model vozidla",
                brand: "Značka",
                year: "Rok výroby",
                priceCzk: "Cena (v Kč)",
                mileage: "Nájezd",
                horsepower: "Výkon (k)",
                doors: "Počet dveří",
                drive: "Náhon",
                fuel: "Palivo",
                transmission: "Převodovka",
                image: "Fotka vozidla",
                description: "Základní popis",
                legal: "Legislativní informace",
                equipment: "Výbava",
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
            filterTitle: "Vyhľadávanie a filtre", search: "Vyhľadávanie", searchPlaceholder: "Model, značka, náhon...", fuel: "Palivo", fuelAll: "Všetky palivá", brand: "Značka", brandAll: "Všetky značky", drive: "Náhon", driveAll: "Všetky náhony", hpFrom: "Výkon od (k)", hpTo: "Výkon do (k)", doors: "Dvere", doorsAll: "Všetky", activeFilters: "Aktívne filtre", clearAll: "Zrušiť všetko", detailButton: "Detail vozidla", noResults: "Pre zadané filtre sa nenašli žiadne vozidlá."
        },
        carDetail: { notFoundTitle: "Vozidlo sa nenašlo", notFoundText: "Momentálne nie je dostupné žiadne vozidlo. Skúste to prosím neskôr.", legalTitle: "Legislatívne informácie", equipmentTitle: "Výbava" },
        cms: {
            loginTitle: "CMS prihlásenie", loginInfo: "Prístup pre zamestnancov. Testovacie údaje: admin / admin.", username: "Prihlasovacie meno", password: "Heslo", loginButton: "Prihlásiť sa", loginError: "Nesprávne prihlasovacie údaje.", manageTitle: "Správa vozidiel", logoutButton: "Odhlásiť sa", intro: "Tu môžete pridávať nové autá, nahrávať fotku, vyplniť popis, legislatívne informácie a výbavu.",
            fields: { name: "Model vozidla", brand: "Značka", year: "Rok výroby", priceCzk: "Cena (v Kč)", mileage: "Nájazd", horsepower: "Výkon (k)", doors: "Počet dverí", drive: "Náhon", fuel: "Palivo", transmission: "Prevodovka", image: "Fotka vozidla", description: "Základný popis", legal: "Legislatívne informácie", equipment: "Výbava", available: "Vozidlo je dostupné" },
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
        cars: { filterTitle: "Suche und Filter", search: "Suche", searchPlaceholder: "Modell, Marke, Antrieb...", fuel: "Kraftstoff", fuelAll: "Alle Kraftstoffe", brand: "Marke", brandAll: "Alle Marken", drive: "Antrieb", driveAll: "Alle Antriebe", hpFrom: "Leistung von (PS)", hpTo: "Leistung bis (PS)", doors: "Türen", doorsAll: "Alle", activeFilters: "Aktive Filter", clearAll: "Alle löschen", detailButton: "Fahrzeugdetails", noResults: "Für die gewählten Filter wurden keine Fahrzeuge gefunden." },
        carDetail: { notFoundTitle: "Fahrzeug nicht gefunden", notFoundText: "Aktuell ist kein Fahrzeug verfügbar.", legalTitle: "Rechtliche Informationen", equipmentTitle: "Ausstattung" },
        cms: {
            loginTitle: "CMS-Anmeldung", loginInfo: "Mitarbeiterzugang. Testdaten: admin / admin.", username: "Benutzername", password: "Passwort", loginButton: "Anmelden", loginError: "Falsche Anmeldedaten.", manageTitle: "Fahrzeugverwaltung", logoutButton: "Abmelden", intro: "Hier können Sie Fahrzeuge hinzufügen und bearbeiten.",
            fields: { name: "Modell", brand: "Marke", year: "Baujahr", priceCzk: "Preis (in CZK)", mileage: "Kilometerstand", horsepower: "Leistung (PS)", doors: "Anzahl Türen", drive: "Antrieb", fuel: "Kraftstoff", transmission: "Getriebe", image: "Fahrzeugfoto", description: "Kurzbeschreibung", legal: "Rechtliche Informationen", equipment: "Ausstattung", available: "Fahrzeug ist verfügbar" },
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
        cars: { filterTitle: "Search and filters", search: "Search", searchPlaceholder: "Model, brand, drive...", fuel: "Fuel", fuelAll: "All fuels", brand: "Brand", brandAll: "All brands", drive: "Drive", driveAll: "All drive types", hpFrom: "Power from (hp)", hpTo: "Power to (hp)", doors: "Doors", doorsAll: "All", activeFilters: "Active filters", clearAll: "Clear all", detailButton: "Vehicle detail", noResults: "No vehicles found for the selected filters." },
        carDetail: { notFoundTitle: "Vehicle not found", notFoundText: "There are currently no vehicles available.", legalTitle: "Legal information", equipmentTitle: "Equipment" },
        cms: {
            loginTitle: "CMS login", loginInfo: "Staff access. Test credentials: admin / admin.", username: "Username", password: "Password", loginButton: "Sign in", loginError: "Invalid login credentials.", manageTitle: "Vehicle management", logoutButton: "Sign out", intro: "You can add new cars, upload photos and fill in details.",
            fields: { name: "Vehicle model", brand: "Brand", year: "Year", priceCzk: "Price (in CZK)", mileage: "Mileage", horsepower: "Power (hp)", doors: "Number of doors", drive: "Drive", fuel: "Fuel", transmission: "Transmission", image: "Vehicle photo", description: "Basic description", legal: "Legal information", equipment: "Equipment", available: "Vehicle is available" },
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
        drive: "Zadní",
        fuel: "Benzín",
        transmission: "Automat",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        description: "Spoľahlivé a pravidelne servisované vozidlo vhodné na dlhé trasy aj každodenné používanie. Vozidlo je po technickej kontrole a má transparentnú históriu.",
        legal: "Legislatívne informácie: Vozidlo je možné prihlásiť v ČR/SR po štandardnom procese registrácie. Emisná norma EURO 6. Pri dovoze zabezpečíme kompletné podklady pre evidenciu a STK.",
        equipment: "Výbava: LED svetlomety, navigácia, parkovacia kamera, vyhrievané sedadlá, tempomat, bezkľúčové štartovanie, multifunkčný volant.",
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
        drive: "xDrive",
        fuel: "Benzín",
        transmission: "Automat",
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

function normalizeCar(car, index) {
    return {
        ...car,
        id: car.id || `zmr-${Date.now()}-${index}`,
        brand: car.brand || getBrandFromName(car.name),
        horsepower: Number.isFinite(Number(car.horsepower)) ? Number(car.horsepower) : 0,
        doors: Number.isFinite(Number(car.doors)) ? Number(car.doors) : 0,
        drive: car.drive || "Neuvedeno",
        priceCzk: parsePriceCzk(car),
        available: Boolean(car.available)
    };
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
        doors: params.get("doors") || "",
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
        doors: filters.doors,
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
    const [search, setSearch] = useState(() => readCarFiltersFromQuery().search);
    const [debouncedSearch, setDebouncedSearch] = useState(() => readCarFiltersFromQuery().search);
    const [fuel, setFuel] = useState(() => readCarFiltersFromQuery().fuel);
    const [horsepowerFrom, setHorsepowerFrom] = useState(() => readCarFiltersFromQuery().horsepowerFrom);
    const [horsepowerTo, setHorsepowerTo] = useState(() => readCarFiltersFromQuery().horsepowerTo);
    const [doors, setDoors] = useState(() => readCarFiltersFromQuery().doors);
    const [brand, setBrand] = useState(() => readCarFiltersFromQuery().brand);
    const [drive, setDrive] = useState(() => readCarFiltersFromQuery().drive);
    const resetFiltersLabel = RESET_LABELS[language] || RESET_LABELS.cs;
    const resultsLabel = RESULTS_LABELS[language] || RESULTS_LABELS.cs;

    const fuelOptions = useMemo(() => Array.from(new Set(cars.map((car) => car.fuel).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)), [cars, language]);
    const brandOptions = useMemo(() => Array.from(new Set(cars.map((car) => car.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)), [cars, language]);
    const driveOptions = useMemo(() => Array.from(new Set(cars.map((car) => car.drive).filter(Boolean))).sort((a, b) => a.localeCompare(b, language)), [cars, language]);
    const doorOptions = useMemo(() => Array.from(new Set(cars.map((car) => Number(car.doors)).filter((count) => Number.isFinite(count) && count > 0))).sort((a, b) => a - b), [cars]);

    const filteredCars = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();
        const hpFromValue = parseNumber(horsepowerFrom);
        const hpToValue = parseNumber(horsepowerTo);

        return cars
            .filter((car) => {
                const matchesQuery = !query || [car.name, car.brand, car.fuel, car.transmission, car.drive].join(" ").toLowerCase().includes(query);
                const matchesFuel = !fuel || car.fuel === fuel;
                const matchesBrand = !brand || car.brand === brand;
                const matchesDrive = !drive || car.drive === drive;
                const matchesDoors = !doors || String(car.doors) === String(doors);
                const carHorsepower = Number(car.horsepower);
                const matchesMinHorsepower = !Number.isFinite(hpFromValue) || carHorsepower >= hpFromValue;
                const matchesMaxHorsepower = !Number.isFinite(hpToValue) || carHorsepower <= hpToValue;

                return matchesQuery && matchesFuel && matchesBrand && matchesDrive && matchesDoors && matchesMinHorsepower && matchesMaxHorsepower;
            })
            .sort((a, b) => {
                if (a.available === b.available) {
                    return 0;
                }
                return a.available ? -1 : 1;
            });
    }, [cars, debouncedSearch, fuel, brand, drive, doors, horsepowerFrom, horsepowerTo]);

    const hasActiveFilters = Boolean(search || fuel || horsepowerFrom || horsepowerTo || doors || brand || drive);
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
            setDoors(nextFilters.doors);
            setHorsepowerFrom(nextFilters.horsepowerFrom);
            setHorsepowerTo(nextFilters.horsepowerTo);
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        syncCarFiltersToQuery({
            search: debouncedSearch,
            fuel,
            brand,
            drive,
            doors,
            horsepowerFrom,
            horsepowerTo
        });
    }, [debouncedSearch, fuel, brand, drive, doors, horsepowerFrom, horsepowerTo]);

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
    if (doors) {
        activeFilterChips.push({ key: "doors", label: `${texts.cars.doors}: ${doors}`, clear: () => setDoors("") });
    }
    if (horsepowerFrom) {
        activeFilterChips.push({ key: "hpFrom", label: `${texts.cars.hpFrom}: ${horsepowerFrom}`, clear: () => setHorsepowerFrom("") });
    }
    if (horsepowerTo) {
        activeFilterChips.push({ key: "hpTo", label: `${texts.cars.hpTo}: ${horsepowerTo}`, clear: () => setHorsepowerTo("") });
    }

    const clearFilters = () => {
        setSearch("");
        setFuel("");
        setHorsepowerFrom("");
        setHorsepowerTo("");
        setDoors("");
        setBrand("");
        setDrive("");
    };

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
                <div className="search-row">
                    <input type="text" placeholder={texts.cars.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
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
                        <select value={fuel} onChange={(event) => setFuel(event.target.value)}>
                            <option value="">{texts.cars.fuelAll}</option>
                            {fuelOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        {texts.cars.brand}
                        <select value={brand} onChange={(event) => setBrand(event.target.value)}>
                            <option value="">{texts.cars.brandAll}</option>
                            {brandOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        {texts.cars.drive}
                        <select value={drive} onChange={(event) => setDrive(event.target.value)}>
                            <option value="">{texts.cars.driveAll}</option>
                            {driveOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        {texts.cars.hpFrom}
                        <input type="number" min="0" value={horsepowerFrom} onChange={(event) => setHorsepowerFrom(event.target.value)} />
                    </label>
                    <label>
                        {texts.cars.hpTo}
                        <input type="number" min="0" value={horsepowerTo} onChange={(event) => setHorsepowerTo(event.target.value)} />
                    </label>
                    <label>
                        {texts.cars.doors}
                        <select value={doors} onChange={(event) => setDoors(event.target.value)}>
                            <option value="">{texts.cars.doorsAll}</option>
                            {doorOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            <section className="grid wide-grid">
                {filteredCars.map((car) => (
                    <article key={car.id} className="car-card">
                        <img src={car.image} alt={car.name} className="car-image" />
                        <div className="car-content">
                            <h2>{car.name}</h2>
                            <p className="car-meta">
                                {car.year} • {car.mileage} • {car.fuel} • {car.transmission}
                            </p>
                            <p className="car-meta">
                                {car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.drive}
                            </p>
                            <p>{car.description}</p>
                            <p className={car.available ? "status available" : "status unavailable"}>
                                {car.available ? texts.common.statusAvailable : texts.common.statusUnavailable}
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

function CarDetailPage({ cars, language, texts }) {
    const carId = readCarIdFromQuery();
    const car = cars.find((item) => item.id === carId) || cars[0];

    if (!car) {
        return (
            <section className="card">
                <h2>{texts.carDetail.notFoundTitle}</h2>
                <p>{texts.carDetail.notFoundText}</p>
            </section>
        );
    }

    return (
        <section className="card detail-card">
            <img src={car.image} alt={car.name} className="detail-image" />
            <div>
                <h2>{car.name}</h2>
                <p className="car-meta">
                    {car.year} • {car.mileage} • {car.fuel} • {car.transmission}
                </p>
                <p className="car-meta">
                    {car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.drive}
                </p>
                <p>{car.description}</p>
                <p><strong>{texts.common.price}:</strong> {formatPrice(car.priceCzk, language)}</p>
                <p className={car.available ? "status available" : "status unavailable"}>
                    {car.available ? texts.common.statusAvailable : texts.common.statusUnavailable}
                </p>
                <h3>{texts.carDetail.legalTitle}</h3>
                <p>{car.legal}</p>
                <h3>{texts.carDetail.equipmentTitle}</h3>
                <p>{car.equipment}</p>
            </div>
        </section>
    );
}

function CmsPage({ cars, setCars, language, texts }) {
    const [isLogged, setIsLogged] = useState(localStorage.getItem(CMS_AUTH_KEY) === "1");
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        brand: "",
        year: "",
        priceCzk: "",
        mileage: "",
        horsepower: "",
        doors: "",
        drive: "",
        fuel: "",
        transmission: "",
        image: "",
        description: "",
        legal: "",
        equipment: "",
        available: true
    });

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

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const addCar = (event) => {
        event.preventDefault();
        const newCar = {
            id: `zmr-${Date.now()}`,
            name: form.name,
            brand: form.brand,
            year: form.year,
            priceCzk: Math.round(parseNumber(form.priceCzk) || 0),
            mileage: form.mileage,
            horsepower: Math.round(parseNumber(form.horsepower) || 0),
            doors: Math.round(parseNumber(form.doors) || 0),
            drive: form.drive,
            fuel: form.fuel,
            transmission: form.transmission,
            image: form.image || "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
            description: form.description,
            legal: form.legal,
            equipment: form.equipment,
            available: form.available
        };

        const updated = [newCar, ...cars];
        setCars(updated);
        saveCars(updated);

        setForm({
            name: "",
            brand: "",
            year: "",
            priceCzk: "",
            mileage: "",
            horsepower: "",
            doors: "",
            drive: "",
            fuel: "",
            transmission: "",
            image: "",
            description: "",
            legal: "",
            equipment: "",
            available: true
        });
    };

    const toggleAvailability = (id) => {
        const updated = cars.map((car) => car.id === id ? { ...car, available: !car.available } : car);
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
                    <label>{texts.cms.fields.name}<input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.brand}<input type="text" value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.year}<input type="text" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.priceCzk}<input type="number" min="0" value={form.priceCzk} onChange={(e) => setForm((prev) => ({ ...prev, priceCzk: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.mileage}<input type="text" value={form.mileage} onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.horsepower}<input type="number" min="0" value={form.horsepower} onChange={(e) => setForm((prev) => ({ ...prev, horsepower: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.doors}<input type="number" min="2" max="6" value={form.doors} onChange={(e) => setForm((prev) => ({ ...prev, doors: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.drive}<input type="text" value={form.drive} onChange={(e) => setForm((prev) => ({ ...prev, drive: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.fuel}<input type="text" value={form.fuel} onChange={(e) => setForm((prev) => ({ ...prev, fuel: e.target.value }))} required /></label>
                    <label>{texts.cms.fields.transmission}<input type="text" value={form.transmission} onChange={(e) => setForm((prev) => ({ ...prev, transmission: e.target.value }))} required /></label>
                    <label className="full-width">{texts.cms.fields.image}<input type="file" accept="image/*" onChange={handleImageUpload} /></label>
                    <label className="full-width">{texts.cms.fields.description}<textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required /></label>
                    <label className="full-width">{texts.cms.fields.legal}<textarea value={form.legal} onChange={(e) => setForm((prev) => ({ ...prev, legal: e.target.value }))} required /></label>
                    <label className="full-width">{texts.cms.fields.equipment}<textarea value={form.equipment} onChange={(e) => setForm((prev) => ({ ...prev, equipment: e.target.value }))} required /></label>
                    <label className="checkbox-row full-width">
                        <input
                            type="checkbox"
                            checked={form.available}
                            onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                        />
                        {texts.cms.fields.available}
                    </label>
                    <button type="submit" className="button-link">{texts.cms.addButton}</button>
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
                                <p>{car.brand} • {car.horsepower} {texts.common.horsepowerUnit} • {car.doors} {texts.common.doorsUnit} • {car.drive}</p>
                                <p className={car.available ? "status available" : "status unavailable"}>
                                    {car.available ? texts.common.statusAvailable : texts.common.statusUnavailable}
                                </p>
                            </div>
                            <div className="cms-actions">
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
                    content: <CarDetailPage cars={cars} language={language} texts={texts} />
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