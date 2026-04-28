# Salasilah — Platform Salasilah Keluarga Malaysia

> Platform digital warisan keluarga untuk keluarga Malaysia. Dokumentasi, visualisasi dan kongsi salasilah keluarga anda.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials + Google OAuth)
- **Tree Visualization**: React Flow (`@xyflow/react`)
- **Image Storage**: Supabase Storage
- **Deployment**: Netlify

---

## Deployment

- GitHub deployments are published through `.github/workflows/netlify-deploy.yml`.
- Add these GitHub Actions repository secrets before enabling the workflow:
  - `NETLIFY_AUTH_TOKEN`
  - `NETLIFY_SITE_ID`
- Pull requests from this repository create a Netlify **Preview** deployment.
- Pushes to `main` create the Netlify **Production** deployment.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with:
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `DIRECT_URL` — Direct connection URL (for migrations)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (for uploads)

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your PostgreSQL connection strings from **Project Settings → Database**
3. In Supabase Storage, create a bucket called `salasilah-photos` (set to **Public**)

### 4. Push database schema

```bash
npm run db:push
```

### 5. Seed with example Malaysian family data

```bash
npm run db:seed
```

This creates a demo family:
- **Patriarch**: Tok Ahmad bin Ibrahim (Kelantan, 1930)
- **Wife**: Wan Siti binti Yusof
- **4 children**: Pak Long, Pak Ngah, Mak Teh, Pak Su
- **8 grandchildren** across all branches

Demo login:
- **Email**: `demo@salasilah.my`
- **Password**: `demo1234`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

### Core
- 🌳 **Interactive Family Tree** — React Flow canvas with zoom, drag, pan, MiniMap
- 👥 **Member Profiles** — Full Malaysian cultural fields (Bin/Binti, IC, Kampung, Generational Titles)
- 📊 **Dashboard** — Stats, upcoming birthdays, recent activity
- 📸 **Photo Gallery** — Upload to Supabase Storage, tag members, categorize
- 🤝 **Collaboration** — Invite family via email (Owner/Editor/Viewer roles)
- 🔍 **Search** — Full-text search across name, kampung, branch, etc.
- 📥 **Export** — Download as CSV

### Bonus
- ⏳ **Family Timeline** — Chronological view of births and deaths by decade
- 🎨 **Branch Color Coding** — Each family branch gets a unique color
- 🎂 **Birthday Reminders** — Widget showing upcoming birthdays in 30 days
- 🔗 **Private Share Link** — Share read-only view via unique URL

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                # Login, Register pages
│   ├── (dashboard)/           # Protected app pages
│   │   ├── dashboard/         # Overview & stats
│   │   ├── family/[familyId]/ # Tree, Members, Gallery, Timeline, Settings
│   │   └── settings/          # Account settings
│   ├── api/                   # API routes
│   └── page.tsx               # Landing page
├── components/
│   ├── dashboard/             # StatsCard, BirthdayWidget, ActivityFeed
│   ├── layout/                # Sidebar, Topbar, MobileNav
│   ├── members/               # MemberForm, PhotoUpload
│   ├── shared/                # Avatar, EmptyState, PageHeader, LoadingSpinner
│   ├── tree/                  # FamilyTreeCanvas, MemberNode
│   └── ui/                    # Button, Card, Input, Select, Dialog, etc.
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── prisma.ts              # Prisma client singleton
│   ├── supabase.ts            # Supabase client for storage
│   ├── tree-utils.ts          # Transform Prisma data → React Flow
│   └── utils.ts               # Helpers (date formatting, color, etc.)
└── types/
    └── index.ts               # Shared TypeScript types
prisma/
├── schema.prisma              # Full database schema
└── seed.ts                    # Example Malaysian family data
```

---

## Database Schema

| Table | Description |
|---|---|
| `User` | Auth users |
| `Account` / `Session` | NextAuth tables |
| `Family` | Family workspace |
| `FamilyMember` | Each family member with all cultural fields |
| `Relationship` | PARENT, CHILD, SPOUSE, SIBLING links |
| `Photo` | Photos linked to family/member |
| `Invite` | Email invitations with role |

---

## Useful Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Push Prisma schema to DB
npm run db:seed      # Seed example data
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:generate  # Regenerate Prisma client
```

---

## Design

- **Primary**: Deep Forest Green `#1B4332`
- **Accent**: Malaysian Gold `#D4A017`
- **Background**: Warm White `#F8F7F4`
- **Fonts**: Inter (body) + Playfair Display (headings)
- **Elderly-friendly**: Min 44px buttons, 16px base font, high contrast

---

*Salasilah — Platform digital warisan keluarga untuk keluarga Malaysia.*
