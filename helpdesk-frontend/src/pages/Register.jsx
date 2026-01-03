import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuroraBackground from "../components/ui/AuroraBackground";
import PageTransition from "../components/ui/PageTransition";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { Eye, EyeOff, User, Mail, Lock, UserPlus } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

import logo from "../assets/logo_hd.png";
import Footer from "../components/layout/Footer";

function pickErrorMessage(err) {
  // 1) Zod style: { message, issues: [{ path, message }] }
  const issues = err?.response?.data?.issues;
  if (Array.isArray(issues) && issues.length) {
    // contoh: "email: Invalid email; password: Too short"
    return issues
      .map((x) => {
        const field = Array.isArray(x?.path) && x.path.length ? x.path.join(".") : "field";
        return `${field}: ${x?.message || "invalid"}`;
      })
      .join(" • ");
  }

  // 2) Express style: { message: "..." }
  const msg = err?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;

  // 3) Fallback
  return "Gagal daftar. Coba lagi.";
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ biar sinkron sama backend (umumnya minimal 6)
  const minPass = 6;

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      email.trim().includes("@") &&
      password.length >= minPass &&
      !loading
    );
  }, [name, email, password, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // ✅ stop sebelum request (lebih jelas buat user)
    if (password.length < minPass) {
      setError(`Sandi minimal ${minPass} karakter.`);
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/");
    } catch (err) {
      // penting: tampilkan error asli backend
      setError(pickErrorMessage(err));
      // optional debugging (boleh kamu hapus nanti)
      console.error("REGISTER ERROR:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col px-4 py-10">
        <div className="flex-1 flex items-center justify-center">
          <PageTransition>
            <Card className="w-full max-w-md p-6 md:p-7 rounded-[28px] border border-blue-100/70 bg-white/75 backdrop-blur shadow-[0_18px_60px_-24px_rgba(37,99,235,0.40)]">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Logo Pusat Aduan"
                  className="h-10 w-10 rounded-2xl object-contain bg-white"
                />
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-slate-900 leading-tight">
                    Pusat Aduan
                  </div>
                  <div className="text-xs text-slate-500">Buat akun baru</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xl font-semibold text-slate-900">Daftar</div>
                <div className="mt-1 text-sm text-slate-500">
                  Isi data singkat untuk mulai membuat aduan.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama"
                  autoComplete="name"
                  leftIcon={<User size={16} />}
                />

                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  leftIcon={<Mail size={16} />}
                />

                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={`Sandi (min. ${minPass} karakter)`}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    leftIcon={<Lock size={16} />}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <Button type="submit" disabled={!canSubmit} className="w-full gap-2">
                  <UserPlus size={16} />
                  {loading ? "Memproses..." : "Daftar"}
                </Button>

                <div className="pt-2 text-sm text-slate-600 text-center">
                  Sudah punya akun?{" "}
                  <Link to="/login" className="text-blue-700 hover:underline">
                    Masuk
                  </Link>
                </div>
              </form>
            </Card>
          </PageTransition>
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </AuroraBackground>
  );
}
