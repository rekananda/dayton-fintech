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
- **State Management**: React Context API
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

## 📁 Struktur Folder

```
dayton-fintech/
├── app/
│   ├── backoffice/
│   │   ├── login/
│   │   │   └── page.tsx          # Halaman login admin
│   │   ├── register/
│   │   │   └── page.tsx          # Halaman register admin
│   │   ├── change-password/
│   │   │   └── page.tsx          # Halaman ubah password
│   │   ├── layout.tsx             # Layout backoffice dengan sidebar
│   │   └── page.tsx               # Dashboard backoffice
│   ├── layout.tsx                 # Root layout dengan providers
│   ├── page.tsx                   # Landing page
│   ├── providers.tsx              # App providers (Mantine, Auth, dll)
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
│   │   └── Text/                  # Text components
│   └── layouts/                   # Layout components
│       ├── AppHeader.tsx          # Header component
│       ├── AppFooter.tsx          # Footer component
│       ├── LandingLayout.tsx      # Layout untuk landing page
│       └── BackofficeLayout.tsx   # Layout untuk backoffice
├── config/
│   └── mantineTheme.ts            # Mantine theme configuration
├── hooks/
│   └── useViewport.tsx            # Custom hook untuk viewport detection
├── lib/
│   └── auth-context.tsx           # Auth context & provider
├── variables/
│   ├── dummy.ts                   # Dummy data
│   └── dummyTable.tsx             # Dummy table data
├── public/
│   ├── logo.png                   # Logo aplikasi
│   └── favicon.ico                # Favicon
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS config (Mantine + Tailwind)
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## 🔐 Autentikasi

### Demo Credentials

Untuk login ke backoffice, gunakan kredensial berikut:

- **Username**: `admin`
- **Password**: `admin`

Atau daftar akun admin baru di halaman register!

### Cara Kerja

1. **Login**: User memasukkan username dan password di `/backoffice/login`
   - Default admin: username `admin`, password `admin`
   - Atau gunakan akun yang sudah didaftarkan
2. **Registrasi**: Daftar akun admin baru di `/backoffice/register`
   - Data disimpan di localStorage browser
   - Email/username tidak boleh duplikat
3. **Validasi**: Sistem memvalidasi credentials dari localStorage
4. **Session**: Token disimpan di localStorage dan cookie
5. **Redirect**: User yang tidak login akan diredirect ke login page
6. **Ubah Password**: Admin dapat mengubah password di `/backoffice/change-password`

### Security Notes

⚠️ **PENTING**: Implementasi autentikasi ini adalah untuk demo/development saja.

Untuk production, Anda harus:
- Menggunakan API backend yang proper
- Implement JWT atau session-based auth
- Enkripsi password dengan bcrypt
- Gunakan HTTPS
- Implement rate limiting
- Tambahkan CSRF protection
- Gunakan secure cookies

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
| `/backoffice/users` | Manajemen pengguna (coming soon) |
| `/backoffice/transactions` | Manajemen transaksi (coming soon) |
| `/backoffice/reports` | Laporan dan analytics (coming soon) |
| `/backoffice/settings` | Pengaturan sistem (coming soon) |


## 🎨 Customization

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
- [ ] Implementasi halaman Users Management
- [ ] Implementasi halaman Transactions
- [ ] Implementasi halaman Reports dengan charts
- [ ] Implementasi halaman Settings
- [ ] Integrasi dengan backend API
- [ ] Implementasi proper authentication (JWT)
- [ ] Unit tests
- [ ] E2E tests
- [x] Dark mode support (sudah ada di theme)
- [ ] Multi-language support

## 👨‍💻 Development Team

Developed by Dayton Fintech Team

---

Made with ❤️ using Next.js, Mantine UI, and Tailwind CSS
