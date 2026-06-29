# Portfolio Studio

Standalone Sanity Studio (content editor) for the Portfolio site. It is **not**
part of the Next.js app build — it's deployed separately to Sanity's hosting.

- **Project:** `iwiuwy59` · **Dataset:** `production`
- **Live editor:** https://olamide-portfolio.sanity.studio

## Develop / deploy

```bash
cd studio
npm install
npm run dev      # local studio at http://localhost:3333
npm run deploy   # publishes to olamide-portfolio.sanity.studio
```

`sanity deploy` requires being logged in (`npx sanity login --provider github`).

The Next.js app (repo root) only **reads** from this project via the Sanity
client in `sanity/client.ts`; schema changes here take effect after `deploy`.
