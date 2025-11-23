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
- **Registrasi Admin**: Fitur pendaftaran admin baru dengan validasi
- **Ubah Password**: Fitur untuk mengubah password akun
- **Dashboard**: Statistik real-time, grafik transaksi, dan pertumbuhan pengguna
- **Sidebar Navigation**: Navigasi yang mudah dengan menu sidebar
- **Protected Routes**: Middleware untuk melindungi halaman admin
- **Responsive Layout**: Tampilan optimal di desktop dan mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Mantine UI v8.3.7
- **Material UI**: MUI v7.3.5 (untuk komponen tambahan)
- **Styling**: Tailwind CSS v4
- **Icons**: Tabler Icons React v3.35.0
- **TypeScript**: Full type safety
- **State Management**: Redux Toolkit + React Context API
- **Database**: PostgreSQL dengan Prisma ORM
- **Database Adapter**: PrismaPg (pg Pool)
- **Authentication**: JWT (jose) + bcryptjs untuk password hashing
- **Carousel**: Embla Carousel dengan Autoplay
- **Charts**: Recharts & Mantine Charts
- **Form Management**: Mantine Form
- **Date Management**: Day.js
- **Data Table**: Mantine DataTable
- **Date Picker**: Mantine Dates
- **File Upload**: Mantine Dropzone
- **Notifications**: Mantine Notifications
- **Progress**: Mantine NProgress

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
   
   # NextAuth (jika digunakan)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="ganti-dengan-secret-yang-kuat"
   ```

   **Catatan untuk Supabase:**
   - Gunakan `sslmode=require` atau `sslmode=prefer` untuk development
   - Untuk production, gunakan `sslmode=verify-full` dengan certificate

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

5. **Database Setup Scripts**

   ```bash
   # Setup lengkap untuk development
   npm run db:setup-dev
   
   # Setup lengkap untuk staging/production
   npm run db:setup
   
   # Test koneksi database
   npm run db:test
   ```

6. **Prisma Studio (GUI untuk Database)**

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
- **Event**: Event management
- **Legal**: Legal documents
- **QnA**: Question & Answer
- **Config**: Application configuration

## 📁 Struktur Folder

```
dayton-fintech/
├── app/
│   ├── api/                       # API Routes
│   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── login/             # POST /api/auth/login
│   │   │   ├── register/          # POST /api/auth/register
│   │   │   ├── change-password/   # POST /api/auth/change-password
│   │   │   └── session/           # GET /api/auth/session
│   │   ├── landing/               # Landing page API
│   │   └── menus/                 # Menu management API
│   ├── backoffice/                # Backoffice pages
│   │   ├── login/                 # Halaman login admin
│   │   ├── register/              # Halaman register admin
│   │   ├── change-password/       # Halaman ubah password
│   │   ├── menus/                 # Menu management
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
│   │   ├── Cards/                 # Card components (RippleCard, TimelineCard)
│   │   ├── Carousel/              # Carousel component
│   │   ├── Menus/                 # Menu components
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
│   └── landingSlice.ts            # Landing page Redux slice
├── hooks/
│   └── useViewport.tsx            # Custom hook untuk viewport detection
├── variables/
│   └── dummyData.ts               # Dummy data
├── public/
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

5. **Protected Routes**
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
- Password validation

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
| `/backoffice/change-password` | Ubah password - Halaman untuk mengubah password |
| `/backoffice/menus` | Manajemen menu untuk landing page |
| `/backoffice/users` | Manajemen pengguna (coming soon) |
| `/backoffice/transactions` | Manajemen transaksi (coming soon) |
| `/backoffice/reports` | Laporan dan analytics (coming soon) |
| `/backoffice/settings` | Pengaturan sistem (coming soon) |

### API Routes

| Endpoint | Method | Deskripsi | Auth Required |
|----------|--------|-----------|---------------|
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/register` | POST | Registrasi user baru | ❌ |
| `/api/auth/session` | GET | Get current session | ✅ |
| `/api/auth/change-password` | POST | Ubah password | ✅ |
| `/api/landing` | GET | Data untuk landing page | ❌ |
| `/api/menus` | GET, POST | Get/Create menus | ✅ |
| `/api/menus/[id]` | GET, PUT, DELETE | Get/Update/Delete menu | ✅ |


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

### Tailwind Config

Tailwind v4 menggunakan CSS variables. Edit di `app/globals.css` dan `tailwind.config.ts`.

### Komponen Custom

Aplikasi menggunakan **Atomic Design Pattern**:
- **Atoms**: Komponen terkecil (Logo, Button, Icon, Text, dll)
- **Molecules**: Kombinasi atoms (Cards, Carousel, Menus)
- **Layouts**: Layout components (LandingLayout, BackofficeLayout)

Semua komponen custom berada di folder `components/` dengan struktur yang terorganisir.

### Path Aliases

TypeScript path aliases dikonfigurasi di `tsconfig.json`:
- `@/*` → root directory

Contoh penggunaan:
```tsx
import { prisma } from '@/config/prisma';
import { useAuth } from '@/config/auth-context';
import { useAppSelector } from '@/store/hooks';
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
- [x] Database schema dan migrations
- [ ] Implementasi halaman Users Management
- [ ] Implementasi halaman Transactions
- [ ] Implementasi halaman Reports dengan charts
- [ ] Implementasi halaman Settings
- [ ] Unit tests
- [ ] E2E tests
- [x] Dark mode support (sudah ada di theme)
- [ ] Multi-language support
- [ ] Refresh token mechanism
- [ ] Rate limiting untuk API
- [ ] Email verification

## 👨‍💻 Development Team

Developed by Dayton Fintech Team

---

Made with ❤️ using Next.js, Mantine UI, and Tailwind CSS
