# ⚡ Hızlı Çözüm - Vercel Build Command

Local'den connection hatası alıyorsunuz (IP whitelist sorunu). En kolay çözüm:

## 🎯 Vercel Build Command ile Migration

### Adım 1: Vercel Dashboard
1. [vercel.com](https://vercel.com) → Projenize gidin
2. **Settings** → **Build & Development Settings**
3. **"Build Command"** kısmını şu şekilde değiştirin:
   ```bash
   npm run db:push && npm run build
   ```

### Adım 2: Redeploy
1. **Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** → **"Redeploy"** seçin
3. Veya yeni bir commit push edin

### Adım 3: Migration Tamamlandıktan Sonra
⚠️ **ÖNEMLİ:** Migration çalıştıktan ve tablolar oluşturulduktan sonra:
- Build Command'ı tekrar `npm run build` olarak değiştirin
- (Her build'de migration çalışmasın)

---

## ✅ Kontrol

Migration tamamlandıktan sonra:
1. Supabase Dashboard → **Table Editor**
2. Tabloların oluşturulduğunu kontrol edin:
   - ✅ `users`
   - ✅ `accounts`
   - ✅ `sessions`
   - ✅ `movies`
   - vb.

---

## 🎉 Sonuç

Bu şekilde:
- ✅ Migration Vercel'de çalışacak (IP sorunu yok)
- ✅ Tablolar oluşturulacak
- ✅ Production'da hata düzelecek

**Bu en kolay ve en güvenilir yöntem!**

