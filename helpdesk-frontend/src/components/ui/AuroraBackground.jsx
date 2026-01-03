export default function AuroraBackground({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      {/* Aurora blobs (animated) */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-blue-300/25 blur-3xl aurora-float" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[36rem] w-[36rem] rounded-full bg-sky-300/25 blur-3xl aurora-float2" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-300/20 blur-3xl aurora-float3" />

      {/* Grain (subtle) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.35)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
