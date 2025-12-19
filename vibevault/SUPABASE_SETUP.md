# 🚀 Supabase Kurulum Rehberi - VibeVault

Bu rehber, VibeVault projesini Supabase PostgreSQL veritabanı ile çalıştırmak için adım adım talimatlar içerir.

## 📋 Adım 1: Supabase Projesi Oluşturma

### 1.1. Supabase'e Kayıt Olun
1. [supabase.com](https://supabase.com) adresine gidin
2. **"Start your project"** veya **"Sign in"** butonuna tıklayın
3. GitHub hesabınızla giriş yapın (önerilen) veya email ile kayıt olun

### 1.2. Yeni Proje Oluşturun
1. Dashboard'da **"New Project"** butonuna tıklayın
2. **Organization** seçin (yoksa yeni oluşturun)
3. Proje bilgilerini doldurun:
   - **Name**: `vibevault` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre oluşturun (⚠️ **ÖNEMLİ: Bu şifreyi kaydedin!**)
   - **Region**: Size en yakın bölgeyi seçin (örn: `West Europe`, `North America`)
4. **"Create new project"** butonuna tıklayın
5. Proje oluşturulmasını bekleyin (2-3 dakika sürebilir)

## 📋 Adım 2: Database Connection String'i Alma

### 2.1. Database URL'i Bulun
1. Supabase Dashboard'da projenize gidin
2. Sol menüden **"Settings"** (⚙️) → **"Database"** seçin
3. **"Connection string"** bölümüne gidin
4. **"URI"** sekmesini seçin
5. **Connection string**'i kopyalayın (şu formatta olacak):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. **⚠️ ÖNEMLİ:** `[YOUR-PASSWORD]` kısmını daha önce oluşturduğunuz database password ile değiştirin!

   **Örnek:**
   ```
   postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
   ```

### 2.2. Connection Pooling (Opsiyonel - Önerilir)
- **Connection pooling** kullanmak için **"Session mode"** yerine **"Transaction mode"** veya **"Statement mode"** kullanın
- Pooling URL'i biraz farklı olacak (port 6543 veya 5432 olabilir)
- Production için pooling önerilir (daha iyi performans)

## 📋 Adım 3: Vercel Environment Variables Ekleme

### 3.1. Vercel Dashboard'a Gidin
1. [vercel.com](https://vercel.com) → Projenize gidin
2. **"Settings"** → **"Environment Variables"** seçin

### 3.2. DATABASE_URL Ekleme
1. **"Add New"** butonuna tıklayın
2. Şu bilgileri girin:
   - **Key**: `DATABASE_URL`
   - **Value**: Supabase'den kopyaladığınız connection string (password ile değiştirilmiş)
   - **Environment**: Tüm ortamları seçin (Production, Preview, Development)
3. **"Save"** butonuna tıklayın

### 3.3. Diğer Environment Variables Kontrolü
Aşağıdaki değişkenlerin de ayarlandığından emin olun:
- `AUTH_SECRET`: **ZORUNLU** - Güçlü bir secret key (oluşturmak için: `openssl rand -base64 32`)
- `AUTH_URL`: Production URL'iniz (örn: `https://vibevault.vercel.app`) - Önerilir

## 📋 Adım 4: Database Migration (Schema Oluşturma)

### 4.1. Prisma Client'ı Generate Edin
```bash
cd vibevault
npm run db:generate
```

### 4.2. Database Schema'yı Push Edin

**Seçenek A: Supabase Dashboard'dan (SQL Editor)**
1. Supabase Dashboard → **"SQL Editor"**
2. **"New query"** oluşturun
3. Prisma migration dosyalarını kullanarak manuel olarak tabloları oluşturabilirsiniz

**Seçenek B: Prisma CLI ile (Önerilen)**
```bash
# .env.local dosyasına DATABASE_URL ekleyin (development için)
# Sonra migration çalıştırın:
npm run db:push
```

**Seçenek C: Vercel Build Command ile (En İyi)**
Vercel'de build sırasında otomatik migration için:
1. Vercel Dashboard → Proje → **"Settings"** → **"Build & Development Settings"**
2. **"Build Command"** kısmına şunu ekleyin:
   ```bash
   npm run db:generate && npm run db:push && npm run build
   ```

## 📋 Adım 5: Test ve Kontrol

### 5.1. Database Bağlantısını Test Edin
1. Supabase Dashboard → **"Table Editor"**
2. Tabloların oluşturulduğunu kontrol edin:
   - `users`
   - `accounts`
   - `sessions`
   - `movies`
   - `watchlist_items`
   - `mood_entries`
   - vb.

### 5.2. Vercel Deployment'ı Test Edin
1. Vercel'de yeni bir deployment başlatın
2. Build loglarını kontrol edin (hata olmamalı)
3. Production URL'inize gidin
4. **"Create Account"** formunu test edin
5. Hata olmamalı - artık SQLite hatası yerine PostgreSQL kullanılıyor! ✅

## 📋 Adım 6: Development için Local Setup (Opsiyonel)

Eğer local development için de Supabase kullanmak isterseniz:

1. `vibevault/.env.local` dosyası oluşturun:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres?sslmode=require"
   AUTH_SECRET="your-local-secret-key-generate-with-openssl-rand-base64-32"
   AUTH_URL="http://localhost:3000"
   ```

2. Prisma client generate edin:
   ```bash
   npm run db:generate
   ```

3. Development server başlatın:
   ```bash
   npm run dev
   ```

## 🎯 Özet Checklist

- [ ] Supabase projesi oluşturuldu
- [ ] Database password kaydedildi
- [ ] DATABASE_URL alındı ve password ile güncellendi
- [ ] Vercel environment variables eklendi
- [ ] Prisma schema PostgreSQL'e güncellendi (✅ Yapıldı)
- [ ] Database migration çalıştırıldı
- [ ] Vercel deployment test edildi
- [ ] Production'da hata olmadığı doğrulandı

## 🆘 Sorun Giderme

### Hata: "Unable to open the database file"
- ✅ **Çözüldü:** Prisma schema PostgreSQL'e güncellendi
- Eğer hala görüyorsanız, Vercel'de DATABASE_URL environment variable'ının doğru ayarlandığından emin olun

### Hata: "Connection refused" veya "SSL required"
- Supabase connection string'ine `?sslmode=require` ekleyin
- Password'ün doğru olduğundan emin olun

### Hata: "Table does not exist"
- `npm run db:push` komutunu çalıştırın
- Veya Vercel build command'a migration ekleyin

### Migration çalışmıyor
- Supabase Dashboard → Settings → Database → Connection Pooling'i kontrol edin
- Direct connection kullanmayı deneyin (port 5432)

## 📚 Ek Kaynaklar

- [Supabase Dokümantasyon](https://supabase.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**🎉 Tebrikler!** Artık VibeVault production'da PostgreSQL kullanıyor!

