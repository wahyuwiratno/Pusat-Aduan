const variants = {
  primary:
    "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_12px_30px_-14px_rgba(37,99,235,0.45)] hover:brightness-110",
  secondary:
    "bg-white/85 backdrop-blur border border-blue-100 text-blue-700 hover:bg-white shadow-[0_10px_24px_-16px_rgba(37,99,235,0.25)]",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 shadow-[0_12px_30px_-16px_rgba(225,29,72,0.45)]",
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-2xl px-4 py-2.5 text-sm font-semibold tracking-tight",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-[1px]",
        "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white/30",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant] || variants.primary,
        className,
      ].join(" ")}
      {...props}
    />
  );
}
