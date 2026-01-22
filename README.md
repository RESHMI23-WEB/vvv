# Virtual Vehicle Showcase

A Next.js + TypeScript starter focused on visualizing vehicles in 3D, exploring detailed specs, and comparing models. This project includes UI components, an AI-powered recommendation dialog, and a small set of utilities and placeholder assets to help you prototype quickly.

---

## Key features

- Interactive 3D vehicle display (demo-ready / extensible)
- Vehicle information panels with specs, price, mileage, and more
- Side-by-side vehicle comparison with scoring/highlights
- Search & filter by type, brand, price range, fuel type
- AI-powered vehicle recommendation dialog (client-side component)
- Placeholder images and sample data for quick prototyping

---

## Tech stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind-style utility classes (used throughout components)
- Recharts for charting (used in UI chart component)
- lucide-react for icons
- dotenv for local environment configuration

Notable files:
- `next.config.ts` — Next.js configuration; allows remote image hosts and relaxes TypeScript/ESLint build checks.
- `src/app/page.tsx` — Home page / primary entry point.
- `src/app/compare/page.tsx` — Vehicle comparison page and logic.
- `src/components/` — Shared UI components (header, dialogs, AI dialog, UI primitives).
- `src/lib/placeholder-images.json` + `src/lib/placeholder-images.ts` — Placeholder images used by the hero and other sections.
- `docs/blueprint.md` — Product/feature blueprint and design notes.
- `.idx/dev.nix` — Optional Nix development environment config (Node 20 recommended).

---

## Quickstart (local)

Prerequisites
- Node.js (Node 20 recommended)
- npm or pnpm
- Optional: Nix if you prefer using the provided `.idx/dev.nix` development environment

Steps
1. Clone the repository
   - git clone https://github.com/RESHMI23-WEB/vvv.git
2. Install dependencies
   - npm install
3. Create environment file(s)
   - Copy `.env.example` (if present) to `.env` and set any required API keys or service URLs.
   - The code uses `dotenv` in `src/ai/dev.ts` for local configuration.
4. Run the development server
   - npm run dev
5. Build and start (production)
   - npm run build
   - npm run start

Check `package.json` for exact script names and dependency versions.

---

## Development notes

- Entry points
  - Start exploring from `src/app/page.tsx` (home/landing).
  - Comparison logic lives in `src/app/compare/page.tsx` and uses helper functions to compute scores and highlights.
  - AI recommendation is implemented in `src/components/ai-recommendation-dialog.tsx` and calls into `src/ai/` helpers.
- UI primitives and components
  - Shared UI building blocks live under `src/components/ui/*` (dialog, toast, sheet, chart, etc.)
  - The top header is `src/components/header.tsx`.
- Images
  - Next.js Image `remotePatterns` are configured in `next.config.ts` for placeholder providers (placehold.co, images.unsplash.com, picsum.photos).
  - Placeholder image metadata is in `src/lib/placeholder-images.json` and typed in `src/lib/placeholder-images.ts`.
- TypeScript & ESLint
  - `next.config.ts` currently sets `typescript.ignoreBuildErrors = true` and `eslint.ignoreDuringBuilds = true`. Consider tightening these for CI/production.

---

## Optional: Nix development environment

- `.idx/dev.nix` describes a Nix workspace that includes Node 20 and additional environment configuration. Use it if you want a reproducible environment; otherwise, a local Node installation is sufficient.

---

## Where to look first

- `src/app/page.tsx` — app entry, hero, and primary layout
- `src/app/layout.tsx` — top-level layout and metadata
- `src/components/ai-recommendation-dialog.tsx` — example of client-side AI UI flow
- `docs/blueprint.md` — product requirements and feature ideas

---

## Contributing

Contributions are welcome. Suggested workflow:
1. Open an issue describing the change or feature.
2. Create a branch for your work: `git checkout -b feat/your-feature`
3. Commit and push, and open a pull request referencing the issue.

If you'd like, I can draft issues or open PRs for specific changes.

---

## Troubleshooting

- If images fail to load, verify `next.config.ts` `remotePatterns` allow the image hostname.
- If TypeScript or ESLint issues appear during development, check the relaxed build settings in `next.config.ts`.
- For AI features or external integrations, ensure `.env` contains the required keys and that `src/ai/dev.ts` loads them.

---

## License

This repository does not declare a license file. Add a `LICENSE` if you want to make the terms explicit.


