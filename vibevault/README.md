# VibeVault - Duygusal Film Takip Platformu

> Film izlemek sadece bir aktivite değil, duygusal bir yolculuk. VibeVault, bu yolculuğu kaydetmenize ve analiz etmenize yardımcı olan modern bir platform.

## 🎯 Proje Hikayesi

VibeVault, film izleme deneyimini sadece "izledim" listesinden çok daha ötesine taşımayı hedefleyen bir proje. İzlediğimiz filmlerin bize nasıl hissettirdiğini kaydetmek, zaman içindeki duygusal değişimlerimizi görmek ve bu verilerle kendimizi daha iyi tanımak istedim.

### Neden Bu Proje?

Film izlerken fark ettim ki, bazı filmler bende çok güçlü duygusal tepkiler uyandırıyordu. Bir komedi izlerken güldüğümü, bir drama izlerken üzüldüğümü kaydetmek istedim. Sadece "bu filmi izledim" demek yerine, "bu film bana ne hissettirdi?" sorusuna cevap vermek istiyordum.

## 🛠️ Teknoloji Seçimleri ve Nedenleri

### Next.js 15 + TypeScript

**Neden Next.js?**
- Server-side rendering ile SEO optimizasyonu
- App Router ile modern ve performanslı routing
- Built-in API routes ile backend ihtiyacını karşılıyor
- TypeScript desteği ile tip güvenliği

**Zorlandığım Nokta:** Next.js 15'in yeni özellikleri ve Turbopack ile ilk karşılaşmam biraz zorlayıcıydı. Özellikle middleware ve route handler'ların çalışma mantığını anlamak zaman aldı.

**Çözüm:** Next.js dokümantasyonunu detaylıca okudum ve küçük test projeleriyle denemeler yaptım.

### NextAuth.js v5 (AuthJS)

**Neden NextAuth?**
- Next.js ekosistemiyle mükemmel entegrasyon
- JWT tabanlı session yönetimi
- Güvenlik best practices'leri built-in
- TypeScript desteği

**Zorlandığım Nokta:** NextAuth v5'e geçiş sırasında environment variable isimlerinin değişmesi (`NEXTAUTH_SECRET` → `AUTH_SECRET`) beni şaşırttı. İlk başta "server configuration" hatası aldım.

**Çözüm:** NextAuth v5 dokümantasyonunu inceledim ve `AUTH_SECRET` environment variable'ını ekledim. Ayrıca `trustHost: true` ayarını production için ekledim.

### Prisma + SQLite (Development) / PostgreSQL (Production)

**Neden Prisma?**
- Type-safe database queries
- Otomatik migration sistemi
- Excellent developer experience
- Güçlü TypeScript desteği

**Neden SQLite Development'ta?**
- Hızlı setup, ekstra database server gerektirmiyor
- Development için yeterli
- Production'da PostgreSQL'e geçiş kolay

**Zorlandığım Nokta:** İlk başta schema'yı PostgreSQL olarak ayarlamıştım ama `.env.local`'de SQLite formatı kullanıyordum. Bu uyumsuzluk Prisma validation hatasına neden oldu.

**Çözüm:** Development için SQLite'a geçtim, production'da PostgreSQL kullanacağım. Schema'yı buna göre güncelledim.

### Tailwind CSS + shadcn/ui

**Neden Tailwind?**
- Utility-first yaklaşım ile hızlı styling
- Responsive design kolaylığı
- Modern ve temiz kod

**Neden shadcn/ui?**
- Copy-paste component yaklaşımı (dependency hell yok)
- Radix UI tabanlı, accessible
- Kolay özelleştirme

**Zorlandığım Nokta:** İlk başta component'leri nasıl özelleştireceğimi tam anlamamıştım.

**Çözüm:** shadcn/ui dokümantasyonunu okudum ve component'leri projeme göre özelleştirdim.

### Chart.js + React-ChartJS-2

**Neden Chart.js?**
- Mood analytics için görselleştirme ihtiyacı
- Kolay entegrasyon
- Güzel grafikler

**Zorlandığım Nokta:** Chart.js'in React entegrasyonu ve data formatlaması.

**Çözüm:** React-ChartJS-2 wrapper'ını kullandım ve data'yı Prisma'dan gelen formatı Chart.js formatına çevirdim.

## 🏗️ Mimari Kararlar ve Speckit'in Yardımı

### İlk Mimariyi Oluştururken

Projeye başlarken, Speckit ile detaylı bir planlama yaptım. Her feature için:
- **Spec dosyaları** oluşturduk (001, 002, 003...)
- **Data model** tasarladık
- **API contracts** belirledik
- **Task breakdown** yaptık

Bu yaklaşım, projeyi adım adım ilerletmeme çok yardımcı oldu. Her feature'ı tamamladıktan sonra bir sonrakine geçtim.

### Service Layer Pattern

**Neden?**
- Business logic'i component'lerden ayırmak
- Test edilebilirlik
- Code reusability

**Örnek:** `movie-service.ts`, `watchlist-service.ts`, `mood-analytics-service.ts` gibi service'ler oluşturdum. Bu sayede component'ler sadece UI ile ilgileniyor, business logic service'lerde.

### Database-First Approach

**Neden?**
- Prisma schema ile başladım
- Type-safe queries
- Migration sistemi

**Zorlandığım Nokta:** İlk başta schema'yı nasıl tasarlayacağımı tam bilmiyordum.

