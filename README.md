# Lenify

AI-powered learning companions for interactive voice-based education.

---

## Overview
Lenify is a SaaS platform for practicing lessons with AI voice companions. It enables users to interact with subject-specific AI tutors, track progress, and bookmark favorite companions. Built with Next.js, Clerk, Supabase, Vapi, and Sentry.

## Features
- AI voice companions for interactive lessons
- Secure authentication (Clerk)
- Browse, filter, and bookmark companions
- Track progress and session history
- Subscription plans (Basic/Core/Pro)
- Responsive UI (Tailwind CSS)
- Error monitoring (Sentry)

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, TypeScript 5, Tailwind CSS v4
- **Auth:** Clerk
- **Database:** Supabase (Postgres + RLS)
- **Voice AI:** Vapi Web SDK
- **Monitoring:** Sentry

## Quick Start
1. **Clone & Install**
   ```bash
   git clone https://github.com/milindasandaru/lenify.saas.app.git
   cd lenify.saas.app
   npm install
   ```
2. **Configure Environment**
   - Copy `.env.example` to `.env.local` and fill in your keys
3. **Run Locally**
   ```bash
   npm run dev
   ```
   - Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables
Set these in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
SENTRY_DSN=your_sentry_dsn
```
**Never commit `.env.local` or service role keys.**

## Database Schema
- **companions**: id, name, subject, topic, voice, style, duration, author, created_at
- **session_history**: id, companion_id, user_id, created_at
- **bookmarks**: id, user_id, companion_id, created_at

## Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run lint` — Lint code
- `npm run typecheck` — Typecheck

## Subscription Plans
| Plan  | Limit      | Features                |
|-------|------------|------------------------|
| Basic | 3          | Core features          |
| Core  | 10         | Extended access        |
| Pro   | Unlimited  | Full access, priority  |

Plans managed via Clerk's `publicMetadata.plan`.

## Usage
- Sign up/sign in with Clerk
- Browse and filter companions
- Bookmark favorites
- Start a voice session with a companion
- View your journey and bookmarks

## Security
- All secrets managed via environment variables
- Supabase RLS enabled for user data
- Sentry for error monitoring

## Contributing
1. Fork & branch
2. Commit & push
3. Open a PR
- All commits must pass `npm run typecheck` and `npm run lint`

## License
MIT

