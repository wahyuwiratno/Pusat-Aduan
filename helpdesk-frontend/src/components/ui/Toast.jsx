import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ToastCtx = createContext(null);

function toneStyles(tone) {
  if (tone === "success")
    return {
      wrap: "border-green-200/70 bg-white/85",
      icon: "text-green-600",
      title: "text-green-900",
    };
  if (tone === "error")
    return {
      wrap: "border-rose-200/70 bg-white/85",
      icon: "text-rose-600",
      title: "text-rose-900",
    };
  if (tone === "warning")
    return {
      wrap: "border-amber-200/70 bg-white/85",
      icon: "text-amber-600",
      title: "text-amber-900",
    };
  return {
    wrap: "border-blue-200/70 bg-white/85",
    icon: "text-blue-700",
    title: "text-blue-900",
  };
}

function ToneIcon({ tone }) {
  const cls = "h-5 w-5";
  if (tone === "success") return <CheckCircle2 className={cls} />;
  if (tone === "error") return <AlertTriangle className={cls} />;
  if (tone === "warning") return <AlertTriangle className={cls} />;
  return <Info className={cls} />;
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = crypto?.randomUUID?.() || String(Date.now());
    const t = {
      id,
      tone: toast.tone || "info",
      title: toast.title || "",
      message: toast.message || "",
      ttl: toast.ttl ?? 2800,
    };
    setItems((prev) => [...prev, t]);

    window.setTimeout(() => remove(id), t.ttl);
  }, [remove]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed right-4 top-4 z-[100] space-y-3">
        {items.map((t) => {
          const s = toneStyles(t.tone);
          return (
            <div
              key={t.id}
              className={[
                "wow-enter",
                "rounded-3xl border backdrop-blur shadow-[0_20px_40px_-20px_rgba(37,99,235,0.35)]",
                "px-4 py-3 w-[320px]",
                s.wrap,
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className={["mt-0.5", s.icon].join(" ")}>
                  <ToneIcon tone={t.tone} />
                </div>

                <div className="min-w-0 flex-1">
                  {t.title ? (
                    <div className={["text-sm font-semibold", s.title].join(" ")}>
                      {t.title}
                    </div>
                  ) : null}
                  {t.message ? (
                    <div className="mt-0.5 text-sm text-gray-700">
                      {t.message}
                    </div>
                  ) : null}
                </div>

                <button
                  className="text-gray-500 hover:text-gray-700 transition"
                  onClick={() => remove(t.id)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}
