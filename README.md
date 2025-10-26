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
