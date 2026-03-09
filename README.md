# ZMRAutomovite.github.io
Site for ZMR Automovite

## Live deploy (GitHub Pages) + FormSubmit

- FormSubmit endpoint is configured to `info@zmrautomotive.cz` via `window.ZMR_RESERVATION_PROXY_URL` in all HTML entry pages.
- GitHub Pages auto-deploy is configured in `.github/workflows/deploy-pages.yml` and runs on every push to `main`.

### One-time GitHub setup

1. Open repository `Settings` -> `Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` and wait for workflow `Deploy Static Site to GitHub Pages` to finish.

### One-time FormSubmit activation

1. Submit the contact form once from live site.
2. Open confirmation email sent by FormSubmit to `info@zmrautomotive.cz`.
3. Confirm activation link (without this, FormSubmit will not deliver messages).

## Secure Google Translate setup (recommended)

The frontend is static, so do not put Google API keys into `app.js`.
Use a server-side proxy (Cloudflare Worker) and keep the key in Worker secrets.

### 1) Deploy proxy Worker

1. Install Wrangler:
	- `npm install -g wrangler`
2. Login to Cloudflare:
	- `wrangler login`
3. From project root create Worker project (or reuse an existing one) and use file:
	- `sources/translate-worker.js`
4. Set secret key securely:
	- `wrangler secret put GOOGLE_TRANSLATE_API_KEY`
5. Deploy:
	# ZMRAutomovite.github.io
	Site for ZMR Automovite

	## Secure Google Translate setup (recommended)

	The frontend is static, so do not put Google API keys into `app.js`.
	Use a server-side proxy (Cloudflare Worker) and keep the key in Worker secrets.

	### 1) Deploy proxy Worker

	1. Install Wrangler:
		- `npm install -g wrangler`
	2. Login to Cloudflare:
		- `wrangler login`
	3. From project root create Worker project (or reuse an existing one) and use file:
		- `sources/translate-worker.js`
	4. Set secret key securely:
		- `wrangler secret put GOOGLE_TRANSLATE_API_KEY`
	5. Deploy:
		- `wrangler deploy`

	After deploy you get URL like:
	- `https://zmr-translate.<subdomain>.workers.dev/api/translate`

	### 2) Configure frontend

	Set proxy URL globally before loading `app.js` (for example in page HTML):

	```html
	<script>
		window.ZMR_TRANSLATE_PROXY_URL = "https://zmr-translate.<subdomain>.workers.dev/api/translate";
	</script>
	```

	### 3) How it works

	- Local dictionary translations are used first.
	- Unknown technical values are translated via proxy endpoint.
	- Translations are cached in browser localStorage (`zmrTechnicalTranslations`) to reduce API calls and cost.

	## Automatic reservation emails (server-side)

	To send reservation requests automatically (without opening the user email app), reuse the same Worker file:

	- `sources/translate-worker.js`

	### 1) Configure Worker secrets

	- `wrangler secret put RESEND_API_KEY`

	Set Worker variables (Wrangler config or Cloudflare dashboard):

	- `RESERVATION_FROM_EMAIL` (example: `ZMR <info@zmrautomotive.cz>`)
	- `RESERVATION_TO_EMAIL` (optional fallback inbox)

	### 2) Reservation endpoint

	After deploy, use endpoint:

	- `https://zmr-translate.<subdomain>.workers.dev/api/reservation`

	### 3) Configure frontend

	Set this global variable before loading `app.js`:

	```html
	<script>
		window.ZMR_RESERVATION_PROXY_URL = "https://zmr-translate.<subdomain>.workers.dev/api/reservation";
	</script>
	```

		## Cross-device cars sync (server-side)

		To share newly added cars across devices, use Worker endpoint `/api/cars` with Cloudflare KV.

		### 1) Create KV binding

		Create KV namespace and bind it to Worker as:

		- `CARS_KV`

		### 2) Frontend config (optional)

		If needed, set custom API URL before loading `app.js`:

		```html
		<script>
			window.ZMR_CARS_API_URL = "https://zmr-translate.<subdomain>.workers.dev/api/cars";
		</script>
		```

		## Quick deploy now

		1. Login and create KV namespace:

		- `wrangler login`
		- `wrangler kv namespace create CARS_KV`

		2. Put returned KV namespace `id` into [wrangler.toml](wrangler.toml).

		3. Set required secrets:

		- `wrangler secret put GOOGLE_TRANSLATE_API_KEY`
		- `wrangler secret put RESEND_API_KEY`

		4. Deploy worker:

		- `wrangler deploy`

		5. In your HTML (before `app.js`), set:

		- `window.ZMR_TRANSLATE_PROXY_URL = "https://.../api/translate"`
		- `window.ZMR_RESERVATION_PROXY_URL = "https://.../api/reservation"`
		- `window.ZMR_CARS_API_URL = "https://.../api/cars"`

## Firebase Database pre autá

Projekt je pripravený ukladať a čítať vozidlá priamo z Firebase Realtime Database.

### 1) Nastav Realtime Database

V Firebase Console:

- vytvor Realtime Database,
- skopíruj database URL (napr. `https://your-project-default-rtdb.europe-west1.firebasedatabase.app`).

