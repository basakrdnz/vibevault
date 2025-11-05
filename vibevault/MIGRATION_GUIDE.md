# 🚀 Migration Çalıştırma - Hızlı Çözüm

## ✅ Sorun: Supabase'de Tablo Yok

Supabase'de hiç tablo olmadığı için migration çalıştırılmalı.

## 🎯 Çözüm 1: Vercel Build Command (Önerilen - En Kolay)

### Adım 1: Vercel Dashboard
1. Vercel Dashboard → Projeniz → **Settings** → **Build & Development Settings**
2. **"Build Command"** kısmını şu şekilde güncelleyin:
   ```bash
   npm run db:push && npm run build
   ```

### Adım 2: Deployment
1. **Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** → **"Redeploy"** seçin
3. Veya yeni bir commit push edin

### Adım 3: Migration Tamamlandıktan Sonra
⚠️ **ÖNEMLİ:** Migration çalıştıktan sonra Build Command'ı tekrar `npm run build` olarak değiştirin!
(Her build'de migration çalışmasın)

---

## 🎯 Çözüm 2: Vercel CLI ile (Alternatif)

Eğer Vercel CLI kuruluysa:

```bash
# Vercel CLI yüklü değilse:
npm install -g vercel

# Login:
vercel login

# Environment variable'ı çek:
cd vibevault
vercel env pull .env.local

# Migration çalıştır:
npm run db:push
```

---

## 🎯 Çözüm 3: Supabase SQL Editor (Manuel - Uzun)

1. Supabase Dashboard → **SQL Editor**
2. **"New query"** oluşturun
3. Prisma migration SQL'ini manuel oluşturup çalıştırın (uzun ve hataya açık)

**Önerilmez** - Çok zaman alır ve hataya açık.

---

## ✅ Kontrol

Migration çalıştıktan sonra:

1. Supabase Dashboard → **Table Editor**
2. Şu tabloların oluşturulduğunu kontrol edin:
   - ✅ `users`
   - ✅ `accounts`
   - ✅ `sessions`
   - ✅ `verification_tokens`
   - ✅ `movies`
   - ✅ `watchlist_items`
   - ✅ `mood_entries`
   - ✅ `featured_movies_cache`
   - ✅ `movie_discoveries`
   - ✅ `friend_requests`
   - ✅ `friendships`
   - ✅ `social_settings`

---

## 🎉 Sonuç

Migration tamamlandıktan sonra:
- ✅ Tablolar oluşturuldu
- ✅ Production'da hata düzelecek
- ✅ "Unable to open database file" hatası gitmeli

**Önerilen:** Çözüm 1 (Vercel Build Command) - En hızlı ve kolay!

