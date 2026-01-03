# Pusat Aduan - Frontend

Front-end Pusat Aduan dibangun dengan React + Vite dan terhubung ke backend Express/Prisma (PostgreSQL).

## Konfigurasi Environment

1. Salin file contoh environment:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan `VITE_API_URL` jika backend berjalan di host/port lain (default `http://localhost:4000`).

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` secara default.
