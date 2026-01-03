import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Input({ className = "", leftIcon, rightIcon, ...props }) {
  return (
    <div className={cx("relative", className)}>
      {leftIcon ? (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700/70">
          {leftIcon}
        </div>
      ) : null}

      <input
        {...props}
        className={cx(
          "w-full rounded-2xl border border-blue-100/70 bg-white/85 backdrop-blur",
          "px-4 py-2.5 text-sm outline-none",
          "placeholder:text-gray-400",
          "shadow-[0_10px_24px_-18px_rgba(37,99,235,0.30)]",
          "focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
          leftIcon ? "pl-10" : "",
          rightIcon ? "pr-10" : ""
        )}
      />

      {rightIcon ? (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-700/70">
          {rightIcon}
        </div>
      ) : null}
    </div>
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-2xl border border-blue-100/70 bg-white/85 backdrop-blur",
        "px-4 py-3 text-sm outline-none",
        "placeholder:text-gray-400",
        "shadow-[0_10px_24px_-18px_rgba(37,99,235,0.30)]",
        "focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
        className
      )}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-2xl border border-blue-100/70 bg-white/85 backdrop-blur",
        "px-4 py-2.5 text-sm outline-none",
        "shadow-[0_10px_24px_-18px_rgba(37,99,235,0.30)]",
        "focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
        className
      )}
    >
      {children}
    </select>
  );
}
