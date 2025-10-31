# Hospital Appointment Optimizer

Optimizing doctor availability and appointment allocation using digital tech & AI. Separate UIs for doctors and patients, shared admin dashboard, light/dark themes, MongoDB backend.

## Tech
- Frontend: React + Vite, React Router, Tailwind (dark mode), React Query, framer-motion
- Backend: Node + Express, Zod validation, JWT auth
- DB: MongoDB (Mongoose)

## Quick start (local)
1. Copy `.env.example` to `.env` and set variables
2. Install deps: `pnpm install`
3. Start dev server: `pnpm dev` (http://localhost:8080)
4. Seed DB: `pnpm seed`

### Env vars
- MONGODB_URI=mongodb://...
- JWT_SECRET=your_jwt_secret
- JWT_REFRESH_SECRET=your_refresh_secret
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (optional for email)

## Docker (app + Mongo)
- Build & run: `docker compose up --build`

## Scripts
- `pnpm dev` – Vite + Express
- `pnpm build` – SPA + server builds
- `pnpm start` – run production server
- `pnpm seed` – seed Mongo with Indian names & availability

## API (REST)
See OpenAPI at GET /api/docs or `docs/openapi.json`.

Key endpoints:
- POST /api/auth/register, /api/auth/login, /api/auth/refresh, /api/auth/logout
- GET /api/doctors?specialization=&location=
- POST /api/doctors/:id/availability
- GET /api/doctors/:id/schedule?date=YYYY-MM-DD
- POST /api/appointments (runs optimizer)
- GET /api/appointments?role=doctor|patient&status=
- PATCH /api/appointments/:id
- POST /api/appointments/:id/confirm
- POST /api/optimizer/suggest, /api/optimizer/rebalance

## Optimizer
- Rule-based greedy scorer using urgency, specialization match, proximity, and wait-time.
- ML/LLM integration point exposed in `server/services/optimizer/ruleBased.ts` (`mlSuggestSlots`). Plug your model or service here.

## Deployment
- Vercel/Netlify (frontend) + Render/Heroku (backend) or Docker on any cloud.
- Builder.io MCP integrations supported:
  - Connect Netlify/Vercel MCP and deploy via dashboard.

## Folder structure
- client/ – React app (pages, components, theme)
- server/ – Express API (routes, models, services)
- shared/ – shared types
- scripts/seed.ts – DB seeding
- docs/openapi.json – API spec

## Authentication & roles
JWT access (15m) + refresh (7d). Roles: admin, doctor, patient. Redirect after login to: /doctor/dashboard, /patient/dashboard, /admin/dashboard.

## Testing
- Unit tests (add under `server/services/optimizer/__tests__`) and API integration tests (Vitest + supertest) – scaffolding ready.
# medi
