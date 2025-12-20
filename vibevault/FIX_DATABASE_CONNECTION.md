# 🔧 Database Bağlantı Sorunu Çözümü

## Hata
```
Can't reach database server at `db.hylbhivivpbqczbyosrw.supabase.co:5432`
```

## Olası Nedenler

### 1. Supabase Projesi Paused veya Silinmiş
- Supabase Dashboard'da proje durumunu kontrol edin
- Eğer "Paused" ise → "Resume" butonuna tıklayın
- Eğer silinmişse → Yeni proje oluşturun

### 2. Connection String Yanlış
- Supabase Dashboard → Settings → Database → Connection string
- "URI" sekmesinden yeni connection string alın
- `[YOUR-PASSWORD]` kısmını gerçek password ile değiştirin

### 3. Environment Variable Eksik veya Yanlış

**Local (.env.local):**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
```

**Production (Vercel):**
- Vercel Dashboard → Proje → Settings → Environment Variables
- `DATABASE_URL` var mı kontrol edin
- Değeri doğru mu kontrol edin

## Adım Adım Çözüm

### Adım 1: Supabase Proje Durumunu Kontrol Edin

1. [supabase.com/dashboard](https://supabase.com/dashboard) → Giriş yapın
2. Projenize tıklayın
3. Proje durumunu kontrol edin:
   - 🟢 **Active** → Devam edin
   - 🟡 **Paused** → "Resume" butonuna tıklayın
   - 🔴 **Deleted** → Yeni proje oluşturun

### Adım 2: Yeni Connection String Alın

1. Supabase Dashboard → **Settings** (⚙️) → **Database**
2. **"Connection string"** bölümüne gidin
3. **"URI"** sekmesini seçin
4. Connection string'i kopyalayın
5. **⚠️ ÖNEMLİ:** `[YOUR-PASSWORD]` kısmını gerçek database password ile değiştirin

**Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

### Adım 3: Local .env.local Dosyasını Güncelleyin

1. `vibevault/.env.local` dosyasını açın (yoksa oluşturun)
2. `DATABASE_URL` değerini güncelleyin:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

3. `[YOUR-PASSWORD]` ve `[PROJECT-REF]` kısımlarını gerçek değerlerle değiştirin

### Adım 4: Vercel Environment Variables'ı Güncelleyin

1. [vercel.com](https://vercel.com) → Projenize gidin
2. **Settings** → **Environment Variables**
3. `DATABASE_URL` değişkenini bulun veya ekleyin
4. Yeni connection string'i yapıştırın
5. **⚠️ ÖNEMLİ:** `[YOUR-PASSWORD]` kısmını gerçek password ile değiştirin
6. **"Save"** butonuna tıklayın
7. **Yeni bir deployment başlatın** (değişikliklerin uygulanması için)

### Adım 5: Test Edin

**Local:**
```bash
cd vibevault
npx prisma db pull --print
```

**Production:**
- Vercel Dashboard → Deployments → Son deployment → Logs
- Hata var mı kontrol edin

## Hızlı Kontrol Listesi

- [ ] Supabase projesi Active durumunda
- [ ] Yeni connection string alındı
- [ ] Password doğru şekilde değiştirildi
- [ ] Local `.env.local` dosyası güncellendi
- [ ] Vercel environment variables güncellendi
- [ ] Yeni deployment başlatıldı
- [ ] Test edildi

## Eğer Hala Çalışmıyorsa

1. **Supabase Dashboard → Settings → Database → Network Restrictions**
   - IP kısıtlaması var mı kontrol edin
   - Eğer varsa, kaldırın veya IP'nizi ekleyin

2. **Connection String Formatını Kontrol Edin**
   - `?sslmode=require` ekli olmalı
   - Password özel karakterler içeriyorsa URL encode edin

3. **Supabase Proje Logs'unu Kontrol Edin**
   - Supabase Dashboard → Logs
   - Connection attempt'leri görünüyor mu?

## Yeni Supabase Projesi Oluşturma (Eğer Gerekirse)

1. Supabase Dashboard → **"New Project"**
2. Proje bilgilerini doldurun
3. **Database Password** oluşturun (⚠️ Kaydedin!)
4. Proje oluşturulmasını bekleyin (2-3 dakika)
5. Yeni connection string alın
6. Environment variables'ı güncelleyin

