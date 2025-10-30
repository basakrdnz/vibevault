# VibeVault - Duygusal Film Takip Platformu

## 🎥 Demo Video

<video width="720" controls>
  <source src="https://raw.githubusercontent.com/[OWNER]/[REPO]/main/vibevault/public/videos/VibeVaultVideo.mp4" type="video/mp4">
  <a href="https://raw.githubusercontent.com/[OWNER]/[REPO]/main/vibevault/public/videos/VibeVaultVideo.mp4">Video izlemek için tıklayın</a>
</video>

Modern film keşfi ve duygusal deneyim takibi için geliştirilmiş kapsamlı NextJS uygulaması. Akıllı film keşfi, kişiselleştirilmiş izleme listeleri ve duygusal mood takibi özelliklerine sahip.

## ✨ Özellikler

### 🎬 **Film Keşfi**
- **Öne Çıkan Filmler**: Günlük yenilenen otomatik oynatılan slider
- **Akıllı Arama**: Gerçek zamanlı arama ve optimize edilmiş API çağrıları
- **Kategori Filtreleme**: Aksiyon, Komedi, Dram ve daha fazlası
- **Rastgele Film Seçimi**: Her sayfa yenilemesinde yeni içerik
- **Veritabanı Entegrasyonu**: 40+ film ile tam metadata

### 📋 **İzleme Listesi Yönetimi**
- **Film Ekleme/Çıkarma**: Tek tıkla izleme listesi yönetimi
- **Durum Takibi**: İzlemek İstiyorum → İzliyorum → İzledim
- **Değerlendirme Sistemi**: 1-5 yıldız değerlendirmeleri
- **Kişisel Notlar**: Her film için özel notlar
- **Özel Sayfa**: Tam izleme listesi yönetim arayüzü

### 💭 **Mood Tracking Sistemi**
- **Duygu Kaydetme**: 15 farklı duygu kategorisi
- **Çoklu Mood Seçimi**: Her film için 3'e kadar mood seçimi
- **Yoğunluk Ölçümü**: 1-10 arası yoğunluk skalası
- **Mood Analytics**: Kişisel duygu analizi ve grafikler
- **Mood Tracker Sayfası**: Detaylı mood geçmişi ve istatistikler

### 📊 **Analytics ve Grafikler**
- **Mood Dağılımı**: Bar chart ile mood dağılımı
- **Mood Breakdown**: Doughnut chart ile mood yüzdeleri
- **Intensity Trends**: Line chart ile zaman içinde yoğunluk
- **Kişisel İstatistikler**: Toplam entry, en sık mood, ortalama yoğunluk

### 🔐 **Kimlik Doğrulama ve Güvenlik**
- **Güvenli Giriş**: NextAuth.js v5 ile credentials provider
- **Kullanıcı İzolasyonu**: Her kullanıcı için tam veri gizliliği
- **Korumalı Rotalar**: Middleware tabanlı rota koruması
- **Oturum Yönetimi**: JWT tabanlı güvenli oturumlar

### 🎨 **Modern UI/UX**
- **Responsive Tasarım**: Mobile-first yaklaşım
- **Karanlık Tema**: Güzel gradient arka planlar
- **Yükleme Durumları**: Akıcı yükleme göstergeleri
- **Gerçek Zamanlı Güncellemeler**: Anında UI geri bildirimi
- **Cache Göstergeleri**: Görsel cache durumu

## 🛠️ Teknoloji Yığını

- **Framework**: NextJS 15 (App Router)
- **Dil**: TypeScript (strict mode)
- **Veritabanı**: SQLite + Prisma ORM
- **Kimlik Doğrulama**: NextAuth.js v5
- **Stil**: Tailwind CSS + shadcn/ui bileşenleri
- **Formlar**: React Hook Form + Zod validasyon
- **Grafikler**: Chart.js + React-ChartJS-2
- **Caching**: Veritabanı tabanlı cache sistemi
- **Test**: Jest + Playwright
- **ORM**: Prisma Client
- **UI Bileşenleri**: Radix UI + Tailwind CSS
- **İkonlar**: Lucide React
- **HTTP İstemcisi**: Fetch API
- **State Yönetimi**: React Hooks (useState, useEffect)
- **Routing**: NextJS App Router
- **Middleware**: NextJS Middleware
- **Environment**: Node.js 18+

## 🚀 Kurulum ve Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Git

### Kurulum Adımları

1. **Projeyi klonlayın ve bağımlılıkları yükleyin**:
   ```bash
   cd vibevault
   npm install
   ```

