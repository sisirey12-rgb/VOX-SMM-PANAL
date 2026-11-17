# Launchpad SMM — secure-minded starter

A Next.js starter for a legitimate social media marketing and analytics platform.

## Requirements
- Node.js 20.9+ (LTS recommended)
- npm
- PostgreSQL 15+

## Install
```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` and set a private PostgreSQL connection string. Never commit `.env.local`.

## Run the UI
```powershell
npm run dev
```
Open http://localhost:3000.

## Database
After PostgreSQL is running and DATABASE_URL is configured:
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

## Important implementation status
This package is a starter foundation, not a finished production service:
- Public landing page is implemented.
- Health endpoint is implemented.
- Prisma data model and input schemas are included.
- Login, registration, customer dashboard and admin routes are UI placeholders.
- No real authentication, authorization, payment processing, wallet operations or provider integrations are enabled yet.
- Do not deploy with real customer data or accept payments until these systems are implemented, reviewed and tested.

## Security baseline
- Strict TypeScript.
- Basic browser security headers.
- No secrets committed; `.env.local` is ignored.
- Prisma relations and indexes for core entities.
- Money stored as integer minor units (paise), not floating point.
- Separate role model and append-only-style wallet ledger records.

Before production, add and test:
1. Mature authentication (secure password hashing, verified email, secure cookie sessions, CSRF protection).
2. Server-side role/permission checks on every protected page and API route.
3. Distributed rate limiting (not in-memory only).
4. Atomic database transactions and idempotency keys for wallet/payment operations.
5. Payment-provider signature verification and webhook replay protection.
6. Input/output validation, ownership checks, audit logging and monitoring.
7. Dependency scanning, security testing, backups and incident response.
8. HTTPS and production secrets management.

The platform is intended for legitimate marketing, campaign management and analytics—not fake engagement or platform manipulation.
