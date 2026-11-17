# VOX SMM

An integrated Next.js + TypeScript + PostgreSQL + Prisma starter for legitimate social advertising, campaign management, and analytics. Brand system: angular VOX mark, Plus Jakarta Sans, purple `#8B5CF6`, cyan `#06D6FF`, dark `#080B16`, surfaces `#1A1B2E`, highlight `#EC4899`. Tagline: **SOCIAL GROWTH. REDEFINED.**

This is an integrated application foundation, not a production-ready service. The customer workspace is connected to authenticated APIs for campaigns, catalog, wallet ledger, support tickets, and API-key management. The admin workspace is connected to role-checked user, order, service, ticket, and audit endpoints. No fake engagement, follower/like/view sales, or platform-rule evasion is implemented.

## Included

- Public marketing page, registration/login/logout, and responsive customer/admin workspaces.
- Prisma PostgreSQL schema and migrations for users, OAuth accounts, sessions, services, campaign orders, wallet ledger, tickets, API keys, audit log, and jobs.
- Authenticated REST routes for catalog, profile, orders, tickets, wallet/ledger, API-key creation/revocation, and administrator management of users, orders, services, tickets, and audit events.
- Zod request validation, bcrypt email/password login, Google OAuth, encrypted NextAuth session cookies, database-persisted users and provider accounts, role checks, origin checks, basic security headers, and in-memory login rate limiting.
- Disabled-by-default payment and campaign-provider interfaces. Deposits return `503`; campaign orders are placed in review and never forwarded. No success is fabricated.
- Seed catalog with strategy, paid social, content planning, and analytics services.

## Local setup

Requirements: Node.js 20+, npm, and PostgreSQL 14+.

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_URL`, and a random `NEXTAUTH_SECRET` of at least 32 random bytes. Prisma CLI reads `.env` for migration commands.
2. Install dependencies: `npm install`.
3. Generate the Prisma client: `npm run db:generate`.
4. Apply the migration: `npm run db:migrate`.
5. Seed the catalog: `npm run db:seed`.
6. Start the app: `npm run dev` and open `http://localhost:3000`.

Email/password registration and login use bcrypt-hashed passwords stored in PostgreSQL. Google sign-in uses OAuth and persists linked accounts through the Prisma adapter. Sessions use encrypted JWT cookies; user records, Google account links, and roles are stored in PostgreSQL. Email verification, password reset, and account recovery are not included. There is no public admin bootstrap endpoint. Provision the first administrator privately, using a reviewed one-time script or controlled database process, and store only a bcrypt password hash.

### Google OAuth setup

Create an OAuth web client in Google Cloud Console and add these authorized redirect URIs:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://vox-smm.vercel.app/api/auth/callback/google` (or the canonical domain configured for the deployment)

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=true` locally and in the Vercel project environment settings. Set `NEXTAUTH_URL` to the exact app origin and `NEXTAUTH_SECRET` to a long random secret. Keep Google credentials server-side; only the enabled flag is public. Redeploy after changing production environment values.

## Integration configuration

**Payments:** implement `PaymentGateway` in `src/lib/integrations.ts` using a supported gateway's server SDK, signed webhook verification, idempotency, and reconciliation. Never credit a wallet based on a browser redirect. Keep `PAYMENT_PROVIDER=disabled` until those controls and credentials are configured.

**Campaign services:** implement `CampaignProvider` only for authorized ad platforms or legitimate human-delivered marketing services. Validate platform permissions, customer consent, allowed objectives, and provider responses. Keep the provider disabled until credentials and a real adapter exist.

Credentials belong in the hosting provider's secret store, not in source control. `.env.example` contains placeholders only. Deployment configuration runs the Prisma generation step before the Next.js production build.

## Security and production checklist

The sample includes useful foundations, not a security certification. Before launch, have the implementation reviewed and test it under the target infrastructure. In particular: add a shared Redis-backed rate limiter; enforce authorization in every data operation; add CSRF protections appropriate to deployment; implement account lifecycle flows; add CSP and HSTS after validating hosting; configure database backups, TLS, retention and monitoring; audit sensitive changes; add queue workers with transactional outbox/idempotency; validate webhook signatures and replay handling; add pagination and abuse monitoring; and run dependency, static, integration, and penetration testing. Do not rely on in-memory limits in a multi-instance deployment.

## Deployment

Use a managed PostgreSQL database and a Node-compatible Next.js host. Configure secrets in the host environment, run `npm run db:migrate` as a deployment/release step, then `npm run build` and `npm start`. The included `vercel.json` selects `npm run build`, which regenerates Prisma Client from the checked-in schema before Next.js type-checking. This prevents a cached generated client from a previous schema version causing mismatched database types. Set `APP_URL` to the canonical HTTPS origin. Provider and payment integrations remain disabled until completed and verified.

## API overview

NextAuth manages authentication cookies. `POST /api/auth/register` creates an email/password user; `/api/auth/[...nextauth]` handles OAuth, credentials, and sign-out; `GET /api/auth/me` returns the current user. Protected API routes require a valid NextAuth session. `GET /api/services` returns the active catalog. `POST /api/orders` records a review-only request; orders are not forwarded to providers and no money is charged. `GET /api/orders` lists the caller's orders (admins see all). `GET/POST /api/tickets` manages tickets. `GET /api/wallet` reads ledger entries; `POST /api/wallet` intentionally returns unavailable. `GET/POST /api/keys` lists/creates keys (the secret is returned once); `DELETE /api/keys/:id` revokes a key. Admin routes support user access changes, order status updates, service creation/activation, ticket responses/statuses, and recent audit events.

## License

Private project starter. Add a license before redistributing.
