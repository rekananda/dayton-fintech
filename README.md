# 🚀 Dayton Fintech

Platform fintech modern yang dibangun dengan Next.js 16, Mantine UI, dan Tailwind CSS.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Folder](#-struktur-folder)
- [Autentikasi](#-autentikasi)
- [Route](#-route)
- [Pengembangan](#-pengembangan)
- [Database & Prisma](#-database--prisma)

## ✨ Fitur

### Landing Page
- Halaman landing yang menarik dan responsive
- Menampilkan fitur-fitur utama platform dengan Carousel
- Statistik dan informasi perusahaan
- Call-to-action untuk pendaftaran
- Desain modern dengan gradient dan animasi
- Komponen Logo custom
- Navigation menu yang responsif
- Footer dengan informasi lengkap
- Ripple effect dan ornament effects
- Atomic Design Pattern untuk struktur komponen

### Backoffice (Admin Panel)
- **Sistem Autentikasi**: Login untuk admin dengan proteksi route
- **Registrasi Admin**: Fitur pendaftaran admin baru dengan validasi Zod
- **Profile Management**: Fitur untuk mengubah data profile (email, username, name)
- **Ubah Password**: Fitur untuk mengubah password akun dengan validasi Zod
- **Dashboard**: Statistik real-time, grafik transaksi, dan pertumbuhan pengguna
- **Sidebar Navigation**: Navigasi yang mudah dengan menu sidebar
- **Protected Routes**: Middleware untuk melindungi halaman admin
- **Responsive Layout**: Tampilan optimal di desktop dan mobile
- **Event Management**: CRUD lengkap untuk event dengan Google Drive image upload
- **Menu Management**: Manajemen menu untuk landing page
- **FAQ Management**: Manajemen pertanyaan dan jawaban
- **Legal Management**: Manajemen dokumen legal
- **Config Management**: Pengaturan konfigurasi aplikasi
- **Schema Management**: Manajemen schema/form builder
- **Business Models**: Manajemen business model dengan nested tables
  - Create, edit, dan delete business models dengan title, description, tags, dan TNC
  - Manage tables untuk setiap business model dengan dynamic columns dan rows
  - Table editor dengan inline cell editing dan validasi key kolom
  - Dynamic column definition dengan key (machine-readable) dan label (human-readable)
  - Validasi duplicate key columns dengan error display di field input
  - Support untuk multiple tables per business model
  - Flexible table data structure untuk berbagai tipe data
- **Image Storage Management**: Upload dan manajemen file gambar dengan dua opsi storage
  - **Google Drive Integration** (opsional):
    - Upload file ke Google Drive dengan OAuth 2.0
    - Auto-delete file dari Drive saat event dihapus
    - Auto-refresh token mechanism
  - **Local Storage** (default):
    - Upload file ke local server di `public/events/img/`
    - Storage limit management (default: 5GB, dapat dikonfigurasi)
    - Auto-delete file dari local storage saat event dihapus
    - Real-time storage status dengan format otomatis (GB/MB/KB)
    - Warning saat storage limit tercapai
  - Support input URL eksternal (tidak harus upload)
  - Toggle storage method melalui config (`useLocalStorage` di `config/index.ts`)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Mantine UI v8.3.9
- **Material UI**: MUI v7.3.5 (untuk komponen tambahan)
- **Styling**: Tailwind CSS v4
- **Icons**: Tabler Icons React v3.35.0
- **TypeScript**: Full type safety
- **State Management**: Redux Toolkit + React Context API
- **Database**: PostgreSQL dengan Prisma ORM
- **Database Adapter**: PrismaPg (pg Pool)
- **Authentication**: JWT (jose) + bcryptjs untuk password hashing
- **Carousel**: Embla Carousel dengan Autoplay
- **Charts**: Recharts & Mantine Charts v8.3.9
- **Form Management**: Mantine Form v8.3.9 dengan Zod validation
- **Date Management**: Day.js
- **Data Table**: Mantine DataTable v8.3.8
- **Date Picker**: Mantine Dates v8.3.9
- **File Upload**: Mantine Dropzone v8.3.9
- **Notifications**: Mantine Notifications v8.3.9
- **Progress**: Mantine NProgress v8.3.9
- **Google APIs**: Google Drive API dengan OAuth 2.0 untuk file upload
- **Date/Time**: Mantine Dates (DateTimePicker) v8.3.9

## 📦 Instalasi

```bash
# Clone repository (jika dari git)
git clone <repository-url>

# Masuk ke direktori project
cd dayton-fintech

# Install dependencies
npm install
```

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

### Linting

```bash
npm run lint
```

### Database Scripts

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (development)
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate-deploy

# Reset database (development only)
npm run prisma:migrate-reset

# Push schema ke database (development)
npm run prisma:push

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## 🗄️ Database & Prisma

Aplikasi menggunakan PostgreSQL dengan Prisma ORM. Setup database menggunakan PrismaPg adapter dengan connection pooling.

### Setup Database

1. **Siapkan Database PostgreSQL**
   - Rekomendasi: Neon, Supabase, atau PostgreSQL lokal
   - Pastikan database sudah dibuat dan siap digunakan

2. **Konfigurasi Environment Variables**
   
   Tambahkan file `.env` di root project:

   ```env
   # Database Connection (Prisma menggunakan DATABASE_URL)
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   
   # JWT Configuration untuk Authentication
   JWT_SECRET="ganti-dengan-secret-jwt-yang-kuat"
   JWT_EXPIRES_IN="1d"  # Opsional: default 1d
   
   # Google Drive OAuth Configuration (opsional - hanya jika menggunakan Google Drive)
   # Jika menggunakan local storage, tidak perlu setup Google Drive
   GOOGLE_OAUTH_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_OAUTH_CLIENT_SECRET="your-google-oauth-client-secret"
   GOOGLE_OAUTH_REDIRECT_URI="http://localhost:3000/api/upload/gdrive/callback"
   GOOGLE_DRIVE_FOLDER_ID="your-google-drive-folder-id"
   
   # Next.js Public URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
   
   **Catatan Storage Configuration:**
   - Storage method dikonfigurasi di `config/index.ts`:
     - `useLocalStorage: true` → menggunakan local storage (default)
     - `useLocalStorage: false` → menggunakan Google Drive
   - Storage limit dapat dikonfigurasi di `config/index.ts`:
     - `maxStorageSize: 5 * 1024 * 1024 * 1024` → 5GB (default, dapat diubah)
   - File local storage disimpan di `public/events/img/`
   - Jika menggunakan local storage, tidak perlu setup Google Drive OAuth

   **Catatan untuk Supabase:**
   - Gunakan `sslmode=require` atau `sslmode=prefer` untuk development
   - Untuk production, gunakan `sslmode=verify-full` dengan certificate
   - Jika menggunakan Supabase, tambahkan juga key berikut:
   
   ```env
   # Supabase Configuration (jika menggunakan Supabase)
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
   
   Untuk mendapatkan key Supabase:
   1. Login ke [Supabase Dashboard](https://app.supabase.com/)
   2. Pilih project Anda
   3. Masuk ke Settings → API
   4. Copy **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL`
   5. Copy **anon/public** key ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Generate Prisma Client dan Setup Database**

   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Push schema ke database (development)
   npm run prisma:push
   
   # Atau jalankan migrations (production)
   npm run prisma:migrate-deploy
   ```

4. **Seed Database (Opsional)**

   ```bash
   # Seed database dengan data awal
   npm run prisma:seed
   ```

5. **Setup Google Drive OAuth (Opsional - untuk upload images)**

   Untuk menggunakan fitur upload gambar ke Google Drive, pastikan sudah menambahkan environment variables yang diperlukan (lihat step 2).
   
   Setup OAuth:
   
   a. Buat Google Cloud Project di [Google Cloud Console](https://console.cloud.google.com/)
   
   b. Aktifkan Google Drive API
   
   c. Buat OAuth 2.0 Credentials:
      - Type: Web application
      - Authorized redirect URI: `http://localhost:3000/api/upload/gdrive/callback`
   
   d. Buat folder di Google Drive untuk menyimpan upload images
   
   e. Copy Client ID dan Client Secret ke environment variables
   
   f. Copy Folder ID dari URL Google Drive folder

6. **Storage Configuration**

   Aplikasi mendukung dua metode storage untuk images:
   
   **a. Local Storage (Default & Recommended)**
   - Tidak perlu setup tambahan
   - File disimpan di `public/events/img/`
   - Storage limit: 5GB (dapat dikonfigurasi di `config/index.ts`)
   - Real-time storage status di UI
   - Auto-delete file saat event dihapus
   
   **b. Google Drive (Opsional)**
   - Memerlukan setup OAuth credentials (lihat step 2)
   - Setelah setup OAuth credentials:
     - Login ke backoffice
     - Masuk ke halaman Events (`/backoffice/events`)
     - Klik tombol "Hubungkan Google Drive"
     - Authorize aplikasi untuk akses Google Drive
     - Token akan disimpan di database dan auto-refresh saat expired
   
   **Mengubah Storage Method:**
   - Edit file `config/index.ts`
   - Set `useLocalStorage: true` untuk local storage
   - Set `useLocalStorage: false` untuk Google Drive

7. **Database Setup Scripts**

   ```bash
   # Setup lengkap untuk development
   npm run db:setup-dev
   
   # Setup lengkap untuk staging/production
   npm run db:setup
   
   # Test koneksi database
   npm run db:test
   ```

8. **Prisma Studio (GUI untuk Database)**

   ```bash
   npm run prisma:studio
   ```

   Buka browser di `http://localhost:5555` untuk melihat dan mengelola data.

### Prisma Configuration

- **Schema Location**: `config/prisma/schema.prisma`
- **Migrations**: `config/prisma/migrations/`
- **Client**: Menggunakan PrismaPg adapter dengan connection pooling
- **SSL**: Auto-configured berdasarkan `sslmode` parameter di DATABASE_URL
- **IPv4**: Force IPv4 untuk menghindari ENETUNREACH errors

### Database Models

Aplikasi memiliki beberapa model utama:
- **User**: Autentikasi admin dengan role-based access
- **Menu**: Menu navigation untuk landing page
- **Timeline**: Timeline events
- **BusinessModel**: Business model dengan nested tables
  - **BusinessModelTable**: Table dalam business model
  - **BusinessModelTableRow**: Baris dalam table
  - **BusinessModelTableColumn**: Kolom dalam table
  - **BusinessModelTableCell**: Cell dalam table
- **Event**: Event management dengan image upload
- **Legal**: Legal documents
- **QnA**: Question & Answer
- **Config**: Application configuration
- **GoogleDriveToken**: Token OAuth untuk akses Google Drive (per user)

## 📁 Struktur Folder

```
dayton-fintech/
├── app/
│   ├── api/                       # API Routes
│   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── login/             # POST /api/auth/login
│   │   │   ├── register/          # POST /api/auth/register
│   │   │   ├── profile/           # PUT /api/auth/profile
│   │   │   ├── change-password/   # POST /api/auth/change-password
│   │   │   └── session/           # GET /api/auth/session
│   │   ├── landing/               # GET /api/landing (data untuk landing page)
│   │   ├── menus/                 # GET, POST /api/menus (Menu management)
│   │   ├── events/                # GET, POST, PUT, DELETE /api/events (dengan auto-delete images)
│   │   ├── faqs/                  # GET, POST, PUT, DELETE /api/faqs
│   │   ├── legals/                # GET, POST, PUT, DELETE /api/legals
│   │   ├── configs/               # GET, POST, PUT, DELETE /api/configs
│   │   ├── schemas/               # GET, POST, PUT, DELETE /api/schemas
│   │   ├── business-models/       # GET, POST, PUT, DELETE /api/business-models
│   │   │   └── tables/            # GET, POST, PUT, DELETE /api/business-models/tables
│   │   └── upload/                # File upload endpoints
│   │       ├── gdrive/            # Google Drive upload (opsional)
│   │       │   ├── auth/          # GET /api/upload/gdrive/auth (OAuth URL)
│   │       │   ├── callback/      # GET /api/upload/gdrive/callback (OAuth callback)
│   │       │   ├── delete/        # POST /api/upload/gdrive/delete
│   │       │   ├── status/        # GET /api/upload/gdrive/status
│   │       │   ├── test/          # GET /api/upload/gdrive/test
│   │       │   └── route.ts       # POST /api/upload/gdrive (upload file)
│   │       ├── local/             # Local storage upload
│   │       │   ├── utils.ts       # Utility functions (delete, check size, etc.)
│   │       │   └── route.ts       # POST /api/upload/local (upload file)
│   │       └── storage-status/    # GET /api/upload/storage-status (storage info)
│   ├── backoffice/                # Backoffice pages (Protected)
│   │   ├── login/                 # Halaman login admin
│   │   ├── register/              # Halaman register admin
│   │   ├── profile/               # Halaman profile management
│   │   ├── change-password/       # Halaman ubah password
│   │   ├── menus/                 # Menu management
│   │   ├── events/                # Event management dengan image upload (local storage atau Google Drive)
│   │   ├── faqs/                  # FAQ management
│   │   ├── legals/                # Legal documents management
│   │   ├── configs/               # Configuration management
│   │   ├── schemas/               # Schema/form builder management
│   │   ├── business-models/       # Business model management
│   │   │   └── tables/            # Table editor untuk business model
│   │   ├── layout.tsx             # Layout backoffice dengan sidebar
│   │   └── page.tsx               # Dashboard backoffice
│   ├── layout.tsx                 # Root layout dengan providers
│   ├── page.tsx                   # Landing page
│   ├── providers.tsx              # App providers (Redux, Mantine, Auth)
│   ├── globals.css                # Global styles
│   ├── landingpage.css            # Styles khusus landing page
│   └── tailwind.css               # Tailwind CSS imports
├── components/
│   ├── Atoms/                     # Komponen atom (terkecil)
│   │   ├── Logo/                  # Komponen Logo
│   │   ├── Button/                # Button components
│   │   ├── Icon/                  # Icon components
│   │   ├── MainText/              # Text typography component
│   │   ├── Table/                 # Table component
│   │   ├── Accordion/             # Accordion component
│   │   └── Effect/                # Effect components (Ripple, Ornament)
│   ├── Molecules/                 # Komponen molekul
│   │   ├── Cards/                 # Card components
│   │   │   ├── RippleCard/        # Ripple effect card
│   │   │   ├── TimelineCard/      # Timeline card component
│   │   │   └── TableCard/         # Table card dengan CRUD operations
│   │   ├── Carousel/              # Carousel component dengan Google Calendar integration
│   │   ├── Forms/                 # Form components untuk CRUD
│   │   │   ├── EventForm/         # Form untuk event (upload/URL image)
│   │   │   ├── MenuForm/          # Form untuk menu
│   │   │   ├── LegalForm/         # Form untuk legal
│   │   │   ├── QnAForm/           # Form untuk FAQ
│   │   │   ├── ConfigForm/        # Form untuk config
│   │   │   ├── TimelineForm/      # Form untuk timeline
│   │   │   ├── BusinessModelForm/ # Form untuk business model
│   │   │   ├── ProfileForm/       # Form untuk profile management
│   │   │   ├── ChangePasswordForm/ # Form untuk change password
│   │   │   └── type.ts            # Shared form types
│   │   ├── Menus/                 # Menu components
│   │   │   ├── NavbarBackoffice/  # Navbar untuk backoffice
│   │   │   ├── NavbarLandingPage/ # Navbar untuk landing page
│   │   │   ├── MenuLandingPage/   # Menu component untuk landing
│   │   │   └── UserDropdown/      # User dropdown menu
│   │   ├── Tables/                # Table components
│   │   └── Text/                  # Text components
│   └── layouts/                   # Layout components
│       ├── AppHeader.tsx          # Header component
│       ├── AppFooter.tsx          # Footer component
│       ├── LandingLayout.tsx      # Layout untuk landing page
│       └── BackofficeLayout.tsx   # Layout untuk backoffice
├── config/                        # Configuration files
│   ├── prisma.ts                  # Prisma client instance
│   ├── prisma/                    # Prisma schema & migrations
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   ├── supabase/                  # Supabase client configuration
│   │   ├── client.ts              # Supabase client (browser)
│   │   ├── server.ts              # Supabase client (server)
│   │   └── middleware.ts          # Supabase middleware
│   ├── auth-context.tsx           # Auth context & provider
│   ├── jwt.ts                     # JWT utilities (sign/verify)
│   ├── mantineTheme.ts            # Mantine theme configuration
│   └── types.ts                   # Shared TypeScript types
├── store/                         # Redux store
│   ├── store.ts                   # Redux store configuration
│   ├── StoreProvider.tsx          # Redux Provider component
│   ├── hooks.ts                   # Typed Redux hooks
│   ├── landingSlice.ts            # Landing page Redux slice
│   ├── backofficeSlice.ts         # Backoffice state slice
│   ├── dataEventSlice.ts          # Event data slice
│   ├── dataMenuSlice.ts           # Menu data slice
│   ├── dataQnASlice.ts            # FAQ data slice
│   ├── dataLegalSlice.ts          # Legal data slice
│   ├── dataConfigSlice.ts         # Config data slice
│   ├── dataTimelineSlice.ts       # Timeline data slice
│   ├── dataBusinessModelSlice.ts  # Business model data slice
├── hooks/
│   ├── useViewport.tsx            # Custom hook untuk viewport detection
│   ├── useStorageStatus.tsx       # Custom hook untuk storage status dengan format size (GB/MB/KB)
│   └── validator/                 # Form validation hooks
│       ├── index.ts               # Validation schemas (zod)
│       ├── eventValidation.ts     # Event form validation
│       ├── profileValidation.ts  # Profile form validation
│       ├── changePasswordValidation.ts # Change password validation
│       ├── registerValidation.ts  # Register form validation
│       ├── loginValidation.ts     # Login form validation
│       ├── legalValidation.ts     # Legal form validation
│       ├── qnaValidation.ts       # QnA form validation
│       ├── menuValidation.ts      # Menu form validation
│       └── configValidation.ts    # Config form validation
├── variables/
│   └── dummyData.ts               # Dummy data
├── public/
│   ├── events/                    # Event images (jika menggunakan local storage)
│   │   └── img/                   # Uploaded event images
│   ├── logo.png                   # Logo aplikasi
│   └── favicon.ico                # Favicon
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS config (Mantine + Tailwind)
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── prisma.config.ts               # Prisma configuration
├── proxy.ts                       # Proxy configuration
└── package.json                   # Dependencies
```

## 🔐 Autentikasi

Aplikasi menggunakan JWT-based authentication dengan password hashing menggunakan bcryptjs.

### Cara Kerja

1. **Login** (`/backoffice/login`)
   - User memasukkan username dan password
   - API endpoint: `POST /api/auth/login`
   - Password divalidasi dengan bcryptjs
   - JWT token dibuat menggunakan library `jose`
   - Token disimpan di cookie (`auth_token`) dan user data di cookie (`auth_user`)

2. **Registrasi** (`/backoffice/register`)
   - Daftar akun admin baru
   - API endpoint: `POST /api/auth/register`
   - Email dan username harus unique
   - Password di-hash dengan bcryptjs sebelum disimpan ke database
   - Data disimpan di PostgreSQL melalui Prisma

3. **Session Management**
   - API endpoint: `GET /api/auth/session`
   - Memverifikasi JWT token dari cookie
   - Mengembalikan user data jika token valid

4. **Ubah Password** (`/backoffice/change-password`)
   - API endpoint: `POST /api/auth/change-password`
   - Memerlukan authentication token
   - Validasi password lama sebelum mengubah
   - Password baru di-hash dengan bcryptjs
   - Validasi menggunakan Zod schema

5. **Profile Management** (`/backoffice/profile`)
   - API endpoint: `PUT /api/auth/profile`
   - Memerlukan authentication token
   - Mengubah email, username, dan name
   - Validasi email format dan uniqueness
   - Validasi username uniqueness
   - Validasi menggunakan Zod schema
   - Username otomatis diubah menjadi lowercase

6. **Protected Routes**
   - Middleware memverifikasi JWT token
   - User yang tidak login akan diredirect ke `/backoffice/login`

### Authentication Flow

```
Login → API (/api/auth/login) → Verify Password (bcrypt) → Generate JWT → Set Cookie
                                                                    ↓
Protected Route → Check Cookie → Verify JWT → Allow Access / Redirect to Login
```

### JWT Configuration

- **Library**: `jose` (JWT signing & verification)
- **Algorithm**: HS256
- **Secret**: `JWT_SECRET` dari environment variable
- **Expiration**: `JWT_EXPIRES_IN` (default: 1d)
- **Token Payload**: `{ username, email, name, role, sub }`

### Security Features

✅ **Sudah Diimplementasikan:**
- Password hashing dengan bcryptjs
- JWT token-based authentication
- Secure cookie storage
- Token expiration
- Password validation dengan Zod
- Profile management dengan validasi Zod
- Form validation menggunakan Zod schema untuk semua form
- Username auto-lowercase pada profile form

⚠️ **Untuk Production, Pertimbangkan:**
- Rate limiting untuk API endpoints
- CSRF protection
- HTTPS only cookies
- Refresh token mechanism
- Account lockout setelah beberapa failed attempts
- Password strength requirements
- Email verification untuk registrasi

## 🗺️ Route

### Public Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Landing page - Halaman utama untuk pengunjung |
| `/backoffice/login` | Login page - Halaman login untuk admin |
| `/backoffice/register` | Register page - Halaman pendaftaran admin baru |

### Protected Routes (Require Authentication)

| Route | Deskripsi |
|-------|-----------|
| `/backoffice` | Dashboard - Overview dan statistik |
| `/backoffice/profile` | Profile management - Halaman untuk mengubah data profile |
| `/backoffice/change-password` | Ubah password - Halaman untuk mengubah password |
| `/backoffice/menus` | Manajemen menu untuk landing page |
| `/backoffice/events` | Manajemen event dengan Google Drive image upload |
| `/backoffice/faqs` | Manajemen FAQ (Pertanyaan & Jawaban) |
| `/backoffice/legals` | Manajemen dokumen legal |
| `/backoffice/configs` | Pengaturan konfigurasi aplikasi |
| `/backoffice/schemas` | Manajemen schema/form builder |
| `/backoffice/business-models` | Manajemen business model dengan nested tables |
| `/backoffice/profit-shares` | Manajemen profit sharing |
| `/backoffice/referral-shares` | Manajemen referral sharing |

### API Routes

| Endpoint | Method | Deskripsi | Auth Required |
|----------|--------|-----------|---------------|
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/register` | POST | Registrasi user baru | ❌ |
| `/api/auth/session` | GET | Get current session | ✅ |
| `/api/auth/profile` | PUT | Update profile (email, username, name) | ✅ |
| `/api/auth/change-password` | POST | Ubah password | ✅ |
| `/api/landing` | GET | Data untuk landing page | ❌ |
| `/api/menus` | GET, POST, PUT, DELETE | CRUD menus | ✅ |
| `/api/events` | GET, POST, PUT, DELETE | CRUD events dengan image upload | ✅ |
| `/api/faqs` | GET, POST, PUT, DELETE | CRUD FAQ | ✅ |
| `/api/legals` | GET, POST, PUT, DELETE | CRUD legal documents | ✅ |
| `/api/configs` | GET, POST, PUT, DELETE | CRUD configs | ✅ |
| `/api/schemas` | GET, POST, PUT, DELETE | CRUD schemas | ✅ |
| `/api/business-models` | GET, POST, PUT, DELETE | CRUD business models | ✅ |
| `/api/business-models/tables` | GET, POST, PUT, DELETE | CRUD tables untuk business model | ✅ |
| `/api/upload/local` | POST | Upload file ke local storage | ✅ |
| `/api/upload/storage-status` | GET | Get storage status (size, limit, remaining) | ✅ |
| `/api/upload/gdrive` | POST | Upload file ke Google Drive | ✅ |
| `/api/upload/gdrive/auth` | GET | Get Google OAuth URL | ✅ |
| `/api/upload/gdrive/callback` | GET | OAuth callback handler | ✅ |
| `/api/upload/gdrive/status` | GET | Check Google Drive connection status | ✅ |
| `/api/upload/gdrive/delete` | POST | Delete file dari Google Drive | ✅ |


## 🎨 Customization

### State Management

Aplikasi menggunakan **Redux Toolkit** untuk state management global:

- **Store Location**: `store/store.ts`
- **Provider**: `store/StoreProvider.tsx`
- **Typed Hooks**: `store/hooks.ts` (useAppDispatch, useAppSelector)
- **Slices**: `store/landingSlice.ts` (contoh slice untuk landing page)

Redux store di-wrap di `AppProviders` bersama dengan Mantine dan Auth providers.

### Theme Mantine

Theme Mantine dikonfigurasi di `config/mantineTheme.ts` dengan custom color palette:

- **Primary Color**: Custom orange color scheme untuk branding Dayton Fintech
- **Dark Mode**: Default dark mode dengan custom color variables
- **Typography**: Custom heading sizes dan font families
- **Breakpoints**: Custom breakpoints termasuk mobile breakpoint

Edit file `config/mantineTheme.ts` untuk mengubah theme:

```tsx
export const mantineColor: Record<ExtendedColors, MantineColorsTuple> = {
  primary: ["#fff4e1", "#ffe7cc", ...], // Custom primary colors
  // ... colors lainnya
}
```

Theme digunakan melalui `AppProviders` di `app/providers.tsx`.

### Storage Configuration

Aplikasi mendukung dua metode storage untuk images:

**1. Local Storage (Default)**
- File disimpan di `public/events/img/`
- Konfigurasi di `config/index.ts`:
  ```typescript
  useLocalStorage: true,  // Set ke true untuk local storage
  maxStorageSize: 5 * 1024 * 1024 * 1024,  // 5GB (dapat diubah)
  ```

**2. Google Drive (Opsional)**
- Memerlukan setup OAuth credentials (lihat Setup Database)
- Konfigurasi di `config/index.ts`:
  ```typescript
  useLocalStorage: false,  // Set ke false untuk Google Drive
  ```

**Storage Features:**
- Real-time storage monitoring dengan `useStorageStatus` hook
- Auto-format size (GB/MB/KB) berdasarkan ukuran
- Warning saat storage limit tercapai
- Auto-delete images saat event dihapus atau diupdate
- Storage status ditampilkan di UI (persentase penggunaan dan sisa ruang)

### Tailwind Config

Tailwind v4 menggunakan CSS variables. Edit di `app/globals.css` dan `tailwind.config.ts`.

### Komponen Custom

Aplikasi menggunakan **Atomic Design Pattern**:
- **Atoms**: Komponen terkecil (Logo, Button, Icon, Text, dll)
- **Molecules**: Kombinasi atoms (Cards, Carousel, Menus)
- **Layouts**: Layout components (LandingLayout, BackofficeLayout)

Semua komponen custom berada di folder `components/` dengan struktur yang terorganisir.

### Custom Hooks

Aplikasi menyediakan beberapa custom hooks:

**useStorageStatus** - Hook untuk monitoring storage status dengan format otomatis:
```tsx
import { useStorageStatus } from '@/hooks/useStorageStatus';

const {
  data,                    // Storage data lengkap (currentSize, maxSize, remaining, dll)
  isLoading,               // Loading state
  error,                   // Error state
  googleDriveConnected,     // Google Drive connection status (jika tidak pakai local storage)
  formatSize,              // Format bytes ke satuan tertentu
  getAutoFormattedRemaining, // Auto-format remaining space (GB/MB/KB)
  refresh,                 // Refresh storage status
} = useStorageStatus();

// Contoh penggunaan
<Text>
  Storage: {data?.usagePercent.toFixed(1)}% digunakan 
  ({getAutoFormattedRemaining()} tersisa)
</Text>
```

**useViewport** - Hook untuk deteksi viewport:
```tsx
import useViewport from '@/hooks/useViewport';

const { isMobile, isDesktop, isTablet } = useViewport();
```

### Path Aliases

TypeScript path aliases dikonfigurasi di `tsconfig.json`:
- `@/*` → root directory

Contoh penggunaan:
```tsx
import { prisma } from '@/config/prisma';
import { useAuth } from '@/config/auth-context';
import { useAppSelector } from '@/store/hooks';
import { useStorageStatus } from '@/hooks/useStorageStatus';
```

## 📚 Dokumentasi

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine UI Documentation](https://mantine.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tabler Icons](https://tabler-icons.io/)

## 🔧 Troubleshooting

### PostCSS Warning

Jika ada warning tentang PostCSS plugins, pastikan urutan plugin di `postcss.config.mjs` sudah benar:

1. `postcss-preset-mantine`
2. `postcss-simple-vars`
3. `@tailwindcss/postcss`

### Authentication Issues

Jika mengalami masalah login:
1. Clear browser cookies dan localStorage
2. Restart development server
3. Cek console browser untuk error messages

### Styling Conflicts

Jika ada conflict antara Mantine dan Tailwind:
- Gunakan Mantine untuk komponen UI
- Gunakan Tailwind untuk layout dan spacing
- Gunakan `className` untuk override styles jika perlu

### Theme Issues

Jika theme tidak ter-apply dengan benar:
1. Pastikan `AppProviders` sudah wrap di root layout
2. Cek `config/mantineTheme.ts` untuk konfigurasi theme
3. Pastikan semua Mantine CSS sudah di-import di `app/layout.tsx`
4. Restart development server setelah mengubah theme config

### Komponen Custom Tidak Muncul

Jika komponen custom tidak muncul atau error:
1. Pastikan path import benar (gunakan `@/` alias)
2. Cek TypeScript errors di terminal
3. Pastikan semua dependencies sudah terinstall dengan `npm install`
4. Pastikan struktur folder komponen sesuai dengan export/import

## 📝 TODO / Roadmap

- [x] Implementasi Atomic Design Pattern untuk komponen
- [x] Komponen Logo custom
- [x] Komponen Carousel dengan autoplay
- [x] Custom Mantine theme dengan primary color branding
- [x] Landing page dengan layout yang responsive
- [x] Custom hooks (useViewport)
- [x] Redux Toolkit untuk state management
- [x] Prisma ORM dengan PostgreSQL
- [x] JWT-based authentication dengan bcryptjs
- [x] API routes untuk authentication
- [x] Menu management API dan halaman
- [x] Event management dengan CRUD lengkap
- [x] FAQ, Legal, Config, Schema management
- [x] Image storage management dengan dua opsi (Local Storage & Google Drive)
- [x] Local storage dengan limit management (5GB default, dapat dikonfigurasi)
- [x] Storage status hook (`useStorageStatus`) dengan format otomatis (GB/MB/KB)
- [x] Real-time storage monitoring dan warning saat limit tercapai
- [x] Google Drive integration untuk upload images (opsional)
- [x] Google Calendar integration di Carousel
- [x] Auto-delete images (local storage & Google Drive) saat event dihapus
- [x] Support input URL eksternal untuk images
- [x] Auto-refresh Google Drive OAuth token
- [x] Business Model management dengan nested tables dan dynamic table editor
- [x] Table editor dengan validasi duplicate key columns
- [x] Flexible table data structure dengan DynamicTableDataT
- [x] Update semua @mantine packages ke versi 8.3.9
- [x] Profit Shares & Referral Shares management
- [x] Database schema dan migrations
- [x] Dark mode support (sudah ada di theme)
- [ ] Implementasi halaman Users Management
- [ ] Implementasi halaman Transactions
- [ ] Implementasi halaman Reports dengan charts
- [ ] Unit tests
- [ ] E2E tests
- [ ] Multi-language support
- [ ] Rate limiting untuk API
- [ ] Email verification
- [ ] Image optimization dan caching

## 👨‍💻 Development Team

Developed by Dayton Fintech Team
@github.com/rekananda

---

Made with ❤️ using Next.js, Mantine UI, and Tailwind CSS
