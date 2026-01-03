import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuroraBackground from "../components/ui/AuroraBackground";
import PageTransition from "../components/ui/PageTransition";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

import logo from "../assets/logo_hd.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length > 0 && !loading;
  }, [email, password, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal masuk. Cek email & sandi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
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
                <div className="text-xs text-slate-500">
                  Masuk untuk melanjutkan
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xl font-semibold text-slate-900">Masuk</div>
              <div className="mt-1 text-sm text-slate-500">
                Gunakan akun kamu untuk mengakses layanan.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
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
                  placeholder="Sandi"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
                <LogIn size={16} />
                {loading ? "Memproses..." : "Masuk"}
              </Button>

              <div className="pt-2 text-sm text-slate-600 text-center">
                Belum punya akun?{" "}
                <Link to="/register" className="text-blue-700 hover:underline">
                  Daftar
                </Link>
              </div>
            </form>
          </Card>
        </PageTransition>
      </div>
    </AuroraBackground>
  );
}
