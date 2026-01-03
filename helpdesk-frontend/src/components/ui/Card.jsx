export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-3xl",
        "border border-blue-100/70",
        "bg-white/80 backdrop-blur",
        "shadow-[0_10px_30px_-12px_rgba(37,99,235,0.25)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-[1px] hover:shadow-[0_20px_40px_-16px_rgba(37,99,235,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="px-6 pt-6 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate text-base">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-gray-600 truncate">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-4 h-px bg-gradient-to-r from-blue-100 via-blue-200/60 to-transparent" />
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={["px-6 pb-6", className].join(" ")}>{children}</div>;
}
