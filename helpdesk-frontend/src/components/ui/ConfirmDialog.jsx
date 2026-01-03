import { Button } from "./Button";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message = "Apakah kamu yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  tone = "danger",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md wow-enter rounded-3xl border border-blue-100/70 bg-white/85 backdrop-blur shadow-[0_30px_60px_-25px_rgba(37,99,235,0.45)]">
        <div className="p-6">
          <div className="text-lg font-semibold text-gray-900 tracking-tight">
            {title}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {message}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
