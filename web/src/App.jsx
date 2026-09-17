import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import {
  About,
  Booking,
  BookingReview,
  BookingStatus,
  Contact,
  Dashboard,
  Home,
  Login,
  Posters,
  Register,
  Settings,
  TrackBooking,
} from "./pages";
import { Footer, Navbar } from "./components/layout";
import { ProtectedRoute } from "./routes";

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/review/:reference" element={<BookingReview />} />
        <Route path="/booking/status/:reference" element={<BookingStatus />} />
        <Route path="/track-booking" element={<TrackBooking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/admin" element={<Navigate replace to="/admin/login" />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posters"
          element={
            <ProtectedRoute>
              <Posters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      {!isAdminRoute ? <Footer /> : null}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}
