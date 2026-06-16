# Next.js Starter Architecture

This project is a lightweight `Next.js 16` starter built around a small app shell, shared UI primitives, and reusable infrastructure in `lib/`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Radix UI
- TanStack React Query
- Axios
- Zod
- Storybook

## Architecture

```text
app/          Route entrypoints, root layout, metadata, status pages
components/   Shared UI, status states, error boundaries, small app shell pieces
lib/          Core infrastructure: api client, query setup, hooks, constants, utils, schemas
services/     Service-layer exports for backend access
styles/       Global CSS and design tokens
public/       Static assets
```

## Notes

- Single-locale app: `next-intl` and locale routing were removed.
- App-wide providers live in `lib/providers.tsx`.
- Network and client helpers live under `lib/api` and `lib/query`.
- Shared presentational building blocks live under `components/ui`.

## Commands

```bash
npm run dev
npm run lint
npm run type-check
npm run build
```
