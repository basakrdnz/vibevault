# 📝 Environment Variables Açıklaması

## `.env.local` Dosyası Nedir?

`.env.local` dosyası, **local development** için gerekli olan gizli bilgileri (şifreler, API key'ler) saklar.

### Neden Gerekli?

1. **DATABASE_URL** → Supabase database'e bağlanmak için
2. **AUTH_SECRET** → NextAuth.js'in session'ları şifrelemek için
3. **AUTH_URL** → NextAuth.js'in hangi URL'de çalıştığını bilmesi için

### Nereye Bağlı?

- **DATABASE_URL** → `prisma/schema.prisma` dosyasında kullanılıyor
- **AUTH_SECRET** → `src/lib/auth.ts` dosyasında kullanılıyor
- **AUTH_URL** → NextAuth.js otomatik olarak kullanıyor

## 📁 Dosya Konumu

```
vibevault/
  ├── .env.local          ← Bu dosyayı oluşturmanız gerekiyor
  ├── .env                ← Prisma CLI için (opsiyonel)
  └── src/
      └── lib/
          └── auth.ts     ← AUTH_SECRET burada kontrol ediliyor
```

## 🔧 Nasıl Oluşturulur?

1. `vibevault` klasöründe `.env.local` dosyası oluşturun
2. Aşağıdaki içeriği ekleyin:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# NextAuth.js Secret (güçlü bir key oluşturun)
AUTH_SECRET="your-secret-key-here"

# NextAuth.js URL (local development için)
AUTH_URL="http://localhost:3000"
```

## 🔑 AUTH_SECRET Nasıl Oluşturulur?

Terminal'de şu komutu çalıştırın:
```bash
openssl rand -base64 32
```

Çıkan key'i `AUTH_SECRET` olarak kullanın.

## ⚠️ Önemli Notlar

1. **`.env.local` dosyası `.gitignore`'da** → Git'e commit edilmez (güvenlik için)
2. **Production'da** → Vercel Dashboard'da environment variables olarak eklenir
3. **Password'ü değiştirmeyi unutmayın** → `[YOUR-PASSWORD]` kısmını gerçek password ile değiştirin

## 🚀 Şimdi Ne Yapmalı?

1. Supabase Dashboard'dan connection string alın
2. `.env.local` dosyası oluşturun
3. Connection string'i ve diğer değişkenleri ekleyin
4. Dev server'ı yeniden başlatın

