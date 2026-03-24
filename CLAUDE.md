## Commands

```bash
npm run dev           # Dev server (port 3000)
npm run build         # Production build
npm run lint          # ESLint

npm run db:push       # Push Prisma schema → Supabase
npm run db:generate   # Regenerate Prisma client
npm run db:seed       # Seed demo Malaysian family
npm run db:studio     # Open Prisma Studio GUI
```

## Architecture

Next.js 15 App Router + TypeScript + Prisma + Supabase + NextAuth v5 (beta).

```
src/app/
  (auth)/                 # Login, Register
  (dashboard)/            # Protected pages
    family/[familyId]/    # Tree, Members, Gallery, Timeline, Settings
  api/                    # REST endpoints (families, members, photos, upload)
src/components/
  tree/                   # React Flow canvas (FamilyTreeCanvas, MemberNode)
  map/                    # Leaflet map for family locations
  ui/                     # shadcn/ui primitives
src/lib/
  auth.ts                 # NextAuth config (Credentials + Google)
  tree-utils.ts           # Prisma data → React Flow nodes/edges
  prisma.ts               # Prisma client singleton
  supabase.ts             # Storage client
prisma/
  schema.prisma           # Full DB schema
  seed.ts                 # Demo family data
```

## Key Models

- `Family` — workspace with shareToken for private links
- `FamilyMember` — includes Malaysian cultural fields: `binBinti`, `icNumber`, `negeri`, `religion`, `familyBranch`, `generationalTitle`
- `Relationship` — typed edges: PARENT, CHILD, SPOUSE, SIBLING
- `TreeNodeLayout` — saved x/y positions for canvas nodes

## Environment

Copy `.env.example` → `.env.local`:

```
DATABASE_URL                    # Supabase PG (pgbouncer)
DIRECT_URL                      # Direct connection (migrations)
NEXTAUTH_SECRET                 # openssl rand -base64 32
NEXTAUTH_URL                    # http://localhost:3000
GOOGLE_CLIENT_ID / SECRET       # Optional OAuth
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Gotchas

- **Prisma + Vercel**: `@prisma/client` and `bcryptjs` in `serverExternalPackages` — required for Vercel edge compatibility
- **NextAuth v5 beta**: JWT sessions (not DB). Use `auth()` from `@/lib/auth`, not `getSession()`
- **Tree layout**: `tree-utils.ts` does BFS to assign generations. Fixed spacing: NODE_WIDTH=240, NODE_HEIGHT=144, V_GAP=168, SPOUSE_GAP=40. Canvas positions saved in `TreeNodeLayout`
- **i18n**: Cookie-based locale (`NEXT_LOCALE`). Default is Malay (`ms`). Translations in `/messages/{locale}.json`
- **Image domains**: `next.config.js` allowlist includes supabase.co, googleusercontent.com, github.com — add new hosts here if needed
- **Google OAuth optional**: Provider only registers if `GOOGLE_CLIENT_ID` env var is set

## Demo

- Email: `demo@salasilah.my` / Password: `demo1234`
- Seeds a Kelantan family starting 1930+
