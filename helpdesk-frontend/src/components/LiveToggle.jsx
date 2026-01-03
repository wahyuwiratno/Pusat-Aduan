import React from "react";

export function LiveToggle({ enabled, onToggle, label = "Live" }) {
  const tone = enabled
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-gray-200 bg-gray-50 text-gray-700";
  const dot = enabled ? "bg-green-500" : "bg-gray-400";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition hover:shadow ${tone}`}
      aria-pressed={enabled}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
      <span>{label}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export default LiveToggle;
