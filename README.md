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
- Menampilkan fitur-fitur utama platform
- Statistik dan informasi perusahaan
- Call-to-action untuk pendaftaran
- Desain modern dengan gradient dan animasi

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
- **UI Library**: Mantine UI v8.3.6
- **Styling**: Tailwind CSS v4
- **Icons**: Tabler Icons React
- **TypeScript**: Full type safety
- **State Management**: React Context API
- **Carousel**: Embla Carousel
- **Charts**: Recharts
- **Form Management**: Mantine Form

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
│   └── globals.css                # Global styles
├── lib/
│   └── auth-context.tsx           # Auth context & provider
├── middleware.ts                  # Route protection middleware
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS config (Mantine + Tailwind)
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
5. **Middleware**: Middleware memeriksa cookie untuk proteksi route
6. **Redirect**: User yang tidak login akan diredirect ke login page
7. **Ubah Password**: Admin dapat mengubah password di `/backoffice/change-password`

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

## 💻 Pengembangan

### Menambah Halaman Baru

**1. Halaman Public:**

```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

**2. Halaman Backoffice (Protected):**

```tsx
// app/backoffice/new-feature/page.tsx
'use client';

export default function NewFeaturePage() {
  return <div>Protected Content</div>;
}
```

Tambahkan route di navigation array di `app/backoffice/layout.tsx`.

### Menggunakan Mantine Components

```tsx
import { Button, Card, Text } from '@mantine/core';

export default function Example() {
  return (
    <Card>
      <Text>Hello World</Text>
      <Button>Click Me</Button>
    </Card>
  );
}
```

### Menggunakan Tailwind

```tsx
export default function Example() {
  return (
    <div className="flex items-center justify-center p-4 bg-blue-500">
      <h1 className="text-white text-2xl">Tailwind Styling</h1>
    </div>
  );
}
```

### Kombinasi Mantine + Tailwind

```tsx
import { Button } from '@mantine/core';

export default function Example() {
  return (
    <div className="flex gap-4 p-8">
      <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
        Mantine Button with Tailwind
      </Button>
    </div>
  );
}
```

## 🎨 Customization

### Theme Mantine

Edit di `app/layout.tsx`:

```tsx
const theme = createTheme({
  fontFamily: 'var(--font-geist-sans), sans-serif',
  primaryColor: 'blue',
  // tambah customization lainnya
});
```

### Tailwind Config

Tailwind v4 menggunakan CSS variables. Edit di `app/globals.css`.

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

## 📝 TODO / Roadmap

- [ ] Implementasi halaman Users Management
- [ ] Implementasi halaman Transactions
- [ ] Implementasi halaman Reports dengan charts
- [ ] Implementasi halaman Settings
- [ ] Integrasi dengan backend API
- [ ] Implementasi proper authentication (JWT)
- [ ] Unit tests
- [ ] E2E tests
- [ ] Dark mode toggle
- [ ] Multi-language support

## 👨‍💻 Development Team

Developed by Dayton Fintech Team

---

Made with ❤️ using Next.js, Mantine UI, and Tailwind CSS
