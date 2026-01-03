import { Github, Linkedin, Instagram, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 w-full">
      <div className="w-full rounded-3xl border border-blue-100/70 bg-white/75 backdrop-blur shadow-[0_10px_30px_-18px_rgba(37,99,235,0.25)]">
        <div className="px-6 py-5 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-blue-600" />
            <span>Pusat Aduan Internal</span>
          </div>

          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Sistem pelaporan dan pengelolaan aduan untuk meningkatkan transparansi
            dan kualitas layanan.
          </p>

          <div className="h-px w-24 bg-slate-200/70" />

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} • Dibuat oleh{" "}
            <span className="font-medium text-slate-600">
              Wahyu Wiratno
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wahyuwiratno"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-700 transition"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>

            <a
              href="https://linkedin.com/in/wahyu-wiratno-0370a4314"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-700 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://instagram.com/wahyuwiratno_"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-700 transition"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
