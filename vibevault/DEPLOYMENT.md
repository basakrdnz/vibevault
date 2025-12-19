# 🚀 Production Deployment Guide

## ✅ Database Provider

**Schema güncellendi:** PostgreSQL kullanılıyor (hem development hem production)

**Not:** Development'ta local PostgreSQL veya Supabase kullanabilirsiniz. SQLite artık kullanılmıyor.

### Environment Variables

Vercel'de şu environment variable'ları ekleyin:

```env
# Supabase Connection String (şifrenizi [YOUR-PASSWORD] yerine yazın)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jobjysodomnblmgadyjz.supabase.co:5432/postgres?sslmode=require"

# NextAuth Secret (yeni bir secret oluşturun)
AUTH_SECRET="your-production-secret-key"  # openssl rand -base64 32 ile oluşturun

# Production URL
AUTH_URL="https://your-domain.vercel.app"
```

**Önemli:** `[YOUR-PASSWORD]` kısmını Supabase'den aldığınız gerçek şifre ile değiştirin!

### Build Command

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

### İlk Deployment

1. Vercel'e projeyi bağlayın (GitHub repo)
2. Environment variables'ı ekleyin
3. Build command otomatik çalışacak
4. İlk deployment'ta database schema oluşturulacak

### Supabase Setup

Detaylı Supabase kurulumu için `SUPABASE_SETUP.md` dosyasına bakın.

