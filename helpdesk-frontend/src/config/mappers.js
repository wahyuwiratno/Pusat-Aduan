export function statusLabel(s) {
  if (s === "open") return "Baru";
  if (s === "in_progress") return "Diproses";
  if (s === "resolved") return "Selesai";
  if (s === "closed") return "Ditutup";
  return s;
}

export function priorityLabel(p) {
  if (p === "low") return "Rendah";
  if (p === "medium") return "Sedang";
  if (p === "high") return "Tinggi";
  return p;
}

// (opsional) label kategori agar lebih publik
export function categoryLabel(c) {
  if (!c) return "Tidak ada";
  const x = String(c).toLowerCase();
  if (x === "network") return "Jaringan";
  if (x === "hardware") return "Perangkat";
  if (x === "software") return "Aplikasi";
  if (x === "access") return "Akses Akun";
  if (x === "uncategorized") return "Lainnya";
  return c;
}
