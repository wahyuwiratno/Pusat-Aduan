import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";

import { ticketsApi } from "../api/tickets";

import { useToast } from "../components/ui/Toast";
import { labels } from "../config/labels";

import { ArrowLeft, PlusCircle, MapPin, Tag, AlertTriangle, FileText } from "lucide-react";

export default function TicketCreate() {
  const nav = useNavigate();
  const { push } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);

    try {
      const payload = {
        title,
        description: description || undefined,
        category,
        priority,
        location: location || undefined,
      };

      const created = await ticketsApi.create(payload);

      push({
        tone: "success",
        title: "Aduan dibuat",
        message: `Aduan #${created?.id ?? ""} berhasil dibuat.`,
      });

      nav("/");
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Gagal membuat aduan";
      setErr(msg);
      push({ tone: "error", title: "Gagal membuat aduan", message: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      title="Buat Aduan"
      subtitle="Isi detail aduan dengan lengkap"
      right={
        <Link to="/">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} />
            Kembali
          </Button>
        </Link>
      }
    >
      <Card className="p-6 space-y-4 wow-enter">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">Form Aduan</div>
            <div className="mt-1 text-sm text-gray-600">
              Pastikan judul jelas, dan jelaskan kronologi singkat pada deskripsi.
            </div>
          </div>

          <Badge tone="blue" className="shrink-0">
            Baru
          </Badge>
        </div>

        {err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="min-w-0">{err}</div>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Judul */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <FileText size={16} className="text-blue-700" />
              Judul Aduan
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Internet mati di ruang kelas A"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <FileText size={16} className="text-blue-700" />
              Deskripsi
            </div>
            {/* Kalau komponen Textarea tidak ada di ui/Input kamu, ganti dengan <textarea ...> biasa */}
            {Textarea ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail aduan (opsional, tapi sangat membantu)."
                rows={5}
              />
            ) : (
              <textarea
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail aduan (opsional, tapi sangat membantu)."
                rows={5}
              />
            )}
          </div>

          {/* Grid: desktop 2 kolom, mobile 1 kolom (tampilan desktop tidak berubah) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jenis Aduan */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Tag size={16} className="text-blue-700" />
                Jenis Aduan
              </div>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: network / fasilitas / administrasi"
                required
              />
            </div>

            {/* Prioritas */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <AlertTriangle size={16} className="text-blue-700" />
                Prioritas
              </div>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </Select>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <MapPin size={16} className="text-blue-700" />
              Lokasi (opsional)
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gedung A, Lantai 2, Ruang 203"
            />
          </div>

          {/* Actions: mobile stack, desktop tetap inline (tanpa ubah look desktop) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="secondary" className="gap-2 w-full sm:w-auto" type="button">
                <ArrowLeft size={16} />
                Batal
              </Button>
            </Link>

            <Button
              className="gap-2 w-full sm:w-auto"
              type="submit"
              disabled={saving}
            >
              <PlusCircle size={16} />
              {saving ? "Menyimpan..." : (labels?.createEntity || "Buat Aduan")}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
