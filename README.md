# Medusa Starter Monorepo

An opinionated e-commerce starter that bundles a **Medusa 2.x** backend together with a modern **Next.js 15** storefront. Everything you need to start shipping a bespoke commerce experience — all in one place.

## Tech Stack

- **Medusa 2.x** – headless commerce backend
- **Next.js 15** – storefront using the new App Router
- **TypeScript** throughout the codebase
- **TailwindCSS** & **@medusajs/ui** for styling and components
- **Turborepo** for monorepo orchestration
- **Yarn 3 ("Berry")** workspaces for dependency management

## Repository Structure

| Path | Description |
| --- | --- |
| `my-medusa-store` | Medusa backend (REST, Admin SDK, workflows) |
| `my-medusa-store-storefront` | Customer-facing Next.js storefront |
| `packages/*` | Internal shared libraries and helpers |
| `scripts/` | Utility and helper scripts |
| config files | ESLint, Prettier, Turbo, etc. |

## Quick Start

### 1. Clone the repository

```bash
# SSH
# or HTTPS
```

### 2. Install dependencies

We use Yarn workspaces. From the repository root run:

```bash
yarn install
```

This single command installs dependencies for every workspace (backend, storefront, packages, …).

### 3. Environment variables

Create the following files based on the provided templates or the documentation of each app:

| App | Template | Target |
| --- | --- | --- |
| Medusa backend | _create manually_ → `my-medusa-store/.env` | Database connection, Stripe keys, etc. |
| Storefront | copy `my-medusa-store-storefront/.env.template` → `my-medusa-store-storefront/.env.local` | `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_STRIPE_KEY`, … |

> Tip: both apps include a `check-env-variables.js` script that warns you if anything is missing.

### 4. Run the apps locally

Open **two terminals** and run the following:

```bash
# Terminal 1 – Medusa backend (http://localhost:9000)
yarn workspace my-medusa-store dev

# Terminal 2 – Storefront (http://localhost:8000)
yarn workspace my-medusa-store-storefront dev
```

The storefront talks to the backend via `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (defaults to `http://localhost:9000`).

### 5. (Optional) Seed demo data

```bash
yarn workspace my-medusa-store seed
```

This populates the database with demo products so you can explore the storefront immediately.

## One-shot development with Turborepo

Prefer a single command? Turborepo can run the dev scripts for every workspace in parallel:

```bash
yarn turbo run dev --parallel
```

## Useful scripts

| Command | Where | Description |
| --- | --- | --- |
| `yarn dev` | storefront | Run Next.js in dev mode on port 8000 |
| `yarn build` | storefront | Production build of the storefront |
| `yarn dev` | backend | Medusa development server on port 9000 |
| `yarn seed` | backend | Seed the Medusa DB with demo data |
| `yarn lint` | root | Lint all packages with ESLint & Prettier |
| `yarn test` | root | Run Playwright e2e tests |

## Deployment

Both apps can be deployed independently:

- **Backend** — any Node 20+ host (Render, Fly.io, Railway, etc.) or container platform.
- **Storefront** — Vercel, Netlify, or any platform that supports Next.js 15.

Make sure to point the storefront’s `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to the publicly accessible URL of the deployed backend.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes
4. Push and open a PR 🥳

## License

This project is open-source under the MIT License.

---

Happy hacking ❤️ 