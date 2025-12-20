# 🔧 Vercel Environment Variables Güncelleme

## ✅ Doğru Connection String

Supabase projeniz aktif ve bilgileriniz:
- **Project Reference:** `hylbhivivpbqczbyosrw`
- **Password:** `1sEITwMxzJjhvwOl`
- **Host:** `db.hylbhivivpbqczbyosrw.supabase.co:5432`

## 📋 Vercel'de Yapılacaklar

### 1. Vercel Dashboard'a Gidin
1. [vercel.com](https://vercel.com) → Projenize gidin
2. **Settings** → **Environment Variables**

### 2. DATABASE_URL'i Güncelleyin

**Mevcut değişkeni bulun veya yeni ekleyin:**

**Key:** `DATABASE_URL`

**Value:**
```
postgresql://postgres:1sEITwMxzJjhvwOl@db.hylbhivivpbqczbyosrw.supabase.co:5432/postgres?sslmode=require
```

**⚠️ ÖNEMLİ:** 
- Password'ü doğru yazdığınızdan emin olun: `1sEITwMxzJjhvwOl`
- `?sslmode=require` kısmını eklemeyi unutmayın
- Tüm ortamlar için geçerli olmalı (Production, Preview, Development)

### 3. Diğer Environment Variables Kontrolü

Aşağıdaki değişkenlerin de olduğundan emin olun:

**AUTH_SECRET:**
```
Key: AUTH_SECRET
Value: [Mevcut secret'ınız veya yeni bir tane oluşturun]
```

**AUTH_URL:**
```
Key: AUTH_URL
Value: https://vibevault-six.vercel.app
```

### 4. Save ve Redeploy

1. **"Save"** butonuna tıklayın
2. **Deployments** sekmesine gidin
3. **"Redeploy"** butonuna tıklayın (veya yeni bir commit push edin)
4. Deployment'ın tamamlanmasını bekleyin

## ✅ Test

Deployment tamamlandıktan sonra:

1. **Test Endpoint:** https://vibevault-six.vercel.app/api/auth/test
   - Tüm testlerin geçtiğini kontrol edin

2. **Login Test:** https://vibevault-six.vercel.app/login
   - Admin hesabıyla giriş yapmayı deneyin:
     - Email: `admin@vibevault.com`
     - Password: `admin123`

## 🔍 Sorun Giderme

Eğer hala hata alıyorsanız:

1. **Vercel Logs Kontrolü:**
   - Deployments → Son deployment → Logs
   - Hata mesajlarını kontrol edin

2. **Connection String Format:**
   - `?sslmode=require` ekli olduğundan emin olun
   - Password'de özel karakterler varsa URL encode edin

3. **Supabase Network Restrictions:**
   - Supabase Dashboard → Settings → Database → Network Restrictions
   - IP kısıtlaması var mı kontrol edin