**Çözüm:** Speckit ile data model'i detaylıca planladık. User, Movie, WatchlistItem, MoodEntry gibi modelleri önce kağıt üzerinde tasarladık, sonra Prisma schema'ya çevirdik.

## 🚧 Zorlandığım Noktalar ve Çözümler

### 1. NextAuth v5 Migration

**Problem:** NextAuth v4'ten v5'e geçiş sırasında environment variable isimleri değişti.

**Çözüm:** 
- NextAuth v5 dokümantasyonunu okudum
- `AUTH_SECRET` ve `AUTH_URL` environment variable'larını ekledim
- `trustHost: true` ayarını production için ekledim

### 2. Database Provider Mismatch

**Problem:** Schema PostgreSQL, `.env.local` SQLite formatındaydı.

**Çözüm:** Development için SQLite'a geçtim, production'da PostgreSQL kullanacağım.

### 3. Prisma Client Generation

**Problem:** Turbopack ile Prisma client generation sırasında dosya kilitlenmesi.

**Çözüm:** Dev server'ı durdurup `npm run db:generate` çalıştırdım, sonra tekrar başlattım.

### 4. Type Safety in Callbacks

**Problem:** NextAuth callback'lerinde tip güvenliği eksikti.

**Çözüm:** `NextAuthConfig` type'ını kullandım ve callback'leri düzgün tip tanımlarıyla yazdım.

## 📦 Production Hazırlığı

### ✅ Yapılanlar

- [x] NextAuth v5 konfigürasyonu
- [x] Environment variables setup
- [x] Database schema (SQLite dev, PostgreSQL prod)
- [x] Vercel deployment config
- [x] Build optimizations
- [x] Error handling

### ⚠️ Production İçin Notlar

1. **Database:** Production'da PostgreSQL kullanılmalı (Supabase önerilir)
2. **AUTH_SECRET:** Production için güçlü bir secret oluşturun
3. **AUTH_URL:** Production URL'inizi set edin
4. **Environment Variables:** Vercel'de tüm gerekli variable'ları ekleyin

### 🚀 Deployment

Vercel'de deploy etmek için:

1. **Environment Variables** ekleyin:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `AUTH_SECRET` (güçlü bir secret)
   - `AUTH_URL` (production URL)

2. **Build Command:** `vercel.json`'da zaten ayarlı:
   ```json
   {
     "buildCommand": "npm run db:generate && npm run db:push && npm run build"
   }
   ```

3. **Deploy:** Git push yapın, Vercel otomatik deploy edecek.

## 🎨 Özellikler

### 🎬 Film Keşfi
- Öne çıkan filmler slider'ı
- Gerçek zamanlı arama
- Kategori filtreleme
- Rastgele film seçimi

### 📋 İzleme Listesi
- Film ekleme/çıkarma
- Durum takibi (İzlemek İstiyorum → İzliyorum → İzledim)
- Yıldız değerlendirmeleri
- Kişisel notlar

### 💭 Mood Tracking
- 15 farklı duygu kategorisi
- Çoklu mood seçimi (3'e kadar)
- Yoğunluk ölçümü (1-10)
- Mood analytics ve grafikler

### 📊 Analytics
- Mood dağılımı grafikleri
- Intensity trends
- Kişisel istatistikler

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Environment variables oluşturun
# .env.local dosyası oluşturup şunları ekleyin:

# Development için Supabase kullanıyorsanız:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jobjysodomnblmgadyjz.supabase.co:5432/postgres?sslmode=require"

# Veya local PostgreSQL kullanıyorsanız:
# DATABASE_URL="postgresql://user:password@localhost:5432/vibevault"

AUTH_SECRET="your-secret-key-here"  # openssl rand -base64 32 ile oluşturun
AUTH_URL="http://localhost:3000"

# Database'i kurun
npm run db:push

# Development server'ı başlatın
npm run dev
```

**Not:** Development'ta Supabase kullanmak istemiyorsanız, local PostgreSQL kurulumu yapabilirsiniz.

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route grubu
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard sayfası
│   ├── movies/           # Film keşif sayfası
│   ├── watchlist/        # İzleme listesi
│   └── mood-tracker/     # Mood takip sayfası
├── components/            # React component'leri
│   ├── ui/               # shadcn/ui component'leri
│   ├── auth/             # Auth component'leri
│   └── ...               # Diğer component'ler
└── lib/                  # Utility fonksiyonlar
    ├── auth.ts           # NextAuth config
    ├── db.ts             # Prisma client
    └── ...               # Service'ler
```

## 🎓 Öğrendiklerim

1. **Next.js 15 App Router:** Modern routing ve server components
2. **NextAuth v5:** Authentication best practices
3. **Prisma:** Type-safe database access
4. **Service Layer Pattern:** Clean architecture
5. **TypeScript:** Type safety ve developer experience
6. **Chart.js:** Data visualization
7. **Tailwind CSS:** Utility-first CSS

## 🔮 Gelecek Planlar

- [ ] Social features (arkadaş ekleme, paylaşım)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] AI-powered movie recommendations based on mood

## 📄 Lisans

MIT License

---

**Not:** Bu proje, film izleme deneyimini daha anlamlı hale getirmek için yapıldı. Her film bir hikaye, her hikaye bir duygu. VibeVault, bu duyguları kaydetmenize ve analiz etmenize yardımcı olur.
