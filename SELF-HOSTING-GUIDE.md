# Taking your CMS public — Oracle Cloud + Coolify + Strapi (free)

A beginner-friendly guide to move your Strapi CMS off your Mac and onto a free,
always-on server, so your live portfolio (on Vercel) can read its content.

Written for a hobbyist, not an engineer. Every step explains *what* and *why*.

---

## The big picture (read this first)

Right now your setup is:

```
Your Mac:  Strapi (kitchen) + SQLite (fridge)  ──serves──>  localhost:3210 (your site, local only)
Vercel:    your live site  ──falls back to──>  4 hardcoded musings (because it can't reach your Mac)
```

The goal is:

```
Free server:  Strapi + Postgres (always on, public web address)
Vercel:       your live site  ──reads from──>  the server's Strapi  (real CMS content, live)
You:          edit content in Strapi from anywhere, the live site updates
```

To get there you need **three free things**:

1. **A server** that's always on and reachable from the internet → **Oracle Cloud "Always Free"** (a real, genuinely-free virtual computer in the cloud).
2. **A platform** to manage apps on that server without being a sysadmin → **Coolify** (free, open-source; a friendly dashboard like Vercel/Heroku, but yours).
3. **A database** for Strapi → **PostgreSQL** (Coolify installs this for you in one click; we move off SQLite because a public server should use a "real" database).

### Honest expectations (so you're not surprised)
- This is **more involved than the local setup.** Budget an unhurried afternoon, not 10 minutes.
- "Free" is real here, but Oracle's free tier needs a **credit card to sign up** (for identity; you won't be charged on Always-Free resources). It can rarely reclaim idle machines — fine for a hobby CMS.
- You'll do a little bit of "server" stuff (copy-paste one install command, click around a dashboard). I'll keep it copy-paste simple.
- **You can stop after any phase.** Even just getting Coolify running is a win.

---

## Phase 1 — Get a free server (Oracle Cloud Always Free)

**What you're doing:** renting a small computer in a data centre, for free, forever.

1. Go to **https://www.oracle.com/cloud/free/** → **Start for free**.
2. Sign up: email, choose a home region **close to you** (e.g. for Nigeria, pick a nearby region like *UK South (London)* or *Germany Central (Frankfurt)* for low latency).
3. Add a credit/debit card. **Why:** identity verification only. Always-Free resources don't charge. (You can set the account to never upgrade to paid.)
4. Once your account is ready, in the Oracle dashboard, create a **Compute Instance** (a virtual machine):
   - Click **Create instance**.
   - **Image:** choose **Ubuntu** (a beginner-friendly Linux; pick the latest LTS, e.g. Ubuntu 22.04).
   - **Shape:** pick an **Always-Free-eligible** shape. The best free one is **Ampere A1 (ARM)** — give it ~**2 CPUs and 6–8 GB RAM** (Always Free allows up to 4 CPUs / 24 GB across ARM; Strapi likes RAM). If ARM isn't available, the small **VM.Standard.E2.1.Micro** (AMD) also works but is tighter on RAM.
   - **SSH keys:** Oracle will offer to generate a key pair → **Save the private key** it gives you (a file). This is how you'll log into the server. Keep it safe; treat it like a password.
   - Create. Wait ~1–2 minutes. Note the server's **Public IP address** (e.g. `132.x.x.x`).

