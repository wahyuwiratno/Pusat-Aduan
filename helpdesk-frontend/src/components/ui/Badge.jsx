const toneMap = {
  blue: "bg-blue-100 text-blue-800 border-blue-200/70",
  amber: "bg-amber-100 text-amber-900 border-amber-200/70",
  green: "bg-green-100 text-green-800 border-green-200/70",
  gray: "bg-gray-100 text-gray-700 border-gray-200/70",
};

export function Badge({ tone = "gray", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center",
        "rounded-full border px-2.5 py-1 text-xs font-medium",
        "backdrop-blur bg-white/40",
        toneMap[tone] || toneMap.gray,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
