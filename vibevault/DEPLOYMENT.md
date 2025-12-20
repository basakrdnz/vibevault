# 🚀 Production Deployment Guide

## ✅ Database Provider

**Schema:** PostgreSQL kullanılıyor (hem development hem production)

**Not:** Development'ta local PostgreSQL veya Supabase kullanabilirsiniz.

## Environment Variables

Vercel'de şu environment variable'ları ekleyin:

```env
# Supabase Connection String
DATABASE_URL="postgresql://postgres:1sEITwMxzJjhvwOl@db.hylbhivivpbqczbyosrw.supabase.co:5432/postgres?sslmode=require"

# NextAuth Secret (production için)
AUTH_SECRET="ncTsNvU0G4CX0EiGJHpe/llrmjBZvK0k7FQJ8V8ff6M="

# Production URL (Vercel domain'inizi buraya yazın)
AUTH_URL="https://your-domain.vercel.app"
```

**Not:** `AUTH_URL` kısmını Vercel'de size verilen gerçek domain ile değiştirin.

## Build Command

`vercel.json` dosyasında build command zaten ayarlı:
```json
{
  "buildCommand": "npm run db:generate && npm run db:push && npm run build"
}
```

Bu command:
1. Prisma client'ı generate eder
2. Database schema'yı push eder (migration)
3. Next.js build alır

## İlk Deployment

1. Vercel'e projeyi bağlayın (GitHub repo - main branch)
2. Environment variables'ı ekleyin
3. Build command otomatik çalışacak
4. İlk deployment'ta database schema oluşturulacak

## Supabase Setup

Detaylı Supabase kurulumu için `SUPABASE_SETUP.md` dosyasına bakın.
