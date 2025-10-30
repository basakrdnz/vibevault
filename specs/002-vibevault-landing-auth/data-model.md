# Data Model: VibeVault Landing Page & Authentication

**Feature**: 002-vibevault-landing-auth  
**Date**: 2025-01-27  
**Database**: PostgreSQL with Prisma ORM

## Core Entities

### User

**Purpose**: Represents a registered user account in the system

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hashed with bcrypt
  name          String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // NextAuth.js relationships
  accounts      Account[]
  sessions      Session[]
  
  @@map("users")
}
```

**Validation Rules**:
- Email must be valid format and unique
- Password must be at least 8 characters with complexity requirements
- Name is optional but recommended
- Email verification required for full account access

**State Transitions**:
- `unverified` → `verified` (after email confirmation)
- `active` → `suspended` (admin action)
- `active` → `deleted` (user deletion)

### Account (NextAuth.js)

**Purpose**: OAuth provider accounts linked to users

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

**Validation Rules**:
- Provider and providerAccountId must be unique together
- User must exist before account creation
- Token fields encrypted at rest

### Session (NextAuth.js)

**Purpose**: User session management

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

**Validation Rules**:
- SessionToken must be unique
- Expires must be in the future
- User must exist before session creation

### VerificationToken (NextAuth.js)

**Purpose**: Email verification and password reset tokens

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

**Validation Rules**:
- Token must be unique
- Expires must be in the future
- Used for email verification and password reset

## Database Schema (Prisma)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

## Data Relationships

### User → Account (One-to-Many)
- One user can have multiple OAuth accounts
- Account deletion cascades to user if it's the only account

### User → Session (One-to-Many)
- One user can have multiple active sessions
- Session deletion cascades to user

### User → VerificationToken (One-to-Many)
- One user can have multiple verification tokens
- Tokens are automatically cleaned up after expiration

## Data Validation

### User Registration
```typescript
const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional()
});
```

### User Login
```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});
```

### Password Reset
```typescript
const resetSchema = z.object({
  email: z.string().email("Invalid email format")
});
```

## Security Considerations

### Password Storage
- Passwords hashed with bcrypt (salt rounds: 12)
- Never store plain text passwords
- Password complexity requirements enforced

### Session Management
- Session tokens are cryptographically secure
- Sessions expire after 30 days of inactivity
- Multiple sessions allowed per user
- Session invalidation on password change

### Data Encryption
- Sensitive fields encrypted at rest
- All database connections use SSL/TLS
- API keys and secrets stored in environment variables

## Performance Optimizations

### Database Indexes
```sql
-- User email lookup (most common query)
CREATE INDEX idx_users_email ON users(email);

-- Session token lookup
CREATE INDEX idx_sessions_token ON sessions(session_token);

-- Account provider lookup
CREATE INDEX idx_accounts_provider ON accounts(provider, provider_account_id);

-- Verification token cleanup
CREATE INDEX idx_verification_tokens_expires ON verification_tokens(expires);
```

### Query Optimization
- Use Prisma's `select` to limit returned fields
- Implement connection pooling for database connections
- Use database transactions for multi-table operations
- Cache frequently accessed user data

## Data Migration Strategy

### Initial Migration
1. Create all tables with proper indexes
2. Set up foreign key constraints
3. Create initial admin user if needed
4. Set up database triggers for audit logging

### Future Migrations
- Use Prisma migrations for schema changes
- Always backup data before major migrations
- Test migrations on staging environment first
- Implement rollback procedures

## Backup and Recovery

### Backup Strategy
- Daily automated backups of production database
- Point-in-time recovery capability
- Backup retention: 30 days for daily, 12 months for weekly
- Test backup restoration monthly

### Data Recovery
- User data can be restored from backups
- Session data is ephemeral and can be regenerated
- Account linking data preserved for OAuth users
- Verification tokens are temporary and can be regenerated
