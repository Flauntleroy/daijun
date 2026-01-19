# Laporan Kinerja Harian

Sistem penginputan Laporan Kinerja Harian menggunakan Next.js 14, shadcn/ui, dan Vercel.

## Fitur

- ✅ Form input lengkap (tanggal, kegiatan, jam, volume, hasil, file)
- ✅ CRUD laporan (Create, Read, Update, Delete)
- ✅ Filter dan pencarian
- ✅ Export ke CSV dan PDF
- ✅ Upload file (Vercel Blob)
- ✅ Autentikasi (username/password)
- ✅ Responsive design

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob
- **Auth**: NextAuth.js

## Deployment ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login
2. Click "Add New" → "Project"
3. Import repository dari GitHub
4. Click "Deploy"

### 3. Setup Database

1. Di Vercel Dashboard, buka project Anda
2. Pergi ke tab "Storage"
3. Click "Create Database" → "Postgres"
4. Ikuti wizard untuk membuat database
5. Environment variables akan otomatis ditambahkan

### 4. Setup Blob Storage

1. Di tab "Storage" yang sama
2. Click "Create" → "Blob"
3. Token akan otomatis ditambahkan ke environment variables

### 5. Tambah Environment Variables

Di Vercel Dashboard → Settings → Environment Variables:

```
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://your-app.vercel.app
```

Generate secret dengan: `openssl rand -base64 32`

### 6. Setup Database Schema

1. Di Vercel Dashboard, buka Postgres database
2. Pergi ke tab "Query"
3. Copy dan jalankan isi file `src/lib/db-schema.sql`
4. Atau gunakan endpoint `/api/seed` untuk auto-create tables

### 7. Redeploy

Setelah setup selesai, trigger redeploy dari Vercel Dashboard.

## Development Lokal

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local dengan kredensial Anda

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Login Default

- **Username**: admin
- **Password**: admin123

> ⚠️ Ganti password default setelah deployment!

## Struktur Project

```
src/
├── app/
│   ├── api/auth/          # NextAuth API
│   ├── actions/           # Server Actions
│   ├── dashboard/         # Protected pages
│   └── login/             # Auth page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Sidebar, Header
│   └── laporan/           # Form, Table, Filter
└── lib/                   # Utilities
```

## License

MIT
