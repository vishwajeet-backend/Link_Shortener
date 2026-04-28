# Role-Based URL Shortener SaaS

Production-oriented monorepo URL shortener platform with:

- Next.js frontend (`apps/web`)
- Express + TypeScript backend (`apps/api`)
- MongoDB Atlas + Mongoose
- JWT auth + refresh rotation + RBAC (`ADMIN`, `USER`)
- Admin URL moderation + email notifications
- Public redirect engine + click tracking
- Google OAuth support

---

## Monorepo Structure

```text
apps/
  api/   # Express API
  web/   # Next.js App Router frontend
```

---

## Tech Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, Zustand
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT + Refresh Token + Google OAuth + RBAC
- Email: Nodemailer (SMTP)

---

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment files

Create:

- `apps/api/.env` (copy from `apps/api/.env.example`)
- `apps/web/.env.local` (copy from `apps/web/.env.example`)

### 3) Run backend and frontend

```bash
npm run dev:api
npm run dev:web
```

### 4) Health check

```bash
http://localhost:5000/api/v1/health
```

---

## Required Environment Variables

### Backend (`apps/api/.env`)

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `CLIENT_ORIGIN`
- `APP_PUBLIC_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN_DAYS`

### Frontend (`apps/web/.env.local`)

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_URL`

---

## Deploy to Render (Recommended)

Create **two Render services** from the same GitHub repo.

### A) API Service (Web Service)

- Root Directory: `apps/api`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment: Node
- Add all backend env vars listed above

Important production values:

- `NODE_ENV=production`
- `CLIENT_ORIGIN=https://<your-frontend-domain>`
- `APP_PUBLIC_URL=https://<your-frontend-domain-or-short-domain>`
- `GOOGLE_CALLBACK_URL=https://<your-api-domain>/api/v1/auth/google/callback`

### B) Web Service (Web Service)

- Root Directory: `apps/web`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment: Node
- Add frontend env vars:
  - `NEXT_PUBLIC_API_BASE_URL=https://<your-api-domain>/api/v1`
  - `NEXT_PUBLIC_APP_URL=https://<your-frontend-domain>`

---

## GitHub Push Workflow

```bash
git add .
git commit -m "feat: production-ready role-based URL shortener platform"
git push -u origin main
```

If your default branch is not `main`, push your current branch instead.

---

## Security Notes

- Never commit real `.env` files.
- `.gitignore` already excludes:
  - `.env`
  - `.env.*`
  - `node_modules`
- Rotate any secret immediately if exposed accidentally.
- Keep SMTP, JWT, MongoDB, and Google OAuth secrets in Render/GitHub environment settings only.

---

## Useful Commands

```bash
# API checks
npm run typecheck --workspace @link-shortener/api
npm run test --workspace @link-shortener/api

# Web checks
npm run typecheck --workspace @link-shortener/web
```
