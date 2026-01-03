import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={[
        "text-sm px-3 py-1.5 rounded-full transition",
        active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function AppLayout({
  title = "Helpdesk",
  subtitle,
  right,
  children,
  containerClassName = "max-w-5xl", // bisa override per halaman
}) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className={`${containerClassName} mx-auto px-6 py-4 flex items-center justify-between gap-6`}>
          {/* Left: title + subtitle */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-semibold text-base leading-none">
                {title}
              </Link>
              {user?.role ? <Badge className="hidden sm:inline-flex">{user.role}</Badge> : null}
            </div>

            <div className="mt-1 text-xs text-gray-600 truncate leading-snug">
              {subtitle ? subtitle : user ? `Login sebagai: ${user.name} (${user.email})` : "Belum login"}
            </div>
          </div>

          {/* Right: nav + actions */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1 bg-gray-50 border rounded-full p-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/tickets/new">Create</NavLink>
              {user?.role === "staff" ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
            </nav>

            {right ? right : null}

            {user ? (
              <Button variant="ghost" onClick={logout} className="rounded-full px-4">
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="secondary" className="rounded-full px-4">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className={`${containerClassName} mx-auto px-6 py-6`}>{children}</main>
    </div>
  );
}
