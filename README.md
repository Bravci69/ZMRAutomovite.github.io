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
