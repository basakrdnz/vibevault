import { handlers } from '@/lib/auth';

// Export handlers for NextAuth v5
// These handlers automatically handle all NextAuth routes:
// GET/POST /api/auth/signin
// GET/POST /api/auth/signout
// GET /api/auth/session
// GET /api/auth/providers
// etc.
export const { GET, POST } = handlers;