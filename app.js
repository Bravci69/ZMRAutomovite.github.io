const { useMemo, useState } = React;

const CARS_STORAGE_KEY = "zmrCars";
const CMS_AUTH_KEY = "zmrCmsAuth";

const services = [
    {
        title: "Kontrola stavu vozidiel",
        text: "Každé vozidlo preverujeme vizuálne aj technicky, vrátane merania laku, diagnostiky a overenia servisnej histórie, aby ste mali jasný obraz o reálnom stave auta."
    },
    {
        title: "Kontrola technického stavu po celej ČR a v susedných štátoch",
        text: "Za vozidlom vieme vycestovať po celej Českej republike aj do susedných krajín. V prípade potreby zabezpečíme aj následný dovoz vozidla."
    },
    {
        title: "Dovoz vozidiel na objednávku z USA a Japonska",
        text: "Zabezpečíme výber, preverenie, prepravu a administratívny proces pri dovoze vozidiel z USA a Japonska podľa vášho zadania."
    },
    {
        title: "Základný servis a príprava STK",
        text: "Pred odovzdaním vozidla vieme vykonať základný servis, kontrolu prevádzkových kvapalín a pripraviť vozidlo na absolvovanie STK."
    },
    {
        title: "Vlastná ponuka vozidiel",
        text: "Postupne dopĺňame vlastnú ponuku overených vozidiel s transparentným stavom, výbavou a základnými legislatívnymi informáciami."
    }
];

const defaultCars = [
    {
        id: "zmr-001",
        name: "BMW 330i Touring M Sport",
        year: "2020",
        price: "729 000 Kč",
        mileage: "89 400 km",
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
        year: "2020",
        price: "729 000 Kč",
        mileage: "89 400 km",
        fuel: "Benzín",
        transmission: "Automat",
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
        description: "Ukážkový záznam vozidla na test podstránok. Použitý rovnaký model, aby bolo jasné, ako bude fungovať detail každého auta.",
        legal: "Legislatívne informácie: Vozidlo je možné prihlásiť v ČR/SR po štandardnom procese registrácie. Emisná norma EURO 6. Pri dovoze zabezpečíme kompletné podklady pre evidenciu a STK.",
        equipment: "Výbava: LED svetlomety, navigácia, parkovacia kamera, vyhrievané sedadlá, tempomat, bezkľúčové štartovanie, multifunkčný volant.",
        available: true
    }
];

function getCars() {
    const raw = localStorage.getItem(CARS_STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
        return defaultCars;
    }

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
        return defaultCars;
    } catch {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(defaultCars));
        return defaultCars;
    }
}

function saveCars(cars) {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
}

function readCarIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function Navigation({ activePage }) {
    const items = [
        { key: "home", label: "Domov", href: "main.html" },
        { key: "about", label: "O nás", href: "o-nas.html" },
        { key: "services", label: "Služby", href: "sluzby.html" },
        { key: "cars", label: "Vozidlá", href: "auta.html" },
        { key: "contact", label: "Kontakt", href: "kontakt.html" },
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

function PageShell({ page, title, subtitle, children }) {
    return (
        <>
            <header className="top-header">
                <div className="top-inner">
                    <a className="brand" href="main.html">
                        <img src="sources/ZMRAutomovite-logo.png" alt="ZMR Automovité logo" className="logo" />
                    </a>
                    <Navigation activePage={page} />
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

function HomePage() {
    return (
        <>
            <section className="card">
                <h2>Prečo si vybrať ZMR Automovité</h2>
                <p>
                    Naším cieľom je, aby klient presne vedel, čo kupuje. Neponúkame len rýchly
                    pohľad na vozidlo, ale detailný proces preverenia technického stavu, histórie,
                    výbavy a legislatívnej pripravenosti vozidla pre bezproblémovú registráciu.
                </p>
                <p>
                    Spoluprácu vedieme transparentne od prvého kontaktu: dohodneme rozsah kontroly,
                    pripravíme výstupnú správu, vysvetlíme riziká a navrhneme ďalší postup vrátane
                    dovozu, servisu a prípravy STK. Výsledkom je bezpečnejšie rozhodnutie a menej
                    nečakaných nákladov po kúpe vozidla.
                </p>
            </section>

            <section className="card split-card">
                <div>
                    <h2>Komplexný prístup</h2>
                    <p>
                        Pokrývame celý proces: od výberu vhodného modelu, cez obhliadku a technickú
                        kontrolu, až po logistiku dovozu a základný servis. Všetko na jednom mieste,
                        bez potreby riešiť viac dodávateľov.
                    </p>
                </div>
                <div>
                    <h2>Jasné výstupy</h2>
                    <p>
                        Každé odporúčanie je podložené reálnym stavom vozidla. Klient dostáva jasné
                        informácie o stave, legislatíve, výbave a prípadných investíciách, ktoré môžu
                        byť potrebné po kúpe.
                    </p>
                </div>
            </section>
        </>
    );
}

function AboutPage() {
    return (
        <>
            <section className="card">
                <h2>O našej spoločnosti</h2>
                <p>
                    ZMR Automovité je tím zameraný na odbornú kontrolu vozidiel a podporu pri kúpe
                    alebo dovoze auta zo zahraničia. Dlhodobo sa sústreďujeme na praktické riešenia,
                    ktoré klientovi šetria čas, znižujú riziko a pomáhajú vyhnúť sa skrytým problémom.
                </p>
                <p>
                    Dôraz kladieme na transparentnú komunikáciu, technickú presnosť a proces, ktorý
                    je zrozumiteľný aj pre klientov bez hlbších skúseností s automotive trhom.
                    Pri každom vozidle sledujeme nielen aktuálny stav, ale aj budúce servisné náklady
                    a legislatívne náležitosti potrebné pre registráciu.
                </p>
            </section>

            <section className="card">
                <h2>Naša lokalita – Praha</h2>
                <p>
                    Základňu máme v Prahe a služby poskytujeme klientom z celej ČR aj okolitých
                    štátov. Nižšie je orientačná mapa lokality Praha cez Google Maps.
                </p>
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

function ServicesPage() {
    return (
        <>
            <section className="card">
                <h2>Rozsah služieb</h2>
                <p>
                    Služby sú navrhnuté tak, aby pokryli celý životný cyklus nákupu vozidla: výber,
                    preverenie, dovoz, servisnú prípravu aj administratívne kroky. Každý klient môže
                    využiť kompletný balík alebo len konkrétnu časť procesu podľa potreby.
                </p>
            </section>

            <section className="grid wide-grid">
                {services.map((service) => (
                    <article key={service.title} className="service-item">
                        <h3>{service.title}</h3>
                        <p>{service.text}</p>
                    </article>
                ))}
            </section>
        </>
    );
}

function ContactPage() {
    return (
        <>
            <section className="card">
                <h2>Kontakt</h2>
                <p>
                    Ak riešite kúpu, kontrolu alebo dovoz vozidla, radi navrhneme vhodný postup.
                    Pri prvom kontakte odporúčame uviesť model vozidla, lokalitu a časový plán.
                </p>
                <p>
                    Telefón: <a href="tel:+420000000000">+420 000 000 000</a>
                    <br />
                    E-mail: <a href="mailto:info@zmrautomovite.cz">info@zmrautomovite.cz</a>
                </p>
            </section>

            <section className="card">
                <h2>Priebeh spolupráce</h2>
                <p>
                    Po prijatí dopytu pripravíme stručný plán s odhadom termínu a rozsahu služieb.
                    Následne realizujeme kontrolu alebo dovoz, vyhodnotíme stav vozidla a pripravíme
                    odporúčania pre ďalší postup vrátane servisných a legislatívnych krokov.
                </p>
            </section>
        </>
    );
}

function CarsPage({ cars }) {
    return (
        <section className="grid wide-grid">
            {cars.map((car) => (
                <article key={car.id} className="car-card">
                    <img src={car.image} alt={car.name} className="car-image" />
                    <div className="car-content">
                        <h2>{car.name}</h2>
                        <p className="car-meta">
                            {car.year} • {car.mileage} • {car.fuel} • {car.transmission}
                        </p>
                        <p>{car.description}</p>
                        <p className={car.available ? "status available" : "status unavailable"}>
                            {car.available ? "Dostupné" : "Momentálne nedostupné"}
                        </p>
                        <div className="car-footer">
                            <strong>{car.price}</strong>
                            <a href={`vozidlo.html?id=${encodeURIComponent(car.id)}`} className="button-link">Detail vozidla</a>
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}

function CarDetailPage({ cars }) {
    const carId = readCarIdFromQuery();
    const car = cars.find((item) => item.id === carId) || cars[0];

    if (!car) {
        return (
            <section className="card">
                <h2>Vozidlo sa nenašlo</h2>
                <p>Momentálne nie je dostupné žiadne vozidlo. Skúste neskôr alebo kontaktujte nás.</p>
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
                <p>{car.description}</p>
                <p><strong>Cena:</strong> {car.price}</p>
                <p className={car.available ? "status available" : "status unavailable"}>
                    {car.available ? "Dostupné" : "Momentálne nedostupné"}
                </p>
                <h3>Legislatívne informácie</h3>
                <p>{car.legal}</p>
                <h3>Výbava</h3>
                <p>{car.equipment}</p>
            </div>
        </section>
    );
}

function CmsPage({ cars, setCars }) {
    const [isLogged, setIsLogged] = useState(localStorage.getItem(CMS_AUTH_KEY) === "1");
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        year: "",
        price: "",
        mileage: "",
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
        setError("Nesprávne prihlasovacie údaje.");
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
            year: form.year,
            price: form.price,
            mileage: form.mileage,
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
            year: "",
            price: "",
            mileage: "",
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
                <h2>CMS prihlásenie</h2>
                <p>Prístup pre zamestnancov. Testovacie údaje: admin / admin.</p>
                <form className="form-grid" onSubmit={handleLogin}>
                    <label>
                        Prihlasovacie meno
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        Heslo
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                            required
                        />
                    </label>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="button-link">Prihlásiť sa</button>
                </form>
            </section>
        );
    }

    return (
        <>
            <section className="card cms-card">
                <div className="cms-head">
                    <h2>Správa vozidiel</h2>
                    <button className="button-link button-secondary" onClick={handleLogout}>Odhlásiť sa</button>
                </div>
                <p>
                    Tu môžete pridávať nové autá, nahrávať fotku, vyplniť základný popis,
                    legislatívne informácie a výbavu. Vozidlo je možné odstrániť alebo
                    prepnúť do stavu momentálne nedostupné.
                </p>
                <form className="form-grid" onSubmit={addCar}>
                    <label>Model vozidla<input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required /></label>
                    <label>Rok výroby<input type="text" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))} required /></label>
                    <label>Cena<input type="text" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required /></label>
                    <label>Nájazd<input type="text" value={form.mileage} onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))} required /></label>
                    <label>Palivo<input type="text" value={form.fuel} onChange={(e) => setForm((prev) => ({ ...prev, fuel: e.target.value }))} required /></label>
                    <label>Prevodovka<input type="text" value={form.transmission} onChange={(e) => setForm((prev) => ({ ...prev, transmission: e.target.value }))} required /></label>
                    <label className="full-width">Fotka vozidla<input type="file" accept="image/*" onChange={handleImageUpload} /></label>
                    <label className="full-width">Základný popis<textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required /></label>
                    <label className="full-width">Legislatívne informácie<textarea value={form.legal} onChange={(e) => setForm((prev) => ({ ...prev, legal: e.target.value }))} required /></label>
                    <label className="full-width">Výbava<textarea value={form.equipment} onChange={(e) => setForm((prev) => ({ ...prev, equipment: e.target.value }))} required /></label>
                    <label className="checkbox-row full-width">
                        <input
                            type="checkbox"
                            checked={form.available}
                            onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                        />
                        Vozidlo je dostupné
                    </label>
                    <button type="submit" className="button-link">Pridať vozidlo</button>
                </form>
            </section>

            <section className="card cms-card">
                <h2>Aktuálne vozidlá</h2>
                <div className="cms-list">
                    {cars.map((car) => (
                        <article key={car.id} className="cms-item">
                            <div>
                                <h3>{car.name}</h3>
                                <p>{car.year} • {car.price} • {car.mileage}</p>
                                <p className={car.available ? "status available" : "status unavailable"}>
                                    {car.available ? "Dostupné" : "Momentálne nedostupné"}
                                </p>
                            </div>
                            <div className="cms-actions">
                                <button className="button-link button-secondary" onClick={() => toggleAvailability(car.id)}>
                                    Zmeniť dostupnosť
                                </button>
                                <button className="button-link danger" onClick={() => removeCar(car.id)}>
                                    Odstrániť
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

    const pageConfig = useMemo(() => {
        switch (page) {
            case "about":
                return {
                    title: "O nás",
                    subtitle: "Skúsenosti, transparentnosť a dôraz na bezpečný nákup vozidla.",
                    content: <AboutPage />
                };
            case "services":
                return {
                    title: "Služby",
                    subtitle: "Komplexné riešenia kontroly, dovozu a prípravy vozidla na prevádzku.",
                    content: <ServicesPage />
                };
            case "cars":
                return {
                    title: "Ponuka vozidiel",
                    subtitle: "Prehľad aktuálne dostupných vozidiel s detailným popisom stavu, výbavy a legislatívnych informácií.",
                    content: <CarsPage cars={cars} />
                };
            case "car-detail":
                return {
                    title: "Detail vozidla",
                    subtitle: "Kompletné informácie o vybranom vozidle vrátane legislatívy a výbavy.",
                    content: <CarDetailPage cars={cars} />
                };
            case "contact":
                return {
                    title: "Kontakt",
                    subtitle: "Sme pripravení pomôcť s kontrolou, dovozom aj výberom vhodného vozidla.",
                    content: <ContactPage />
                };
            case "cms":
                return {
                    title: "CMS vozidiel",
                    subtitle: "Interná zóna pre správu ponuky vozidiel.",
                    content: <CmsPage cars={cars} setCars={setCars} />
                };
            case "home":
            default:
                return {
                    title: "ZMR Automovité",
                    subtitle: "Reprezentatívne služby pre kontrolu a dovoz vozidiel bez kompromisov.",
                    content: <HomePage />
                };
        }
    }, [page, cars]);

    return (
        <PageShell page={page} title={pageConfig.title} subtitle={pageConfig.subtitle}>
            {pageConfig.content}
        </PageShell>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);