-- Admin kullanıcısını kontrol et
-- Supabase SQL Editor'de çalıştırın

SELECT 
    id, 
    email, 
    name, 
    "emailVerified", 
    "createdAt",
    CASE 
        WHEN password IS NOT NULL THEN 'Password exists' 
        ELSE 'No password' 
    END as password_status
FROM "users" 
WHERE email = 'admin@vibevault.com';

-- Eğer sonuç boşsa, admin kullanıcısı yok demektir
-- CREATE_ADMIN.sql script'ini çalıştırmanız gerekiyor

