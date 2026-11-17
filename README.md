# VOX SMM

An integrated Next.js + TypeScript + PostgreSQL + Prisma starter for legitimate social advertising, campaign management, and analytics. Brand system: angular VOX mark, Plus Jakarta Sans, purple `#8B5CF6`, cyan `#06D6FF`, dark `#080B16`, surfaces `#1A1B2E`, highlight `#EC4899`. Tagline: **SOCIAL GROWTH. REDEFINED.**

This is a source starter, not a deployed or production-ready service. The browser dashboards are branded interface shells; connect them to the included authenticated API before handling customer information. No fake engagement, follower/like/view sales, or platform-rule evasion is implemented.

## Included

- Public marketing page and responsive customer/admin workspace shells.
- Prisma PostgreSQL schema and initial SQL migration for users, roles, services, campaign orders, wallet ledger, tickets, API keys, audit log, and jobs.
- REST examples for health, login/logout, orders, tickets, wallet/ledger, API keys, and administrator user listing.
- Zod request validation, bcrypt password verification, signed HTTP-only session cookie, role check helper, origin check, basic security headers, and in-memory login rate limiting.
- Disabled-by-default payment and campaign-provider interfaces. Deposits return `503`; campaign orders are placed in review and never forwarded. No success is fabricated.
- Seed catalog with strategy, paid social, content planning, and analytics services.

## Local setup

Requirements: Node.js 20+, npm, and PostgreSQL 14+.

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `APP_URL`, and a random `SESSION_SECRET` of at least 32 characters.
2. Install dependencies: `npm install`.
3. Generate the Prisma client: `npm run db:generate`.
4. Apply the migration: `npm run db:migrate`.
5. Seed the catalog: `npm run db:seed`.
6. Start the app: `npm run dev` and open `http://localhost:3000`.

The starter intentionally does not include public registration or an admin bootstrap endpoint. Provision the first administrator privately, using a reviewed one-time script or controlled database process, and store only a bcrypt password hash. Implement registration, email verification, password reset, CSRF strategy, and account recovery before serving real customers.

## Integration configuration

**Payments:** implement `PaymentGateway` in `src/lib/integrations.ts` using a supported gateway's server SDK, signed webhook verification, idempotency, and reconciliation. Never credit a wallet based on a browser redirect. Keep `PAYMENT_PROVIDER=disabled` until those controls and credentials are configured.

**Campaign services:** implement `CampaignProvider` only for authorized ad platforms or legitimate human-delivered marketing services. Validate platform permissions, customer consent, allowed objectives, and provider responses. Keep the provider disabled until credentials and a real adapter exist.

Credentials belong in the hosting provider's secret store, not in source control. `.env.example` contains placeholders only. The GitHub repository and Vercel deployment named in the request were not accessed or modified.

## Security and production checklist

The sample includes useful foundations, not a security certification. Before launch, have the implementation reviewed and test it under the target infrastructure. In particular: add a shared Redis-backed rate limiter; enforce authorization in every data operation; add CSRF protections appropriate to deployment; implement account lifecycle flows; add CSP and HSTS after validating hosting; configure database backups, TLS, retention and monitoring; audit sensitive changes; add queue workers with transactional outbox/idempotency; validate webhook signatures and replay handling; add pagination and abuse monitoring; and run dependency, static, integration, and penetration testing. Do not rely on in-memory limits in a multi-instance deployment.

## Deployment

Use a managed PostgreSQL database and a Node-compatible Next.js host. Configure secrets in the host environment, run `npm run db:migrate` as a deployment/release step, then `npm run build` and `npm start`. The included `vercel.json` selects `npm run build`, which regenerates Prisma Client from the checked-in schema before Next.js type-checking. This prevents a cached generated client from a previous schema version causing mismatched database types. Set `APP_URL` to the canonical HTTPS origin. Provider and payment integrations remain disabled until completed and verified. The included static pages are not an authentication experience; API routes enforce server-side authentication where present.

## API overview

All user routes require the `vox_session` cookie except health and login/logout. `POST /api/orders` records a review-only request, `GET /api/orders` lists the caller's orders (admins see all), `GET/POST /api/tickets` manages tickets, `GET /api/wallet` reads ledger entries, `POST /api/wallet` intentionally returns unavailable, `GET/POST /api/keys` lists/creates keys (creation returns the secret once), and `GET /api/admin/users` requires the ADMIN role.

## License

Private project starter. Add a license before redistributing.
