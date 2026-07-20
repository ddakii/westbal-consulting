# Westbal Consulting

Premium Next.js site with PostgreSQL (Prisma), admin CMS, and AI chatbot.

## Local development

1. Copy `.env.example` → `.env`
2. Set `DATABASE_URL` to Railway PostgreSQL **or** local Postgres
3. Run:

```bash
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

## Deploy

- **Railway + PostgreSQL:** see [RAILWAY.md](./RAILWAY.md)
- **Netlify (frontend) + Railway (API):** see [RAILWAY.md](./RAILWAY.md#4-netlify-frontend)

Legacy Turso/SQLite setup has been removed.
