# Bila Tarım · Admin Entegrasyonu

Bu paket, ana tasarımı bozmadan **sağ üstte Admin Paneli** butonu ekler ve `admin.html` üzerinden
Supabase tabanlı ürün/kategori yönetimi sağlar.

## Dosyalar
- `FINALPROJE_STRICT_MODERN_FITSCREEN_FIYAT100_MODERN.html` — Ana sayfan (tasarım korunur, sağ üstte **Admin Paneli** butonu var)
- `admin.html` — Şifresiz admin paneli (ürün/kategori ekle, sil, düzenle)
- `supabase.js` — Supabase istemci kurulumu
- `admin.js` — CRUD işlemleri

## Supabase
- URL: `https://iwnhakegtvwfdisruogr.supabase.co`
- ANON KEY: `eyJhbGciOiJI...` (admin.html içinde CDN ile `@supabase/supabase-js@2` yüklenir)

### Tablo Şeması
```
categories: id (int, PK), name (text)
products  : id (int, PK), name (text), price (numeric), description (text), image_url (text), category_id (int, FK->categories.id)
```

> Not: Görsel yükleme için iki yol:
> 1) **Görsel URL** girin (önerilir)
> 2) Dosya seçin → resim **base64** olarak `image_url` alanına kaydedilir. (Storage ayarı yapana kadar pratik çözüm.)

## Kurulum
1) Bu klasörü aynen GitHub deposuna yükleyin.
2) Vercel'de depoyu import edin.
3) Canlıda güvenlik için **RLS/Auth** ayarlayın, şifresiz paneli kapatın.

