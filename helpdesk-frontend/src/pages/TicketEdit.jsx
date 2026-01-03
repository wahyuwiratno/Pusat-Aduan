import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { ticketsApi } from "../api/tickets";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../components/ui/Toast";
import { ArrowLeft, Save, Pencil } from "lucide-react";

export default function TicketEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { push } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await ticketsApi.get(id);
        if (!alive) return;

        setTicket(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setPriority(data.priority || "medium");
        setLocation(data.location || "");
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "Gagal memuat data aduan");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, [id]);

  const canEdit = user?.role === "staff" || ticket?.status === "open";

  async function onSubmit(e) {
    e.preventDefault();
    if (!canEdit) return;

    setSaving(true);
    try {
      // kamu bisa sesuaikan field mana yang backend izinkan update
      const payload = {
        title,
        description,
        // kalau backend kamu belum izinkan update ini, hapus 3 field berikut:
        category,
        priority,
        location,
      };

      const updated = await ticketsApi.patch(ticket.id, payload);
      push({ tone: "success", title: "Berhasil", message: "Aduan diperbarui." });
      nav(`/tickets/${updated.id || ticket.id}`);
    } catch (e2) {
      push({
        tone: "error",
        title: "Gagal menyimpan",
        message: e2?.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell title="Edit Aduan" subtitle="Memuat...">
        <div className="text-sm text-gray-600">Loading...</div>
      </AppShell>
    );
  }

  if (err) {
    return (
      <AppShell title="Edit Aduan" subtitle="Terjadi kendala">
        <div className="text-sm text-red-600">{err}</div>
        <div className="mt-4">
          <Link to={`/tickets/${id}`}>
            <Button variant="secondary" className="gap-2">
              <ArrowLeft size={16} />
              Kembali
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!ticket) {
    return (
      <AppShell title="Edit Aduan" subtitle="Data kosong">
        <div className="text-sm text-gray-600">Aduan tidak ditemukan.</div>
      </AppShell>
    );
  }

  if (!canEdit) {
    return (
      <AppShell title="Edit Aduan" subtitle={`Aduan #${ticket.id}`}>
        <Card className="p-4 sm:p-6">
          <div className="text-sm text-gray-700">
            Aduan ini tidak bisa diedit (hanya bisa saat status <b>open</b>, kecuali staff).
          </div>
          <div className="mt-4">
            <Link to={`/tickets/${ticket.id}`}>
              <Button variant="secondary" className="gap-2">
                <ArrowLeft size={16} />
                Kembali
              </Button>
            </Link>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="Edit Aduan" subtitle={`Aduan #${ticket.id}`}>
      <Card className="p-4 sm:p-6 wow-enter">
        {/* ✅ header stack mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Pencil size={18} className="text-blue-700" />
            <div className="font-semibold text-gray-900">Perbarui Aduan</div>
          </div>

          {/* ✅ tombol: mobile full width */}
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Link to={`/tickets/${ticket.id}`} className="col-span-1">
              <Button variant="secondary" className="w-full sm:w-auto gap-2">
                <ArrowLeft size={16} />
                Batal
              </Button>
            </Link>
            <Button
              onClick={onSubmit}
              disabled={saving}
              className="w-full sm:w-auto gap-2 col-span-1"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          {/* ✅ grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />

            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </Select>

            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Jenis Aduan" />
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokasi (opsional)" />
          </div>

          <div>
            <textarea
              className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 min-h-[140px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi"
            />
          </div>

          {/* ✅ tombol submit tambahan untuk mobile (opsional, tidak mengubah desktop) */}
          <div className="sm:hidden">
            <Button type="submit" disabled={saving} className="w-full gap-2">
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
