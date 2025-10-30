# Implementation Plan: VibeVault Landing Page & Authentication

**Branch**: `002-vibevault-landing-auth` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-vibevault-landing-auth/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

VibeVault landing page and authentication system for emotional movie logging app. Users can discover the app's purpose, register accounts, and securely log in to access personalized viewing experiences. Built with NextJS for responsive design and PostgreSQL for secure user data storage.

## Technical Context

**Language/Version**: TypeScript 5.0+ with NextJS 14+  
**Primary Dependencies**: NextJS, React 18, Prisma ORM, NextAuth.js, Tailwind CSS  
**Storage**: PostgreSQL with Supabase hosting  
**Testing**: Jest, React Testing Library, Playwright for E2E  
**Target Platform**: Web (responsive design for desktop, tablet, mobile)  
**Project Type**: web - NextJS full-stack application  
**Performance Goals**: <3s page load on 3G, 95+ Lighthouse score, <200ms API response  
**Constraints**: Mobile-first responsive design, GDPR compliance, HTTPS only  
**Scale/Scope**: 10k+ users, 50+ pages/components, real-time authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ⚠️ CONSTITUTION VIOLATIONS DETECTED

**CRITICAL VIOLATION**: Current constitution is for "Static Web App" but VibeVault requires:
- Server-side rendering (NextJS)
- Database operations (PostgreSQL)
- User authentication (NextAuth.js)
- API endpoints (NextJS API routes)

**Required Actions**:
1. **Update Constitution** to support full-stack web applications
2. **Modify Core Principles** to allow server-side functionality
3. **Adjust Technical Constraints** for NextJS + PostgreSQL stack

### Proposed Constitution Amendments

**I. Full-Stack Architecture** (replaces Static-First)
- Server-side rendering for dynamic content
- Database operations for user data
- API endpoints for client-server communication
- Static assets optimized for CDN delivery

**II. Progressive Enhancement** (maintained)
- Core functionality works without JavaScript
- Enhanced features with React/NextJS
- Graceful degradation for older browsers

**III. Performance Standards** (maintained)
- <3s page load on 3G networks
- 95+ Lighthouse score
- <200ms API response times

**IV. Security & Privacy** (enhanced)
- HTTPS enforced for all connections
- Secure authentication with NextAuth.js
- GDPR compliance for user data
- Content Security Policy implementation

**V. Build & Deployment** (enhanced)
- NextJS build process with optimization
- Database migrations with Prisma
- Automated deployment with rollback capability

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
# NextJS Full-Stack Application Structure
src/
├── app/                    # NextJS 14 App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── users/
│   │   └── health/
│   ├── globals.css
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Auth-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validations
├── types/                # TypeScript type definitions
└── styles/               # Additional styles

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts              # Database seeding

public/
├── images/              # Static images
├── icons/               # App icons
└── favicon.ico

tests/
├── __mocks__/           # Test mocks
├── components/          # Component tests
├── pages/               # Page tests
├── api/                 # API tests
└── e2e/                 # End-to-end tests

docs/
├── api/                 # API documentation
├── deployment/          # Deployment guides
└── development/         # Development setup
```

**Structure Decision**: NextJS 14 App Router with full-stack architecture. Single repository with clear separation of concerns: app/ for routing, components/ for UI, lib/ for utilities, prisma/ for database, and tests/ for all testing types.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Full-Stack Architecture | User authentication requires server-side sessions and database operations | Static site insufficient for user accounts and data persistence |
| NextJS Framework | Server-side rendering needed for SEO and performance | Vanilla JS insufficient for complex state management and routing |
| PostgreSQL Database | User data requires ACID transactions and complex queries | File-based storage insufficient for concurrent users and data integrity |
| NextAuth.js | Secure authentication with multiple providers and session management | Custom auth implementation too complex and security risk |

