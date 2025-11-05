# 🚀 Migration Komutları - Terminal'den Çalıştırın

## Adım 1: Doğru Dizine Geçin

```powershell
cd C:\Users\basak\Github\vibevault\vibevault
```

## Adım 2: Vercel Link (Eğer henüz yapmadıysanız)

```powershell
vercel link
```

## Adım 3: Environment Variables Çekin

```powershell
vercel env pull .env.local
```

## Adım 4: Migration Çalıştırın

```powershell
npm run db:push
```

---

## ✅ Alternatif: Direkt DATABASE_URL ile

Eğer Vercel env pull çalışmazsa, direkt DATABASE_URL ile:

```powershell
cd C:\Users\basak\Github\vibevault\vibevault
$env:DATABASE_URL="postgresql://postgres:Uk1Er8b6@db.jobjysodomnblmgadyjz.supabase.co:5432/postgres?sslmode=require"
npm run db:push
```

---

## 🎯 Hızlı Çözüm (Tüm Komutlar Tek Seferde)

```powershell
cd C:\Users\basak\Github\vibevault\vibevault
vercel env pull .env.local
npm run db:push
```

Eğer `vercel env pull` çalışmazsa:

```powershell
cd C:\Users\basak\Github\vibevault\vibevault
$env:DATABASE_URL="postgresql://postgres:Uk1Er8b6@db.jobjysodomnblmgadyjz.supabase.co:5432/postgres?sslmode=require"
npm run db:push
```