### 2) Nastav runtime premenné v HTML (pred `app.js`)

Na všetkých stránkach je už pripravený blok s premennými. Doplň svoje hodnoty:

- `window.ZMR_FIREBASE_DB_URL`
- `window.ZMR_FIREBASE_CARS_PATH` (predvolené `zmrCars`)
- `window.ZMR_FIREBASE_AUTH_TOKEN` (voliteľné, môže byť prázdne)

Ak je Firebase dostupný, aplikácia použije Firebase ako primárny sync pre autá.
Ak nie je dostupný, použije existujúci fallback cez `window.ZMR_CARS_API_URL`.

### 3) Bezpečné pravidlá pre scenár „verejné čítanie + CMS zápis“

V repozitári je pripravený súbor:

- `firebase.database.rules.json`

Použité pravidlá:

- čítanie kolekcie `zmrCars` je verejné,
- zápis je povolený iba pre prihláseného používateľa s custom claim `cms: true` alebo `admin: true`,
- validácia kontroluje základné minimum (`id`, `updatedAt`) pre každý záznam vozidla.

### 4) Nasadenie pravidiel do Firebase

1. Nainštaluj Firebase CLI:

- `npm install -g firebase-tools`

2. Prihlás sa:

- `firebase login`

3. Inicializuj Firebase v projekte (ak ešte nemáš `firebase.json`):

- `firebase init database`

4. Nastav v `firebase.json` položku `database.rules` na `firebase.database.rules.json`.

5. Nasaď pravidlá:

- `firebase deploy --only database`

### 5) Dôležité k aplikácii

Aktuálna aplikácia číta/zapisuje cez REST endpoint Firebase a nepoužíva Firebase Auth SDK.
To znamená, že pre produkčné bezpečné zapisovanie odporúčam:

- zapisovať autá cez backend (napr. tvoj Worker `/api/cars`) alebo
- doplniť Firebase Auth (napr. anonymné/prihlásenie) a zapisovať s ID tokenom používateľa, ktorý má claim `cms`.

Kým nie je doplnený Auth tok, nechaj `window.ZMR_FIREBASE_AUTH_TOKEN` prázdne a používaj zápis cez fallback API.

## Firestore (projekt `zmrautomovite`)

Je doplnená aj priama podpora pre Cloud Firestore cez REST API (bez SDK), takže autá sa môžu synchronizovať aj cez Firestore dokument.

### Konfigurácia v HTML (pred `app.js`)

Použi tieto premenné:

- `window.ZMR_FIRESTORE_PROJECT_ID` (pre teba: `zmrautomovite`)
- `window.ZMR_FIRESTORE_API_KEY` (Web API key z Firebase configu)
- `window.ZMR_FIRESTORE_DOCUMENT_PATH` (predvolené: `zmrSync/cars`)
- `window.ZMR_FIRESTORE_ID_TOKEN` (voliteľné; vyplň iba ak budeš mať write pravidlá viazané na prihlásenie)

Pre CMS login nie je potrebné nastavovať `ZMR_FIRESTORE_ID_TOKEN` ručne.
Po prihlásení do CMS cez Firebase email/heslo si aplikácia token získa a obnovuje automaticky.

Synchronizácia v aplikácii ide v poradí:

1. Firestore
2. Realtime Database
3. Worker fallback (`/api/cars`)

### Firestore Security Rules (odporúčané minimum)

V Firestore Rules môžeš použiť model: verejné čítanie, zápis iba pre CMS/Admin používateľov.

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /zmrSync/{document=**} {
			allow read: if true;
			allow write: if request.auth != null
									 && (request.auth.token.cms == true || request.auth.token.admin == true);
		}
	}
}
```

Ak zatiaľ nemáš Firebase Auth vo fronte, nechaj write pravidlá dočasne otvorené iba počas testu a potom ich uzamkni.

### Firebase Auth pre CMS zápis

Ak chceš bezpečný zápis do Firestore bez fallbacku:

1. Vo Firebase Console zapni `Authentication` -> `Email/Password` provider.
2. Vytvor CMS používateľa (email + heslo).
3. Prihlás sa v CMS cez tento email a heslo.

Aplikácia následne:

- získa Firebase ID token,
- uloží refresh token lokálne,
- automaticky obnovuje ID token pre ďalšie zápisy do Firestore.

### Rovno vytvoriť databázu teraz (Firestore)

Áno, vieš to spraviť hneď týmto postupom:

1. Nainštaluj Firebase CLI a prihlás sa:

- `npm install -g firebase-tools`
- `firebase login`

2. V koreňi projektu nastav Firebase projekt:

- `firebase use --add`
- vyber projekt `zmrautomovite`

3. Aktivuj Firestore (ak ešte nie je zapnutý) vo Firebase Console.

4. Nasaď pravidlá pripravené v repozitári:

- `firebase deploy --only firestore`

5. Prihlás sa do CMS (email/heslo z Firebase Auth) a pridaj auto.

Prvý zápis vytvorí dokument automaticky na ceste:

- `zmrSync/cars`

Ak chceš inú cestu dokumentu, zmeň `window.ZMR_FIRESTORE_DOCUMENT_PATH` v HTML konfigurácii.
