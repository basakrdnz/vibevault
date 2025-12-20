# 🔍 Supabase Connection Check

## Hızlı Test

1. **Supabase Dashboard'a gidin:**
   - [supabase.com/dashboard](https://supabase.com/dashboard)
   - Projenize tıklayın

2. **Proje durumunu kontrol edin:**
   - Proje "Active" durumunda olmalı
   - Eğer "Paused" ise → "Resume" butonuna tıklayın

3. **Yeni Connection String alın:**
   - Settings → Database → Connection string
   - "URI" sekmesini seçin
   - Connection string'i kopyalayın
   - `[YOUR-PASSWORD]` kısmını gerçek password ile değiştirin

4. **Test edin:**
   ```bash
   # .env.local dosyasına ekleyin:
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
   
   # Sonra test edin:
   npx prisma db pull --print
   ```

## Eğer Hala Bağlanamıyorsanız

1. **Yeni bir Supabase projesi oluşturun**
2. **Yeni connection string alın**
3. **.env.local ve Vercel environment variables'ı güncelleyin**