2. **Environment değişkenlerini ayarlayın**:
   `.env.local` dosyası oluşturun:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

3. **Veritabanını kurun**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Geliştirme sunucusunu başlatın**:
   ```bash
   npm run dev
   ```

5. **Tarayıcınızı açın**:
   [http://localhost:3000](http://localhost:3000) adresine gidin

6. **Test Girişi**:
   - Email: `test@example.com`
   - Şifre: `password123`

## 📁 Proje Yapısı

```
src/
├── app/                    # NextJS 15 App Router
│   ├── (auth)/            # Auth route grubu
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── api/               # API rotaları
│   │   ├── auth/          # Kimlik doğrulama endpoint'leri
│   │   ├── movies/        # Film yönetimi
│   │   │   ├── popular/   # Öne çıkan filmler
│   │   │   ├── random/    # Rastgele seçim
│   │   │   └── search/    # Film arama
│   │   ├── watchlist/     # İzleme listesi yönetimi
│   │   ├── mood-analytics/ # Mood analizi
│   │   ├── cache/         # Cache yönetimi
│   │   └── health/        # Sağlık kontrolü
│   ├── dashboard/         # Ana dashboard
│   ├── movies/           # Film keşif sayfası
│   ├── watchlist/        # İzleme listesi sayfası
│   ├── mood-tracker/     # Mood takip sayfası
│   ├── profile/          # Kullanıcı profili
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/            # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/               # Temel UI bileşenleri (shadcn/ui)
│   ├── auth/             # Auth özel bileşenler
│   ├── movie-slider.tsx  # Öne çıkan filmler carousel
│   ├── movie-grid.tsx    # Arama ile film grid'i
│   ├── movie-popup.tsx   # Film detay popup'ı
│   ├── mood-entry-form.tsx # Mood giriş formu
│   ├── mood-charts.tsx   # Mood grafikleri
│   ├── watchlist-component.tsx
│   └── add-to-watchlist-button.tsx
├── lib/                  # Yardımcı fonksiyonlar
│   ├── auth.ts           # NextAuth v5 konfigürasyonu
│   ├── db.ts             # Veritabanı bağlantısı
│   ├── movie-service.ts  # Film işlemleri
│   ├── watchlist-service.ts # İzleme listesi işlemleri
│   ├── mood-analytics-service.ts # Mood analizi
│   ├── cache-service.ts  # Cache yönetimi
│   ├── omdb-api.ts       # Harici API entegrasyonu
│   ├── user-service.ts   # Kullanıcı işlemleri
│   ├── utils.ts          # Genel yardımcılar
│   └── validations.ts    # Form validasyonları
└── types/                # TypeScript tip tanımları

prisma/
├── schema.prisma         # Veritabanı şeması
├── dev.db              # SQLite veritabanı
└── seed.ts             # Veritabanı seeding
```

## 📜 Mevcut Scriptler

- `npm run dev` - Geliştirme sunucusunu başlat
- `npm run build` - Production için build al
- `npm run start` - Production sunucusunu başlat
- `npm run lint` - ESLint çalıştır
- `npm run db:generate` - Prisma client oluştur
- `npm run db:push` - Şemayı veritabanına gönder
- `npm run db:migrate` - Veritabanı migrasyonlarını çalıştır
- `npm run db:studio` - Prisma Studio'yu aç
- `npm run db:seed` - Örnek verilerle veritabanını doldur
- `npm run test` - Unit testleri çalıştır
- `npm run test:e2e` - End-to-end testleri çalıştır

## 🗄️ Veritabanı Şeması

Uygulama aşağıdaki ana varlıkları kullanır:

- **User**: Kimlik doğrulama bilgileri ile kullanıcı hesapları
- **Account**: OAuth provider hesapları (NextAuth.js)
- **Session**: Kullanıcı oturumları (NextAuth.js)
- **VerificationToken**: Email doğrulama ve şifre sıfırlama tokenları
- **Movie**: Film metadata ve bilgileri
- **WatchlistItem**: Durum ve değerlendirmelerle kişisel izleme listesi
- **MoodEntry**: Filmler için duygusal kayıt
- **FeaturedMoviesCache**: Öne çıkan filmler için cache (24h TTL)
- **MovieDiscovery**: Film keşif takibi

## 🔐 Kimlik Doğrulama Akışı

1. **Kayıt**: Kullanıcılar email/şifre ile hesap oluşturur
2. **Giriş**: NextAuth.js v5 ile güvenli kimlik doğrulama
3. **Oturum Yönetimi**: Güvenli çerezlerle JWT tabanlı oturumlar
4. **Korumalı Rotalar**: Middleware dashboard ve API rotalarını korur
5. **Kullanıcı İzolasyonu**: Her kullanıcı için tam veri gizliliği

## 🎯 Temel Özellikler Açıklaması

### Film Keşif Sistemi
- **Öne Çıkan Filmler**: Günlük yenilenen otomatik oynatılan slider
- **Akıllı Arama**: 300ms debounce ile gerçek zamanlı arama
- **Kategori Filtreleme**: Türüne göre filtreleme (Aksiyon, Komedi, vb.)
- **Rastgele Seçim**: Her sayfa yenilemesinde yeni filmler
- **Cache Sistemi**: Performans için 24 saatlik cache

### İzleme Listesi Yönetimi
- **Tek Tıkla Ekleme/Çıkarma**: Sorunsuz izleme listesi yönetimi
- **Durum Takibi**: İzlemek İstiyorum → İzliyorum → İzledim
- **Değerlendirme Sistemi**: Notlarla 1-5 yıldız değerlendirmeleri
- **Kişisel Notlar**: Her film için özel notlar
- **Özel Arayüz**: Tam izleme listesi yönetim sayfası

### Mood Tracking Sistemi
- **Çoklu Mood Seçimi**: Her film için 3'e kadar mood seçimi
- **Yoğunluk Ölçümü**: 1-10 arası yoğunluk skalası
- **Mood Analytics**: Kişisel duygu analizi ve grafikler
- **Geçmiş Takibi**: Detaylı mood geçmişi ve istatistikler

### Performans Optimizasyonları
- **Veritabanı Caching**: Öne çıkan filmler 24 saat cache'lenir
- **Debounced Search**: Optimize edilmiş API çağrıları
- **Gerçek Zamanlı Güncellemeler**: Anında UI geri bildirimi
- **Yükleme Durumları**: Akıcı kullanıcı deneyimi

## 🚀 Geliştirme

### Yeni Özellik Ekleme

1. Main'den feature branch oluştur
2. Yerleşik kalıpları takip ederek değişiklikleri uygula
3. Yeni işlevsellik için testler ekle
4. Gerektiğinde dokümantasyonu güncelle
5. İnceleme için pull request gönder

### Kod Stili

- Strict mode ile TypeScript
- Kod formatlaması için ESLint ve Prettier
- Bileşen tabanlı mimari
- Uygun yerlerde server-side rendering
- Prisma ile veritabanı-first yaklaşım

## 🌐 Deployment

Uygulama Vercel'de deploy edilmek ve veritabanı için Supabase kullanmak üzere tasarlanmıştır:

1. **Vercel**: Git'ten otomatik deployment'lar
2. **Supabase**: Yönetilen PostgreSQL veritabanı (veya geliştirme için SQLite)
3. **Environment Variables**: Vercel dashboard'da yapılandır

## 🤝 Katkıda Bulunma

1. Repository'yi fork et
2. Feature branch oluştur
3. Değişikliklerini yap
4. Testler ekle
5. Pull request gönder

## 📄 Lisans

MIT License - detaylar için LICENSE dosyasına bakın

## 🎉 Sonuç

VibeVault, modern film keşfi ve duygusal deneyim takibi için kapsamlı bir platform sunar. NextJS 15, TypeScript, Prisma ve NextAuth.js v5 gibi modern teknolojilerle geliştirilmiş olan uygulama, kullanıcı dostu arayüzü ve güçlü özellikleriyle film severler için ideal bir çözüm sunar.

### 🚀 Öne Çıkan Özellikler:
- **Akıllı Film Keşfi**: Gerçek zamanlı arama ve kategori filtreleme
- **Mood Tracking**: Duygusal deneyim kaydetme ve analiz
- **İzleme Listesi**: Durum takibi ve kişisel notlar
- **Analytics**: Detaylı grafikler ve istatistikler
- **Modern UI**: Responsive tasarım ve karanlık tema
- **Güvenlik**: NextAuth.js v5 ile güvenli kimlik doğrulama

Bu platform, film izleme deneyimini sadece bir aktivite olmaktan çıkarıp, kişisel bir yolculuğa dönüştürür. Kullanıcılar sadece ne izlediklerini değil, nasıl hissettiklerini de kaydedebilir ve zaman içindeki duygusal değişimlerini takip edebilirler.