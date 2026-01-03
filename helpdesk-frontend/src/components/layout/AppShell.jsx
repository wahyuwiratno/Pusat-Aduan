import Sidebar from "./Sidebar";

export default function AppShell({ title, subtitle, right, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Extra glow blobs (halus, tidak ganggu)
          ✅ scroll perf: pakai transform-gpu + blur mobile lebih ringan */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-200/20 blur-2xl md:blur-3xl opacity-70 md:opacity-100 transform-gpu" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-200/20 blur-2xl md:blur-3xl opacity-70 md:opacity-100 transform-gpu" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-200/15 blur-2xl md:blur-3xl opacity-70 md:opacity-100 transform-gpu" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6 pt-4">
              {/* ✅ scroll perf:
                  - mobile: NO backdrop-blur (tetap kelihatan "glass" karena opacity)
                  - md+: tetap pakai backdrop-blur seperti semula */}
              <div className="rounded-3xl border border-blue-100/70 bg-white/80 md:bg-white/75 md:backdrop-blur shadow-[0_12px_40px_-20px_rgba(37,99,235,0.35)]">
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xl font-semibold tracking-tight text-gray-900 truncate">
                      {title}
                    </div>
                    {subtitle ? (
                      <div className="mt-1 text-sm font-medium text-blue-700/80 truncate">
                        {subtitle}
                      </div>
                    ) : null}
                  </div>

                  {right ? <div className="shrink-0">{right}</div> : null}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
