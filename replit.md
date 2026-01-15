# Tic-Tac-Toe Game

## Overview

A bilingual (English/Chinese) Tic-Tac-Toe web application with game history persistence. Players take turns placing X and O marks on a 3x3 grid, with completed games saved to a PostgreSQL database. Features include animated game pieces, confetti celebrations on wins, and a scrollable match history panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React useState for local game state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for game piece animations
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Flow
1. Game state managed client-side in `GameBoard` component
2. On game completion, result POSTed to `/api/games`
3. History fetched via GET `/api/games` and displayed in `HistoryList`
4. React Query handles caching and invalidation

### Shared Code Pattern
- `shared/schema.ts`: Database table definitions and Zod schemas
- `shared/routes.ts`: API route definitions with input/output types
- Both frontend and backend import from shared for type safety

### Key Design Decisions
- **Monorepo structure**: Client, server, and shared code in single repository
- **Type-safe API contracts**: Zod schemas validate both client requests and server responses
- **Internationalization**: Custom i18n context supports English and Chinese translations
- **Component library**: shadcn/ui provides consistent, accessible UI primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary data store via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building
- **connect-pg-simple**: Session storage (available but not currently used)

### Key NPM Packages
- `@tanstack/react-query`: Async state management
- `framer-motion`: Animation library
- `canvas-confetti`: Win celebration effects
- `date-fns`: Date formatting for history display
- `zod`: Runtime type validation
- `drizzle-zod`: Generate Zod schemas from Drizzle tables

### Development Tools
- `drizzle-kit`: Database migration tooling (`npm run db:push`)
- Replit-specific Vite plugins for development experience