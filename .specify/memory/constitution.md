<!--
SYNC IMPACT REPORT:
Version change: [none] → 1.0.0
Modified principles: [none - all new]
Added sections: 
- Core Principles (5 principles: Static-First Architecture, Progressive Enhancement, Performance Standards, Security & Privacy, Build & Deployment)
- Technical Constraints (Technology Stack, Browser Support)
- Development Workflow (Quality Gates, Testing Requirements)
- Governance (amendment procedures, compliance requirements)
Removed sections: [none - template was empty]
Templates requiring updates: 
✅ constitution.md (updated)
⚠ plan-template.md (may need static web app specific guidance)
⚠ tasks-template.md (may need static web app specific task types)
⚠ spec-template.md (may need static web app specific requirements)
Follow-up TODOs: [none - all placeholders filled]
-->

# Full-Stack Web App Constitution

## Core Principles

### I. Full-Stack Architecture
Server-side rendering for dynamic content; Database operations for user data; API endpoints for client-server communication; Static assets optimized for CDN delivery and caching.

### II. Progressive Enhancement
Core functionality MUST work without JavaScript; Enhanced features progressively layered on top; Graceful degradation for unsupported browsers; Accessibility MUST be maintained at all enhancement levels.

### III. Performance Standards (NON-NEGOTIABLE)
Page load times MUST be under 3 seconds on 3G networks; Core Web Vitals MUST meet Google's thresholds; Images MUST be optimized and lazy-loaded; Critical CSS MUST be inlined; Non-critical resources MUST be deferred.

### IV. Security & Privacy
HTTPS MUST be enforced for all connections; Content Security Policy MUST be implemented; Secure authentication with NextAuth.js; User data MUST be handled according to privacy regulations; GDPR compliance for user data; Secure password hashing and session management.

### V. Build & Deployment
NextJS build process with optimization; Database migrations with Prisma; Version control MUST track all changes; Deployment MUST be automated and atomic; Rollback capability MUST be available; Environment parity MUST be maintained.

## Technical Constraints

### Technology Stack
- NextJS 14+ with App Router for full-stack development
- TypeScript for type safety and developer experience
- PostgreSQL with Prisma ORM for database operations
- NextAuth.js for secure authentication
- Tailwind CSS for responsive design
- Hosting: Vercel for NextJS deployment with Supabase for database

### Browser Support
- Modern browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
- Mobile browsers on iOS 12+ and Android 8+
- Progressive enhancement for older browsers

## Development Workflow

### Quality Gates
- All changes MUST pass automated tests
- Performance budgets MUST be enforced
- Accessibility audits MUST pass WCAG 2.1 AA standards
- Code review required for all changes
- Manual testing on target devices required

### Testing Requirements
- Unit tests for JavaScript functionality
- Visual regression testing for UI changes
- Performance testing with Lighthouse
- Cross-browser compatibility testing
- Mobile responsiveness testing

## Governance

This constitution supersedes all other development practices. Amendments require:
- Documentation of rationale and impact
- Team approval and consensus
- Migration plan for existing code
- Updated testing and validation procedures

All pull requests and code reviews MUST verify compliance with these principles. Complexity additions MUST be justified with measurable benefits. Use project documentation for runtime development guidance.

**Version**: 2.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
