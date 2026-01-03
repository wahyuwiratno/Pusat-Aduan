# Pusat Aduan

Repositori ini berisi aplikasi helpdesk sederhana untuk mengelola tiket aduan warga.
Stack ini terdiri dari backend Express + Prisma (SQLite) dan frontend React + Vite.

## Struktur Proyek
- `helpdesk_backend/` – REST API dengan Express, autentikasi JWT, dan Prisma.
- `helpdesk-frontend/` – aplikasi React yang memanggil API dan menampilkan dashboard tiket.

## Prasyarat
- Node.js 18 atau lebih baru
- NPM

## Menjalankan Backend
1. Masuk ke folder backend dan pasang dependensi:
   ```bash
   cd helpdesk_backend
   npm install
   ```
2. Buat file `.env` untuk konfigurasi penting (contoh):
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="ganti-dengan-secret"
   ```
   `DATABASE_URL` default-nya adalah SQLite lokal; ganti jika ingin DB lain.
3. Sinkronkan skema database:
   ```bash
   npx prisma db push
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   API akan tersedia di `http://localhost:4000` (lihat `src/server.js`).

> Catatan peran: pengguna baru otomatis berperan `user`. Untuk membuat staf,
> ubah kolom `role` ke `staff` langsung di database.

## Menjalankan Frontend
1. Masuk ke folder frontend dan pasang dependensi:
   ```bash
   cd helpdesk-frontend
   npm install
   ```
2. Buat file `.env` untuk mengatur alamat API:
   ```env
   VITE_API_URL="http://localhost:4000"
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
   Secara bawaan Vite berjalan di `http://localhost:5173` dengan opsi `--host`.

## Fitur Utama
- Registrasi, login, dan penyimpanan token JWT di `localStorage` untuk semua permintaan API.
- Pengguna dapat membuat tiket dengan judul, deskripsi, kategori, prioritas, dan lokasi.
- Staf dapat melihat seluruh tiket, memperbarui status, serta memantau ringkasan dashboard.
- Validasi request menggunakan Zod di backend dan proteksi rute di frontend.

## Skrip Penting
- Backend: `npm run dev` untuk menjalankan API dengan `nodemon`.
- Frontend: `npm run dev` untuk menjalankan Vite dev server, `npm run build` untuk produksi.
