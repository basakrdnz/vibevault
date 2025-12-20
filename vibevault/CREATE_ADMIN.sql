-- VibeVault Admin Hesabı Oluşturma
-- Supabase SQL Editor'de çalıştırın

-- Eğer admin kullanıcısı varsa önce sil (yeniden oluşturmak için)
DELETE FROM "users" WHERE email = 'admin@vibevault.com';

-- Admin kullanıcısı oluştur
-- Email: admin@vibevault.com
-- Password: admin123 (bcrypt hash ile)
INSERT INTO "users" (
    "id",
    "email",
    "password",
    "name",
    "emailVerified",
    "image",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid()::text,  -- PostgreSQL UUID oluştur
    'admin@vibevault.com',
    '$2b$12$rC8cKTuqshMGvOP7PTkRWuYPOz/F7Oji8T.IToPJyUHjPQm/x5fBu',  -- admin123 (bcrypt hash, salt rounds: 12)
    'Admin User',
    NOW(),  -- Email verified olarak işaretle
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO NOTHING;  -- Eğer email zaten varsa hata verme

-- Kontrol için admin kullanıcısını göster
SELECT id, email, name, "emailVerified", "createdAt" 
FROM "users" 
WHERE email = 'admin@vibevault.com';


