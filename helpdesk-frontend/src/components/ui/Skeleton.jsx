export function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-3xl",
        "bg-gradient-to-r from-blue-100 via-sky-100 to-blue-100",
        className,
      ].join(" ")}
    />
  );
}
