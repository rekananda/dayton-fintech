# Supabase Connection Guide

## Masalah: Prisma Migrate Lambat

Jika Anda mengalami masalah Prisma migrate yang sangat lambat ke Supabase, ini biasanya karena menggunakan **Transaction Mode** (port 6543) yang tidak optimal untuk migrations.

## Solusi: Gunakan Session Mode

### Perbedaan Mode Koneksi Supabase

Supabase menyediakan 3 mode koneksi:

#### 1. Transaction Mode (Port 6543) - Default
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- ✅ Sangat efisien untuk aplikasi runtime
- ✅ Connection pooling yang optimal
- ❌ **Lambat untuk migrations** (tidak mendukung prepared statements dengan baik)
- ❌ Tidak ideal untuk operasi DDL (CREATE, ALTER, DROP)

#### 2. Session Mode (Port 5432 via Pooler) - Recommended untuk Migrations
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```
- ✅ Lebih cepat untuk migrations
- ✅ Mendukung prepared statements
- ✅ Koneksi persisten
- ✅ Tidak memerlukan IPv6 (masih via pooler)
- ✅ Bisa digunakan untuk DBeaver dan tools lainnya
- ✅ Cocok untuk operasi DDL

#### 3. Direct Connection (Port 5432) - Tidak Direkomendasikan
```
postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
```
- ❌ Memerlukan IPv6 support
- ❌ Tidak bisa diakses dari beberapa jaringan/ISP
- ❌ DBeaver mungkin tidak bisa connect
- ❌ Tidak tersedia di semua region

## Setup Session Mode

### 1. Dapatkan Connection String dari Supabase Dashboard

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Settings** → **Database**
4. Scroll ke bagian **Connection string**
5. Pilih **Session mode** (bukan Transaction mode)
6. Copy connection string

### 2. Update `.env`

```env
# Gunakan Session Mode untuk migrations yang lebih cepat
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require"
```

**Perhatikan:**
- Port: **5432** (bukan 6543)
- Host: `*.pooler.supabase.com` (bukan `*.supabase.co`)
- Format: `postgres.[PROJECT_REF]:[PASSWORD]@...` (dengan dot setelah postgres)

### 3. Test Koneksi

```bash
# Test koneksi database
npm run db:test

# Jalankan migration (sekarang seharusnya lebih cepat)
npm run prisma:migrate
```

## Alternatif: Gunakan `prisma db push` untuk Development

Jika migrations masih lambat, gunakan `prisma db push` untuk development:

```bash
# Push schema langsung ke database (tidak membuat migration files)
npm run prisma:push
```

**Keuntungan:**
- ✅ Lebih cepat daripada migrate
- ✅ Cocok untuk development dan prototyping
- ✅ Tidak perlu membuat migration files

**Kekurangan:**
- ❌ Tidak ada migration history
- ❌ Tidak cocok untuk production
- ❌ Tidak bisa rollback

## DBeaver Configuration

Untuk connect DBeaver ke Supabase menggunakan Session Mode:

1. Buat connection baru di DBeaver
2. Pilih **PostgreSQL**
3. Isi connection details:
   - **Host**: `aws-0-[REGION].pooler.supabase.com`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres.[PROJECT_REF]`
   - **Password**: `[PASSWORD]`
4. Di tab **SSL**:
   - Enable SSL
   - SSL Mode: `require`
5. Test connection

## Troubleshooting

### Masih Lambat?

1. **Cek Connection String**
   - Pastikan menggunakan port **5432** (Session Mode)
   - Pastikan format username: `postgres.[PROJECT_REF]`

2. **Tingkatkan Timeout**
   ```env
   DATABASE_URL="postgresql://...?sslmode=require&connect_timeout=30"
   ```

3. **Gunakan `prisma db push`**
   - Untuk development, `db push` lebih cepat

4. **Cek Network Latency**
   - Pilih Supabase region yang terdekat
   - Untuk Indonesia: `ap-southeast-1` atau `ap-south-1`

### DBeaver Tidak Bisa Connect?

1. Pastikan menggunakan **Session Mode** (port 5432 via pooler)
2. Format username: `postgres.[PROJECT_REF]` (dengan dot)
3. Enable SSL dengan mode `require`
4. Jangan gunakan Direct Connection (memerlukan IPv6)

## Referensi

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma + Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)
- [Supabase Connection Modes](https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers)

