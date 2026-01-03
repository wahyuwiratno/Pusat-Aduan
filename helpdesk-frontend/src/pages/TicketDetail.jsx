import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { ticketsApi } from "../api/tickets";
import { useAuth } from "../auth/AuthProvider";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/Toast";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

function badgeToneStatus(s) {
  if (s === "open") return "blue";
  if (s === "in_progress") return "amber";
  if (s === "resolved") return "green";
  if (s === "closed") return "gray";
  return "gray";
}

export default function TicketDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { push } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await ticketsApi.get(id);
        if (alive) setTicket(data);
      } catch (e) {
        const status = e?.response?.status;
        const msg =
          status === 404
            ? "Aduan tidak ditemukan."
            : e?.response?.data?.message || "Gagal mengambil detail aduan";
        if (alive) setErr(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  async function onChangeStatus(nextStatus) {
    try {
      const updated = await ticketsApi.updateStatus(ticket.id, nextStatus);
      setTicket((t) => ({
        ...t,
        status: updated.status,
        updatedAt: updated.updatedAt ?? t.updatedAt,
      }));
      push({ tone: "success", title: "Status diperbarui", message: `Status: ${nextStatus}` });
    } catch (e) {
      push({
        tone: "error",
        title: "Gagal update status",
        message: e?.response?.data?.message || "Terjadi kesalahan",
      });
    }
  }

  async function onDelete() {
    setDeleting(true);
    try {
      await ticketsApi.remove(ticket.id);
      push({ tone: "success", title: "Aduan dihapus", message: "Aduan berhasil dihapus." });
      nav("/");
    } catch (e) {
      push({
        tone: "error",
        title: "Gagal menghapus aduan",
        message: e?.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setDeleting(false);
    }
  }

  const canEdit = user?.role === "staff" || ticket?.status === "open";
  // ✅ staff juga boleh hapus (kalau backend kamu sudah diupdate)
  const canDelete = user?.role === "staff" || (user?.role === "user" && ticket?.status === "open");

  if (loading) {
    return (
      <AppShell title="Detail Aduan" subtitle="Memuat...">
        <div className="text-sm text-gray-600">Loading...</div>
      </AppShell>
    );
  }

  if (err) {
    return (
      <AppShell title="Detail Aduan" subtitle="Terjadi kendala">
        <div className="text-red-600 text-sm">{err}</div>
        <div className="mt-4">
          <Link to="/">
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
      <AppShell title="Detail Aduan" subtitle="Data kosong">
        <div className="text-gray-600 text-sm">Aduan kosong.</div>
        <div className="mt-4">
          <Link to="/">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft size={16} />
              Kembali
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Detail Aduan" subtitle={`Aduan #${ticket.id}`}>
      {/* ✅ Mobile: padding sedikit lebih hemat, desktop tetap sama */}
      <Card className="p-4 sm:p-6 space-y-4 wow-enter">
        {/* ✅ Mobile: stack, Desktop: row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xl font-semibold truncate">{ticket.title}</div>

            {/* ✅ badges wrap aman mobile */}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="gray">#{ticket.id}</Badge>
              <Badge tone={badgeToneStatus(ticket.status)}>{ticket.status}</Badge>
              <Badge tone="blue">{ticket.priority}</Badge>
              <Badge tone="gray">Jenis: {ticket.category || "-"}</Badge>
              {ticket.location ? <Badge tone="gray">Lokasi: {ticket.location}</Badge> : null}
            </div>

            {/* ✅ Mobile: select full width agar gampang tap */}
            {user?.role === "staff" ? (
              <div className="mt-4 grid grid-cols-1 sm:flex sm:items-center gap-2">
                <div className="text-sm text-gray-600">Ubah status:</div>
                <div className="sm:w-auto w-full">
                  <Select
                    value={ticket.status}
                    onChange={(e) => onChangeStatus(e.target.value)}
                    className="w-full sm:w-auto"
                  >
                    <option value="open">Baru</option>
                    <option value="in_progress">Diproses</option>
                    <option value="resolved">Selesai</option>
                    <option value="closed">Ditutup</option>
                  </Select>
                </div>
              </div>
            ) : null}
          </div>

          {/* ✅ Mobile: tombol jadi 2 kolom atau wrap, desktop tetap inline */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            {canEdit ? (
              <Link to={`/tickets/${ticket.id}/edit`} className="col-span-1">
                <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                  <Pencil size={16} />
                  Edit
                </Button>
              </Link>
            ) : null}

            {canDelete ? (
              <Button
                variant="danger"
                className="gap-2 w-full sm:w-auto col-span-1"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                <Trash2 size={16} />
                Hapus
              </Button>
            ) : null}

            <Link to="/" className="col-span-2 sm:col-span-1">
              <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                <ArrowLeft size={16} />
                Kembali
              </Button>
            </Link>
          </div>
        </div>

        {/* ✅ text wrap aman mobile */}
        <div className="text-gray-800 whitespace-pre-wrap break-words">{ticket.description || "-"}</div>

        {user?.role === "user" && ticket.status !== "open" ? (
          <div className="text-xs text-gray-500">
            Aduan hanya bisa dihapus saat status masih <span className="font-semibold">open</span>.
          </div>
        ) : null}
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus aduan?"
        message="Aksi ini tidak bisa dibatalkan. Aduan bisa dihapus sesuai aturan akses."
        confirmText="Hapus"
        cancelText="Batal"
        tone="danger"
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete();
        }}
      />
    </AppShell>
  );
}
