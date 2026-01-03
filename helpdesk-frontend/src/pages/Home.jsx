import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import LiveToggle from "../components/LiveToggle";
import { ticketsApi } from "../api/tickets";
import { useAuth } from "../auth/AuthProvider";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

import { labels } from "../config/labels";
import { statusLabel, priorityLabel } from "../config/mappers";

import {
  Search,
  PlusCircle,
  Ticket,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ShieldCheck,
  User,
} from "lucide-react";

function badgeToneStatus(s) {
  if (s === "open") return "blue";
  if (s === "in_progress") return "amber";
  if (s === "resolved") return "green";
  if (s === "closed") return "gray";
  return "gray";
}

function badgeTonePriority(p) {
  if (p === "high") return "amber";
  if (p === "medium") return "blue";
  if (p === "low") return "gray";
  return "gray";
}

const TicketRow = React.memo(function TicketRow({ t }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow shadow-blue-600/20 flex items-center justify-center">
            <Ticket size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">{t.title}</div>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge tone="gray">#{t.id}</Badge>
              <Badge tone={badgeToneStatus(t.status)}>{statusLabel(t.status)}</Badge>
              <Badge tone={badgeTonePriority(t.priority)}>{priorityLabel(t.priority)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Link
        to={`/tickets/${t.id}`}
        className="text-sm text-blue-700 hover:underline flex items-center gap-1"
      >
        Detail <ArrowRight size={14} />
      </Link>
    </div>
  );
});

export default function Home() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [liveRefresh, setLiveRefresh] = useState(true);

  // ✅ input search dipisah agar debounce tidak mengubah tampilan
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const mountedRef = useRef(true);
  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((meta.total || 0) / (meta.limit || 10))),
    [meta]
  );

  // ✅ Debounce 350ms: request tidak spam saat user mengetik
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 350);
    return () => clearTimeout(t);
  }, [qInput]);

  const load = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setErr("");
    try {
      const res = await ticketsApi.list({
        q: q || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        limit: 10,
      });
      if (!mountedRef.current) return;
      setItems(res.data || []);
      setMeta(res.meta || { page, limit: 10, total: 0 });
    } catch (e) {
      if (!mountedRef.current) return;
      setErr(e?.response?.data?.message || "Gagal memuat aduan");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [page, priority, q, status]);

  useEffect(() => {
    load();
  }, [load]);

  useAutoRefresh(load, { enabled: liveRefresh, interval: 15000 });

  const subtitle =
    user?.role === "staff" ? (
      <span className="inline-flex items-center gap-2">
        <ShieldCheck size={16} className="text-blue-700" />
        {labels.allEntities} (staff)
      </span>
    ) : (
      <span className="inline-flex items-center gap-2">
        <User size={16} className="text-blue-700" />
        {labels.myEntities} (user)
      </span>
    );

  return (
    <AppShell
      title="Beranda"
      subtitle={
        <span className="flex items-center gap-2">
          <Ticket size={16} className="text-blue-700" />
          {subtitle}
        </span>
      }
      right={
        <Link to="/tickets/new">
          <Button className="gap-2 tap">
            <PlusCircle size={16} />
            {labels.createEntity}
          </Button>
        </Link>
      }
    >
      {/* FILTER */}
      <Card className="mb-4 border-blue-100 bg-white/80 backdrop-blur shadow-sm">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-blue-700" />
              Cari & Filter
            </span>
          }
          subtitle="Cari aduan, filter status & prioritas."
          right={
            <LiveToggle
              enabled={liveRefresh}
              onToggle={() => setLiveRefresh((v) => !v)}
              label="Live refresh"
            />
          }
        />
        <CardBody className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                value={qInput}
                onChange={(e) => {
                  setPage(1);
                  setQInput(e.target.value);
                }}
                placeholder="Cari judul/deskripsi..."
                leftIcon={<Search size={16} />}
              />
            </div>

            <Select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">Semua status</option>
              <option value="open">Baru</option>
              <option value="in_progress">Diproses</option>
              <option value="resolved">Selesai</option>
              <option value="closed">Ditutup</option>
            </Select>

            <Select
              value={priority}
              onChange={(e) => {
                setPage(1);
                setPriority(e.target.value);
              }}
            >
              <option value="">Semua prioritas</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </Select>
          </div>

          {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}
        </CardBody>
      </Card>

      {/* LIST */}
      <Card className="border-blue-100 bg-white/80 backdrop-blur shadow-sm">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Ticket size={18} className="text-blue-700" />
              {labels.entityPlural}
            </span>
          }
          subtitle={`Total: ${meta.total || 0}`}
          right={
            user?.role === "staff" ? (
              <Link to="/dashboard" className="text-sm text-blue-700 hover:underline">
                Dashboard
              </Link>
            ) : (
              <Badge tone="gray">{labels.myEntities}</Badge>
            )
          }
        />

        <CardBody className="pt-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-600">Belum ada aduan.</div>
          ) : (
            <div className="space-y-3">
              {items.map((t) => (
                <TicketRow key={t.id} t={t} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-700">
              Halaman <span className="font-semibold">{page}</span> / {totalPages}
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="gap-2 tap"
              >
                <ChevronLeft size={16} />
                Prev
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-2 tap"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </AppShell>
  );
}
