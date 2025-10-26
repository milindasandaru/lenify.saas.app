# Lenify# Lenify# Lenify



> AI-powered learning companions for interactive voice-based education



A modern SaaS platform that transforms learning through AI voice companions. Students can practice lessons, get instant feedback, and track their progress through natural voice conversations.> AI-powered learning companions for interactive voice-based education> AI-powered learning companions for interactive voice-based education



## Features



- AI Voice Companions with real-time voice responsesLenify is a modern SaaS platform that transforms learning through AI voice companions. Students can practice lessons, get instant feedback, and track their progress—all through natural voice conversations powered by advanced AI.Lenify is a modern SaaS platform that transforms learning through AI voice companions. Students can practice lessons, get instant feedback, and track their progress—all through natural voice conversations powered by advanced AI.

- Secure authentication powered by Clerk with subscription tiers

- Browse and filter learning companions by subject

- Bookmark your favorite companions

- Track your learning journey and session history## Features## Features

- Responsive design with Tailwind v4



## Tech Stack

- **AI Voice Companions** — Interactive lessons with real-time voice responses- **AI Voice Companions** — Interactive lessons with real-time voice responses

**Framework:** Next.js 15 (App Router) with Turbopack  

**Frontend:** React 19, TypeScript, Tailwind CSS v4  - **Secure Authentication** — Powered by Clerk with subscription tiers- **Secure Authentication** — Powered by Clerk with subscription tiers

**Authentication:** Clerk  

**Database:** Supabase (PostgreSQL + RLS)  - **Companion Library** — Browse and filter learning companions by subject- **Companion Library** — Browse and filter learning companions by subject

**Voice AI:** Vapi Web SDK  

**Monitoring:** Sentry  - **Bookmarks** — Save your favorite companions for quick access- **Bookmarks** — Save your favorite companions for quick access

**Forms:** React Hook Form + Zod  

**UI:** Radix UI primitives- **Progress Tracking** — Monitor your learning journey and session history- **Progress Tracking** — Monitor your learning journey and session history



## Quick Start- **Responsive Design** — Beautiful UI built with Tailwind v4- **Responsive Design** — Beautiful UI built with Tailwind v4



1. **Clone and install**

   ```bash

   git clone https://github.com/milindasandaru/lenify.saas.app.git## Tech Stack## Tech Stack

   cd lenify.saas.app

   npm install

  companion_id uuid references public.companions(id) on delete cascade,   npm install

  # Lenify

create index idx_companions_subject on public.companions(subject);

create index idx_companions_author on public.companions(author);   Then edit `.env.local` with your actual values (see Environment Variables below).

create index idx_session_history_user on public.session_history(user_id);

```

4. **Set up the database**

## Available Scripts


# Lenify

3. Commit your changes (`git commit -m 'feat: description'`)

4. Push to the branch (`git push origin feature/name`)## Environment Variables3. **Set up environment variables**### Contributing

5. Open a Pull Request
Copy `.env.example` to `.env.local` and configure:   ```bash- Run locally: `npm install` then `npm run dev`.

### Required   cp .env.example .env.local- Typecheck: `npm run typecheck`.

---



Built with ❤️ by the Lenify team

```bash   ```- Lint: `npm run lint`.

# Supabase

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url   

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-only, keep secret!   Then edit `.env.local` with your actual values (see [Environment Variables](#-environment-variables) below).### License



# Clerk AuthenticationMIT-style placeholder.

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key  # Keep secret!4. **Set up the database**

   

# Vapi Voice AI   Run the SQL migrations in your Supabase dashboard (see [Database Setup](#-database-setup)).

NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token

```5. **Start the development server**

   ```bash

### Optional   npm run dev

   ```

```bash

# Sentry (Error Monitoring)6. **Open your browser**

SENTRY_DSN=your_sentry_dsn   

NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn   Navigate to [http://localhost:3000](http://localhost:3000)

SENTRY_AUTH_TOKEN=your_sentry_auth_token  # For build-time integration

```## 🔧 Environment Variables



**Security Note:** Never commit `.env.local` or expose service role keys. Keep them in your deployment environment only.Copy `.env.example` to `.env.local` and configure:



## Database Setup### Required



Run this SQL in your Supabase SQL Editor:NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```sqlSUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-only, keep secret!

-- Companions table (main learning content)

create table if not exists public.companions (# Clerk Authentication

  id uuid primary key default uuid_generate_v4(),NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

  name text not null,CLERK_SECRET_KEY=your_clerk_secret_key  # Keep secret!


  topic text not null,# Vapi Voice AI

  voice text,NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token

  style text,```

  duration integer,

  author text,### Optional

  created_at timestamptz default now()

);```bash

# Sentry (Error Monitoring)

-- Session history (track user progress)SENTRY_DSN=your_sentry_dsn

create table if not exists public.session_history (NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn

  id uuid primary key default uuid_generate_v4(),SENTRY_AUTH_TOKEN=your_sentry_auth_token  # For build-time integration

  companion_id uuid references public.companions(id) on delete cascade,```

  user_id text not null,

  created_at timestamptz default now()> ⚠️ **Security Note**: Never commit `.env.local` or expose service role keys. Keep them in your deployment environment only.

);

## 🗄️ Database Setup

-- Bookmarks (save favorite companions)

