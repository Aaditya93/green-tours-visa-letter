# Copilot Instructions - Green Tours Visa Letter

## Big Picture Architecture

- **Framework**: Next.js 15 (App Router) with `next-intl` for i18n support.
- **Language**: TypeScript with strict typing.
- **State & Data**: MongoDB with Mongoose. Server Actions (`actions/`) are the primary way to interact with the DB.
- **Auth**: NextAuth.js (Auth.js) v5 with JWT strategy. Custom session properties (`role`, `companyId`) are defined in [auth.ts](auth.ts).
- **UI**: Tailwind CSS, Shadcn UI (Radix), and Framer Motion.

## Project Conventions & Patterns

- **Database Access**: Always call `await dbConnect()` at the beginning of Server Actions. Example in [actions/agent-platform/visa-letter.ts](actions/agent-platform/visa-letter.ts).
- **Serialization**: Mongoose documents **must** be serialized before being passed to Client Components. Use helpers from [config/serialize.ts](config/serialize.ts) (e.g., `serializeIApplication`).
- **Form Validation**: Use `react-hook-form` paired with Zod schemas defined in [schemas/index.ts](schemas/index.ts).
- **Internationalization**:
  - Routes are locale-prefixed (`app/[locale]/`).
  - Use `useTranslations` for UI text. Logic for locale-aware routing is in [middleware.ts](middleware.ts).
- **AWS Integration**: S3 for uploads and SQS for job processing are located in `actions/upload/`.

## Key Directories

- [actions/](actions/): Domain-specific Server Actions (agent-platform, billing, upload).
- [app/[locale]/](app/%5Blocale%5D/): Localized page routes.
- [db/models/](db/models/): Mongoose schemas (Application, Bill, User, etc.).
- [components/](components/): UI components, organized by domain.
- [messages/](messages/): JSON translation files for `en` and `zh`.

## Common Commands

- `npm run dev`: Start development server with Turbopack.
- `npm run build`: Build for production.
- Database: Connection URI is `NEXT_PUBLIC_MONGODB_URI`.

## AI Coding Guidelines

- When creating new models, ensure they are added to `db/models/` and include proper TypeScript interfaces.
- For new pages, ensure they are placed within the `[locale]` group to support i18n.
- Prefer Server Actions over API routes unless external third-party webhooks are required.
