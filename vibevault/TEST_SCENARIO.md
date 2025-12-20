# 🔍 Detaylı Test Senaryosu - Login Sorun Giderme

## Problem
Production'da "Configuration" hatası alınıyor. Login çalışmıyor.

## Test Senaryosu

### 1. Database Bağlantısı Testi

**Test:** Database'e bağlanabiliyor muyuz?

**Yapılacaklar:**
```bash
# Terminal'de çalıştırın
cd vibevault
npx prisma db pull --print
```

**Beklenen Sonuç:** 
- ✅ Başarılı → Database bağlantısı çalışıyor
- ❌ Hata → Database bağlantısı yok, `.env.local` kontrol edin

**Log Kontrolü:**
- Hata mesajını not edin
- Connection string'i kontrol edin

---

### 2. Admin Kullanıcısı Kontrolü

**Test:** Admin kullanıcısı database'de var mı?

**Yapılacaklar:**
1. Supabase Dashboard → SQL Editor
2. Şu SQL'i çalıştırın:

```sql
SELECT 
    id, 
    email, 
    name, 
    CASE 
        WHEN password IS NOT NULL THEN 'Password exists' 
        ELSE 'No password' 
    END as password_status,
    LENGTH(password) as password_length,
    LEFT(password, 10) as password_preview
FROM "users" 
WHERE email = 'admin@vibevault.com';
```

**Beklenen Sonuç:**
- ✅ 1 satır döner → Admin kullanıcısı var
- ❌ 0 satır döner → Admin kullanıcısı yok, `CREATE_ADMIN.sql` çalıştırın

**Log Kontrolü:**
- `password_status`: "Password exists" olmalı
- `password_length`: ~60 karakter olmalı (bcrypt hash)
- `password_preview`: `$2b$12$...` ile başlamalı

---

### 3. Password Hash Doğrulama

**Test:** Password hash'i doğru mu?

**Yapılacaklar:**
```bash
# Terminal'de çalıştırın
node -e "const bcrypt = require('bcryptjs'); const hash = 'DATABASE_DEN_ALINAN_HASH'; bcrypt.compare('admin123', hash).then(result => console.log('Password match:', result));"
```

**Beklenen Sonuç:**
- ✅ `Password match: true` → Hash doğru
- ❌ `Password match: false` → Hash yanlış, yeni admin oluşturun

**Log Kontrolü:**
- Hash'i Supabase'den alın
- Test edin

---

### 4. Environment Variables Kontrolü

**Test:** Tüm environment variables doğru mu?

**Yapılacaklar:**

**Local (.env.local):**
```bash
# Terminal'de kontrol edin
cd vibevault
cat .env.local
```

**Production (Vercel):**
1. Vercel Dashboard → Proje → Settings → Environment Variables
2. Kontrol edin:
   - `DATABASE_URL` var mı?
   - `AUTH_SECRET` var mı?
   - `AUTH_URL` var mı? (`https://vibevault-six.vercel.app` olmalı)

**Beklenen Sonuç:**
- ✅ Tüm değişkenler var ve doğru
- ❌ Eksik veya yanlış → Düzeltin

**Log Kontrolü:**
- Her değişkenin değerini not edin (password'ü gizleyin)

---

### 5. Server-Side Log Testi

**Test:** `authorize` fonksiyonu çalışıyor mu?

**Yapılacaklar:**
1. `src/lib/auth.ts` dosyasında log'lar zaten var
2. Production'da login deneyin
3. Vercel Dashboard → Deployments → Son deployment → Logs
4. Server-side log'ları kontrol edin

**Beklenen Log'lar:**
```
❌ Missing credentials
❌ User not found or no password
❌ Invalid password
✅ Authentication successful for: admin@vibevault.com
❌ Authorization error: [error details]
```

**Log Kontrolü:**
- Hangi log görünüyor?
- Hata varsa detaylarını not edin

---

### 6. NextAuth Configuration Testi

**Test:** NextAuth doğru yapılandırılmış mı?

**Yapılacaklar:**
1. `src/lib/auth.ts` dosyasını kontrol edin
2. `src/app/api/auth/[...nextauth]/route.ts` dosyasını kontrol edin

**Beklenen Durum:**
- ✅ `AUTH_SECRET` kontrol ediliyor
- ✅ `secret: process.env.AUTH_SECRET` var
- ✅ `trustHost: true` var
- ✅ `handlers` doğru export ediliyor

**Log Kontrolü:**
- Dosyaları kontrol edin
- Hata varsa düzeltin

---

### 7. API Route Testi

**Test:** NextAuth API route çalışıyor mu?

**Yapılacaklar:**
1. Tarayıcıda şu URL'yi açın:
   - Local: `http://localhost:3000/api/auth/providers`
   - Production: `https://vibevault-six.vercel.app/api/auth/providers`

**Beklenen Sonuç:**
- ✅ JSON response döner → API çalışıyor
- ❌ Hata döner → API route sorunu var

**Log Kontrolü:**
- Response'u kontrol edin
- Hata varsa not edin

---

## Sorun Giderme Checklist

- [ ] Database bağlantısı çalışıyor
- [ ] Admin kullanıcısı database'de var
- [ ] Password hash doğru
- [ ] Environment variables doğru (local ve production)
- [ ] Server-side log'lar görünüyor
- [ ] NextAuth configuration doğru
- [ ] API route çalışıyor

## Hangi Log'u Görüyorsunuz?

Test senaryosunu adım adım uygulayın ve her adımın sonucunu not edin. Hangi adımda sorun var?

