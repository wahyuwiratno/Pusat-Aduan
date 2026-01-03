import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { Home, PlusCircle, BarChart3, LogOut } from "lucide-react";

import logoHd from "../../assets/logo_hd.png";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ease-out",
          "hover:bg-white/12 hover:backdrop-blur hover:-translate-y-[1px]",
          isActive ? "bg-white/18 backdrop-blur shadow-sm" : "text-white/90",
        ].join(" ")
      }
    >
      <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-sm">
        <Icon size={18} className="text-white" />
      </div>
      <div className="font-medium">{label}</div>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex w-64 shrink-0 p-4 bg-gradient-to-b from-blue-600 to-sky-600 text-white shadow-2xl">
      <div className="flex flex-col w-full">
        {/* Brand */}
        <div className="rounded-3xl bg-white/10 backdrop-blur border border-white/15 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center overflow-hidden">
              <img
                src={logoHd}
                alt="Logo Pusat Aduan"
                className="h-9 w-9 object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-lg font-semibold tracking-tight truncate">
                Pusat Aduan
              </div>
              <div className="text-xs text-white/80 mt-1 truncate">
                {user?.name} • {user?.role}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <NavItem to="/" icon={Home} label="Beranda" />
          <NavItem to="/tickets/new" icon={PlusCircle} label="Buat Aduan" />
          {user?.role === "staff" ? (
            <NavItem to="/dashboard" icon={BarChart3} label="Dashboard" />
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-300 ease-out hover:-translate-y-[1px]"
          >
            <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <LogOut size={18} className="text-white" />
            </div>
            <div className="font-medium">Logout</div>
          </button>

          <div className="mt-3 text-[11px] text-white/70 px-2">
            by wahyuwiratno
          </div>
        </div>
      </div>
    </aside>
  );
}