5. **Open the firewall ports** (so the world can reach your apps). In Oracle, this is the instance's **VCN → Security List → Ingress Rules**. Add rules to allow:
   - port **80** (web / http), port **443** (secure web / https), port **8000** (Coolify's dashboard), and **22** (SSH login).
   - Source `0.0.0.0/0` (means "from anywhere").
   > Why: cloud servers block everything by default. You're saying "let web traffic in."

> 🟢 **Checkpoint:** you have a server with a public IP, a saved SSH key, and ports opened.

---

## Phase 2 — Log into the server and install Coolify

**What you're doing:** connecting to your server and installing the dashboard that manages everything.

1. **Log in via SSH** (a way to control the server from your Mac's Terminal). On your Mac:
   ```
   ssh -i /path/to/your-private-key ubuntu@YOUR_SERVER_IP
   ```
   (Replace the key path and IP. `ubuntu` is the default username on Ubuntu images.)
   - First time it asks "are you sure?" → type `yes`.
   - You're now "inside" the server — the terminal prompt changes.

2. **Install Coolify** with its official one-line installer (paste this on the server):
   ```
   curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash
   ```
   - This downloads and sets up Coolify + Docker (the engine apps run in). Takes a few minutes.
   > Why one command: Coolify's installer does all the sysadmin work for you.

3. When it finishes, open Coolify's dashboard in your **browser**:
   ```
   http://YOUR_SERVER_IP:8000
   ```
   - Create your **Coolify admin account** (this is *yours*; pick a strong password — **you** type it, like with Strapi).

> 🟢 **Checkpoint:** Coolify dashboard loads in your browser, you're logged in.

---

## Phase 3 — Deploy Postgres + Strapi on Coolify

**What you're doing:** using Coolify's dashboard to run your database and Strapi.

1. In Coolify, create a **Project** (e.g. "portfolio-cms").
2. **Add a PostgreSQL database:** New Resource → **Database → PostgreSQL** → deploy.
   - Coolify gives you connection details (host, port, database name, username, password). **Copy these** — Strapi needs them.
   > Why Postgres not SQLite: a public, always-on app should use a server database. Coolify makes it one click.

3. **Deploy Strapi.** Two common ways:
   - **(a) From your Strapi GitHub repo** (cleanest): push your local `portfolio-cms` Strapi folder to a GitHub repo, then in Coolify: New Resource → **Application → from GitHub** → pick the repo. Set it as a Node app.
   - **(b) Docker image:** Strapi can run from a Docker image; Coolify supports this too.
   - Either way, in the app's **Environment Variables** in Coolify, set Strapi to use the Postgres from step 2:
     ```
     DATABASE_CLIENT=postgres
     DATABASE_HOST=<from step 2>
     DATABASE_PORT=<from step 2>
     DATABASE_NAME=<from step 2>
     DATABASE_USERNAME=<from step 2>
     DATABASE_PASSWORD=<from step 2>
     APP_KEYS=<generate 4 random strings>
     ADMIN_JWT_SECRET=<random string>
     API_TOKEN_SALT=<random string>
     JWT_SECRET=<random string>
     ```
     (Strapi needs those secret keys; Coolify can help generate, or use any long random text.)
   - Deploy. Coolify builds and starts Strapi, gives it a public URL (e.g. `https://cms.yourdomain.com` if you add a domain, or a generated address).

4. **Re-create your content** (the part to plan for): your musings currently live in your Mac's SQLite. On the new server you start fresh, so you either:
   - Re-enter the Musing type + entries in the new Strapi admin (quick — you've done it once), **or**
   - Migrate the data (more advanced; export/import). For 5 musings, re-entering is easiest.
   - Don't forget: rebuild the **Musing content type**, set **Public role → find/findOne**, and **Publish** entries (same steps as before).

> 🟢 **Checkpoint:** visiting `https://your-strapi-url/api/musings` returns your musings as JSON, publicly.

---

## Phase 4 — Point your live Vercel site at the public Strapi

**What you're doing:** telling your deployed portfolio where the real CMS lives.

1. In **Vercel** → your portfolio project → **Settings → Environment Variables**, add:
   ```
   NEXT_PUBLIC_STRAPI_URL = https://your-public-strapi-url
   ```
   (no trailing slash)
2. **Redeploy** the site (Vercel → Deployments → Redeploy, or push any commit).
3. Visit your live `/v2/musings` → it now shows the **real CMS content** from your server, not the fallback.

> 🟢 **Done:** edit a musing in your server's Strapi → it appears on your live site. Fully public, fully free.

---

## What to keep in mind
- **Security:** keep your SSH key safe, use strong passwords, keep the server updated (`sudo apt update && sudo apt upgrade` occasionally). Coolify can auto-update.
- **Backups:** Coolify can back up the Postgres database — turn this on so you don't lose content.
- **Cost:** stays free on Always-Free shapes. Watch you don't accidentally create paid resources.
- **The fallback still protects you:** if the server ever goes down, your site shows the hardcoded musings instead of breaking (that's `lib/musings.ts`).

## If you get stuck
Tell me which phase + what you see, and I'll walk you through it like we did with Strapi.
The order of difficulty: Phase 1 (signup/firewall) and Phase 3 (env vars) trip people up most;
Phases 2 and 4 are mostly copy-paste.
