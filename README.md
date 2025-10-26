## Lenify — AI-powered learning companions

Lenify is a Next.js SaaS that lets learners practice lessons with AI voice companions. It integrates Clerk for auth, Supabase for data, Vapi for realtime voice, and Sentry for observability.

Tech stack
- Next.js 15 (App Router), React 19, TypeScript, Tailwind v4
- Clerk (authentication)
- Supabase (database + RLS)
- Vapi Web SDK (@vapi-ai/web)
- Sentry for monitoring (@sentry/nextjs)

Quick start
1) Install dependencies
	- npm install
2) Create a .env.local (copy from .env.example) and fill in values
3) Run the dev server
	- npm run dev
4) Open http://localhost:3000

Note: For voice calls, set NEXT_PUBLIC_VAPI_WEB_TOKEN; otherwise calls will fail with 4xx.

### Environment variables
Copy `.env.example` to `.env.local` and set the following values:

- NEXT_PUBLIC_SUPABASE_URL — your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — anon/public key used by the browser
- SUPABASE_SERVICE_ROLE_KEY — server-only service role key (keep secret)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY — Clerk keys
- NEXT_PUBLIC_VAPI_WEB_TOKEN — Vapi web token for client SDK
- SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN — Sentry DSN (optional)

Keep secrets in your deployment environment (Vercel/Azure/GitHub Actions) and do NOT commit `.env.local`.

### Database
We use Supabase (Postgres). Some features (e.g., bookmarks) require extra tables. Example SQL to create a bookmarks table:

```sql
create table if not exists public.bookmarks (
	id uuid primary key default uuid_generate_v4(),
	user_id text not null,
	companion_id uuid not null references public.companions(id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (user_id, companion_id)
);
```

### Security & secrets
- Do not commit service keys (SUPABASE_SERVICE_ROLE_KEY, CLERK_SECRET_KEY, SENTRY_AUTH_TOKEN).
- `.env*` is ignored by default except `.env.example`. The .gitignore includes `.env*` so confirm before committing secrets.

### Contributing
- Run locally: `npm install` then `npm run dev`.
- Typecheck: `npm run typecheck`.
- Lint: `npm run lint`.

### License
MIT-style placeholder.
