const services = [
    {
        title: "Kontrola stavu vozidiel",
        text: "Dôkladná vizuálna aj technická kontrola vozidla pred kúpou."
    },
    {
        title: "Kontrola po celej ČR a susedných štátoch",
        text: "Výjazd za vozidlom po celej ČR a v susedných štátoch vrátane prípadného dovozu."
    },
    {
        title: "Dovoz vozidiel na objednávku",
        text: "Individuálny dovoz vozidiel z USA a Japonska podľa požiadaviek klienta."
    },
    {
        title: "Základný servis a STK",
        text: "Príprava vozidla, základný servis a zabezpečenie STK pred odovzdaním."
    },
    {
        title: "Vlastná ponuka vozidiel",
        text: "Postupne budeme zverejňovať aj našu vlastnú ponuku overených vozidiel."
    }
];

const pageContent = {
    home: {
        title: "ZMR Automovité",
        subtitle: "Profesionálna kontrola a dovoz vozidiel pre bezpečný nákup bez rizika.",
        body: (
            <section className="card">
                <h2>Vitajte</h2>
                <p>
                    Pomáhame klientom vybrať správne vozidlo, preveriť jeho technický stav
                    a zabezpečiť celý proces od kontroly až po dovoz a prípravu na premávku.
                </p>
            </section>
        )
    },
    about: {
        title: "O nás",
        subtitle: "Skúsenosti, transparentnosť a dôraz na technický stav vozidla.",
        body: (
            <section className="card">
                <h2>Kto sme</h2>
                <p>
                    Špecializujeme sa na preverenie vozidiel pred kúpou a asistenciu pri dovoze.
                    Každé auto posudzujeme individuálne, aby ste mali istotu pri rozhodovaní.
                </p>
            </section>
        )
    },
    services: {
        title: "Služby",
        subtitle: "Kompletné služby od kontroly až po dovoz a prípravu vozidla.",
        body: (
            <section className="card">
                <h2>Naše služby</h2>
                <div className="grid">
                    {services.map((service) => (
                        <article key={service.title} className="service-item">
                            <h3>{service.title}</h3>
                            <p>{service.text}</p>
                        </article>
                    ))}
                </div>
            </section>
        )
    },
    contact: {
        title: "Kontakt",
        subtitle: "Ozvite sa nám a dohodneme vhodný postup pre vaše vozidlo.",
        body: (
            <section className="card">
                <h2>Kontaktujte nás</h2>
                <p>Telefón: <a href="tel:+420000000000">+420 000 000 000</a></p>
                <p>E-mail: <a href="mailto:info@zmrautomovite.cz">info@zmrautomovite.cz</a></p>
            </section>
        )
    }
};

function Navigation({ activePage }) {
    const items = [
        { key: "home", label: "Domov", href: "main.html" },
        { key: "about", label: "O nás", href: "o-nas.html" },
        { key: "services", label: "Služby", href: "sluzby.html" },
        { key: "contact", label: "Kontakt", href: "kontakt.html" }
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

function App() {
    const rootElement = document.getElementById("root");
    const page = rootElement?.dataset?.page || "home";
    const content = pageContent[page] || pageContent.home;

    return (
        <>
            <header className="hero">
                <div className="logo-wrap">
                    <img src="sources/ZMRAutomovite-logo.png" alt="ZMR Automovité logo" className="logo" />
                </div>
                <Navigation activePage={page} />
                <h1>{content.title}</h1>
                <p>{content.subtitle}</p>
            </header>

            <main className="container">{content.body}</main>
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);