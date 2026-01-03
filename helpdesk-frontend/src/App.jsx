import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import ProtectedRoute from "./auth/ProtectedRoute";
import TicketCreate from "./pages/TicketCreate";
import TicketEdit from "./pages/TicketEdit";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <Routes>
      {/* Home (gabungan Dashboard + Tickets) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Optional: keep dashboard page */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Optional: kalau mau /tickets tetap ada, tapi arahkan ke Home */}
      <Route path="/tickets" element={<Navigate to="/" replace />} />

      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute>
            <TicketCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id/edit"
        element={
          <ProtectedRoute>
            <TicketEdit />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-6 text-gray-700">404</div>
            <div className="max-w-6xl mx-auto w-full px-6 pb-8">
              <Footer />
            </div>
          </div>
        }
      />
    </Routes>
  );
}