create table if not exists public.bookmarks (### Required Tables

  id uuid primary key default uuid_generate_v4(),

  user_id text not null,Run this SQL in your Supabase SQL Editor:

  companion_id uuid not null references public.companions(id) on delete cascade,

  created_at timestamptz default now(),```sql

  unique (user_id, companion_id)-- Companions table (main learning content)

);create table if not exists public.companions (

  id uuid primary key default uuid_generate_v4(),

-- Optional: Add indexes for better performance  name text not null,

create index idx_companions_subject on public.companions(subject);  subject text not null,

create index idx_companions_author on public.companions(author);  topic text not null,

create index idx_session_history_user on public.session_history(user_id);  voice text,

create index idx_bookmarks_user on public.bookmarks(user_id);  style text,

```  duration integer,

  author text,

### Row Level Security (RLS)  created_at timestamptz default now()

);

The app uses Supabase service role for writes and handles authorization in server components/actions.

-- Session history (track user progress)

## Available Scriptscreate table if not exists public.session_history (

  id uuid primary key default uuid_generate_v4(),

```bash  companion_id uuid references public.companions(id) on delete cascade,

npm run dev          # Start development server (with Turbopack)  user_id text not null,

npm run build        # Build for production  created_at timestamptz default now()

npm run start        # Start production server);

npm run lint         # Run ESLint (strict mode, max-warnings=0)

npm run typecheck    # Run TypeScript type checking-- Bookmarks (save favorite companions)

```create table if not exists public.bookmarks (

  id uuid primary key default uuid_generate_v4(),

## Project Structure  user_id text not null,

  companion_id uuid not null references public.companions(id) on delete cascade,

```  created_at timestamptz default now(),

lenify.saas.app/  unique (user_id, companion_id)

├── app/                      # Next.js App Router pages);

│   ├── companions/          # Companion browsing and detail pages

│   ├── my-journey/          # User dashboard and progress-- Optional: Add indexes for better performance

│   ├── bookmarks/           # Saved companionscreate index idx_companions_subject on public.companions(subject);

│   └── api/                 # API routes (bookmarks, etc.)create index idx_companions_author on public.companions(author);

├── components/              # React componentscreate index idx_session_history_user on public.session_history(user_id);

│   ├── ui/                  # Reusable UI componentscreate index idx_bookmarks_user on public.bookmarks(user_id);

│   └── ...                  # Feature-specific components```

├── lib/                     # Utilities and configurations

│   ├── actions/            # Server actions### Row Level Security (RLS)

│   ├── supabase.ts         # Supabase client factory

│   ├── vapi.sdk.ts         # Vapi SDK initializationThe app uses Supabase service role for writes and handles authorization in server components/actions.

│   └── utils.ts            # Helper functions

├── types/                   # TypeScript type definitions## 📝 Available Scripts

└── public/                  # Static assets

``````bash

npm run dev          # Start development server (with Turbopack)

## Subscription Plansnpm run build        # Build for production

npm run start        # Start production server

Lenify supports three subscription tiers via Clerk metadata:npm run lint         # Run ESLint (strict mode, max-warnings=0)

npm run typecheck    # Run TypeScript type checking

| Plan | Companion Limit | Features |```

|------|----------------|----------|

| **Basic** | 3 | Core features |## 🏗️ Project Structure

| **Core** | 10 | Extended library access |

| **Pro** | Unlimited | Full access + priority support |```

lenify.saas.app/

Plans are managed through Clerk's `publicMetadata.plan` field.├── app/                      # Next.js App Router pages

│   ├── companions/          # Companion browsing and detail pages

## Contributing│   ├── my-journey/          # User dashboard and progress

│   ├── bookmarks/           # Saved companions

1. Fork the repository│   └── api/                 # API routes (bookmarks, etc.)

2. Create a feature branch (`git checkout -b feature/amazing-feature`)├── components/              # React components

3. Commit your changes (`git commit -m 'feat: add amazing feature'`)│   ├── ui/                  # Reusable UI components

4. Push to the branch (`git push origin feature/amazing-feature`)│   └── ...                  # Feature-specific components

5. Open a Pull Request├── lib/                     # Utilities and configurations

│   ├── actions/            # Server actions

### Code Quality│   ├── supabase.ts         # Supabase client factory

│   ├── vapi.sdk.ts         # Vapi SDK initialization

- All commits must pass `npm run typecheck`│   └── utils.ts            # Helper functions

- Follow the existing code style├── types/                   # TypeScript type definitions

- Keep `npm run lint` passing (max-warnings=0)└── public/                  # Static assets

```

## License

## 🔐 Subscription Plans

This project is licensed under the MIT License.

Lenify supports three subscription tiers via Clerk metadata:

## Acknowledgments

| Plan | Companion Limit | Features |

- [Vapi](https://vapi.ai) for voice AI capabilities|------|----------------|----------|

- [Clerk](https://clerk.com) for authentication| **Basic** | 3 | Core features |

- [Supabase](https://supabase.com) for backend infrastructure| **Core** | 10 | Extended library access |

- [Vercel](https://vercel.com) for Next.js framework| **Pro** | Unlimited | Full access + priority support |



---Plans are managed through Clerk's `publicMetadata.plan` field.



**Built with care by the Lenify team**## 🤝 Contributing


1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

- All commits must pass `npm run typecheck`
- Follow the existing code style
- Keep `npm run lint` passing (max-warnings=0)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vapi](https://vapi.ai) for voice AI capabilities
- [Clerk](https://clerk.com) for authentication
- [Supabase](https://supabase.com) for backend infrastructure
- [Vercel](https://vercel.com) for Next.js framework

---

**Built with ❤️ by the samss**
