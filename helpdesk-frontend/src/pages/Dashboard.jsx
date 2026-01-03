import { useEffect, useMemo, useState, useCallback } from "react";
import AppShell from "../components/layout/AppShell";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { ticketsApi } from "../api/tickets";
import { Link } from "react-router-dom";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { BarChart3, Ticket, Clock, ArrowRight, ShieldCheck, Tag } from "lucide-react";

/** =========================
 * MAPPERS (UI label only)
 * ========================= */
const STATUS_LABEL = {
  open: "Baru",
  in_progress: "Diproses",
  resolved: "Selesai",
  closed: "Ditutup",
};

const STATUS_COLORS = {
  open: "#3b82f6",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  closed: "#94a3b8",
};

function statusLabel(key) {
  return STATUS_LABEL[key] || key || "-";
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const onEnter = useCallback((_, idx) => setActiveIndex(idx), []);
  const onLeave = useCallback(() => setActiveIndex(-1), []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await ticketsApi.dashboard(); // GET /api/tickets/dashboard
        if (!alive) return;
        setData(res?.data || res);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "Gagal memuat dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, []);

  const total = data?.total ?? 0;
  const by = data?.byStatus || {};
  const latest = data?.latest ?? [];
  const topCategories = data?.topCategories ?? [];

  const pieData = useMemo(() => {
    return [
      { name: "Baru", key: "open", value: by.open || 0 },
      { name: "Diproses", key: "in_progress", value: by.in_progress || 0 },
      { name: "Selesai", key: "resolved", value: by.resolved || 0 },
      { name: "Ditutup", key: "closed", value: by.closed || 0 },
    ];
  }, [by]);

  return (
    <AppShell
      title="Dashboard"
      subtitle={
        <span className="inline-flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-700" />
          Ringkasan Aduan (staff)
        </span>
      }
      right={
        <Link to="/" className="text-sm text-blue-700 hover:underline">
          Kembali ke Beranda
        </Link>
      }
    >
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Statistik */}
        <Card className="wow-enter wow-delay-1">
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-700" />
                Statistik Aduan
              </span>
            }
            subtitle="Jumlah aduan berdasarkan status & jenis"
            right={<Badge tone="blue">Live</Badge>}
          />
          <CardBody className="pt-2">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 rounded-3xl wow-shimmer" />
                <Skeleton className="h-16 rounded-3xl wow-shimmer" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-blue-100/70 bg-white/70 p-4 wow-hoverlift">
                  <div className="text-xs text-gray-600">Total Aduan</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
                    {total}
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-100/70 bg-white/70 p-4 wow-hoverlift">
                  <div className="text-xs text-gray-600">Jenis Aduan Terbanyak</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 truncate">
                    {topCategories[0]?.category || "-"}
                  </div>
                  <div className="text-xs text-gray-500 tabular-nums">
                    {topCategories[0]?.total || 0} aduan
                  </div>
                </div>

                {pieData.map((s) => (
                  <div
                    key={s.key}
                    className="rounded-3xl border border-blue-100/70 bg-white/70 p-4 wow-hoverlift"
                  >
                    <div className="text-xs text-gray-600">{s.name}</div>
                    <div className="mt-1 text-xl font-bold tracking-tight tabular-nums">
                      {s.value}
                    </div>
                    <div
                      className="mt-2 h-1.5 rounded-full"
                      style={{ background: STATUS_COLORS[s.key] }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Pie */}
        <Card className="wow-enter wow-delay-2">
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Ticket size={18} className="text-blue-700" />
                Proporsi Status
              </span>
            }
            subtitle="Status internal tetap, label tampil Indonesia"
            right={<Badge tone="gray">Pie</Badge>}
          />
          <CardBody className="pt-2">
            {loading ? (
              <Skeleton className="h-64 rounded-3xl wow-shimmer" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow
                          dx="0"
                          dy="10"
                          stdDeviation="10"
                          floodColor="#2563eb"
                          floodOpacity="0.25"
                        />
                      </filter>
                    </defs>

                    <Tooltip
                      wrapperStyle={{ outline: "none", pointerEvents: "none" }} // anti flicker
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(59,130,246,0.18)",
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 20px 40px -20px rgba(37,99,235,0.35)",
                        fontSize: 12,
                      }}
                      formatter={(value, name) => [`${value} aduan`, name]}
                    />

                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      stroke="transparent"
                      filter="url(#pieShadow)"
                      isAnimationActive={false}
                      activeIndex={activeIndex}
                      onMouseEnter={onEnter}
                      onMouseLeave={onLeave}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-3 flex flex-wrap gap-2">
                  {pieData.map((s) => (
                    <div
                      key={s.key}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-100/70 bg-white/70 px-3 py-1 text-xs text-gray-700"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: STATUS_COLORS[s.key] }}
                      />
                      <span className="font-medium">{s.name}</span>
                      <span className="tabular-nums text-gray-500">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Terbaru */}
        <Card className="wow-enter wow-delay-3">
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Clock size={18} className="text-blue-700" />
                Aduan Terbaru
              </span>
            }
            subtitle="10 aduan terakhir yang masuk"
            right={<Badge tone="blue">Terbaru</Badge>}
          />
          <CardBody className="pt-2">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 rounded-3xl wow-shimmer" />
                <Skeleton className="h-14 rounded-3xl wow-shimmer" />
                <Skeleton className="h-14 rounded-3xl wow-shimmer" />
              </div>
            ) : latest.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada data.</div>
            ) : (
              <div className="space-y-3">
                {latest.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tickets/${t.id}`}
                    className="block rounded-3xl border border-blue-100/70 bg-white/70 p-4 wow-hoverlift"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{t.title}</div>

                        <div className="mt-1 text-xs text-gray-500 tabular-nums">
                          {fmtDate(t.createdAt)}
                        </div>

                        {/* Label Indonesia untuk status + ubah category jadi Jenis Aduan */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge tone="gray">#{t.id}</Badge>
                          <Badge tone="blue">{statusLabel(t.status)}</Badge>
                          <Badge tone="gray" className="inline-flex items-center gap-1">
                            <Tag size={12} />
                            Jenis: {t.category || "-"}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-blue-700 text-sm inline-flex items-center gap-1">
                        Detail <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
