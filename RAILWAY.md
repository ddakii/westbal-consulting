# Deploy: Railway (API + PostgreSQL) + Netlify (frontend)

## Architecture

| Layer | Platform | Role |
|-------|----------|------|
| Frontend | **Netlify** | Next.js UI (no `DATABASE_URL`) |
| Backend | **Railway** | Next.js API + Prisma |
| Database | **Railway PostgreSQL** | All data |

Set on **Netlify**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `CORS_ALLOWED_ORIGINS`  
Set on **Railway**: `DATABASE_URL`, `SESSION_SECRET`, `OPENAI_API_KEY`, `CORS_ALLOWED_ORIGINS`, `NEXT_PUBLIC_SITE_URL`

Admin panel: use Railway URL (`https://….railway.app/admin`) when frontend is on Netlify, or enable cross-origin cookies via `CORS_ALLOWED_ORIGINS`.

---

## 1. Railway PostgreSQL

1. [railway.app](https://railway.app) → New Project → **PostgreSQL**
2. Copy **DATABASE_URL** from Variables (Postgres service)

## 2. Railway Web Service

1. **New** → **GitHub Repo** (same repo)
2. Variables:

```
DATABASE_URL=postgresql://...
SESSION_SECRET=...
OPENAI_API_KEY=...          # optional
NEXT_PUBLIC_SITE_URL=https://YOUR.netlify.app
CORS_ALLOWED_ORIGINS=https://YOUR.netlify.app
UPLOAD_STORE_FILES=false
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

3. Deploy uses `railway.json`:
   - **Build:** `npm run build:railway` (`prisma generate` + `next build`)
   - **Start:** `npm run start:railway` (`prisma migrate deploy` + `next start`)
4. Link PostgreSQL to the web service so `DATABASE_URL` is set at **runtime** (required for migrate on start).
5. Generate domain: Settings → Networking → Public URL

## 3. Seed database (once)

From your PC with Railway `DATABASE_URL`:

```powershell
cd "C:\Users\Lorent\Desktop\Westbal Consulting"
$env:DATABASE_URL="postgresql://..."
npm run db:migrate
npm run db:seed
```

## 4. Netlify frontend

1. Import repo → build: `npm run build:netlify`
2. Variables (**no DATABASE_URL**):

```
NEXT_PUBLIC_API_URL=https://YOUR.up.railway.app
NEXT_PUBLIC_SITE_URL=https://YOUR.netlify.app
CORS_ALLOWED_ORIGINS=https://YOUR.netlify.app
```

3. Deploy

## 5. Verify

- Netlify: homepage loads (data from Railway `/api/public/site-data`)
- Chat + contact → Railway API
- Railway `/admin` → login, CRM, seed content

## Commands reference

```bash
npm run db:migrate      # production migrations (Railway)
npm run db:migrate:dev  # local dev new migration
npm run db:seed         # seed PostgreSQL
npm run build:railway   # Railway build (no migrate)
npm run start:railway   # migrate + start (production)
npm start               # local production server only
```

## All-in-one on Railway (optional)

Deploy only on Railway with `DATABASE_URL` set and **no** `NEXT_PUBLIC_API_URL` — same origin, no split.
