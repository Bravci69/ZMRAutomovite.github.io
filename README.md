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

	- `RESERVATION_FROM_EMAIL` (example: `ZMR <onboarding@resend.dev>`)
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
