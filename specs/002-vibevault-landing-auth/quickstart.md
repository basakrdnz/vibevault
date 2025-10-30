# Quickstart Guide: VibeVault Landing Page & Authentication

**Feature**: 002-vibevault-landing-auth  
**Date**: 2025-01-27  
**Tech Stack**: NextJS 14, TypeScript, Prisma, PostgreSQL, NextAuth.js, Tailwind CSS

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or Supabase)
- Git

## Project Setup

### 1. Initialize NextJS Project

```bash
# Create new NextJS project with TypeScript
npx create-next-app@latest vibevault --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd vibevault
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install next-auth@beta prisma @prisma/client bcryptjs
npm install @auth/prisma-adapter zod react-hook-form @hookform/resolvers

# Development dependencies
npm install -D @types/bcryptjs prisma

# UI dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react
```

### 3. Environment Configuration

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vibevault"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (for password reset)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@vibevault.com"
```

### 4. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Copy schema from data-model.md to prisma/schema.prisma
# Run migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 5. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── card.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-provider.tsx
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── utils.ts
│   └── validations.ts
└── types/
    └── auth.ts
```

## Implementation Steps

### 1. Configure NextAuth.js

Create `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { loginSchema } from "./validations"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
```

### 2. Create API Routes

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

Create `src/app/api/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 3. Create Landing Page

Create `src/app/page.tsx`:

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to VibeVault
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Log your emotional journey through movies, series, and documentaries. 
            Discover patterns in your viewing experiences and connect with friends.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Emotional Logging</CardTitle>
              <CardDescription className="text-gray-300">
                Capture how movies and shows make you feel, not just ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Record your emotional responses, personal notes, and viewing patterns 
                to understand your media consumption better.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Discover Content</CardTitle>
              <CardDescription className="text-gray-300">
                Find new movies and series through TMDB integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Browse popular content, search for specific titles, and get 
                detailed information about movies and series.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Social Features</CardTitle>
              <CardDescription className="text-gray-300">
                Share your viewing experiences with friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Connect with friends, see what they're watching, and discover 
                new content through their recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

### 4. Create Authentication Forms

Create `src/components/auth/register-form.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    }
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      // Redirect to login page
      window.location.href = "/login?message=Registration successful"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join VibeVault to start logging your emotional viewing experiences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 5. Create Validation Schemas

Create `src/lib/validations.ts`:

```typescript
import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
})
```

## Testing

### 1. Unit Tests

```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Create jest.config.js
```

### 2. E2E Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Initialize Playwright
npx playwright install
```

### 3. Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## Deployment

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Database Setup

```bash
# Production migration
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Development Commands

```bash
# Development server
npm run dev

# Database studio
npx prisma studio

# Database reset
npx prisma migrate reset

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## Next Steps

1. **Complete Authentication Flow**: Add email verification and password reset
2. **Add OAuth Providers**: Google, GitHub integration
3. **Implement Dashboard**: User dashboard after login
4. **Add Content Discovery**: TMDB API integration
5. **Social Features**: Friend system and activity feeds

## Troubleshooting

### Common Issues

1. **Database Connection**: Check DATABASE_URL in .env.local
2. **NextAuth Secret**: Generate with `openssl rand -base64 32`
3. **Prisma Client**: Run `npx prisma generate` after schema changes
4. **TypeScript Errors**: Check import paths and type definitions

### Debug Mode

```bash
# Enable NextAuth debug
NEXTAUTH_DEBUG=true npm run dev

# Prisma debug
DEBUG=prisma:* npm run dev
```
