import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import {
  AuthCallback,
  Booking,
  BookingReview,
  BookingStatus,
  Dashboard,
  Home,
  Login,
  Posters,
  Register,
  Settings,
  TrackBooking,
  Contact,
  About,
} from "./pages";

import { ProtectedRoute } from "./routes";
import { Navbar, Footer } from "./components/layout";

function AppContent() {
  const { pathname } = useLocation();
  const isOwnerRoute =
    pathname.startsWith("/owner") || pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Navigate replace to="/owner/login" />} />
        <Route path="/admin" element={<Navigate replace to="/owner/login" />} />
        <Route path="/admin/login" element={<Navigate replace to="/owner/login" />} />
        <Route
          path="/admin/register"
          element={<Navigate replace to="/owner/register" />}
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate replace to="/owner/dashboard" />}
        />
        <Route
          path="/admin/posters"
          element={<Navigate replace to="/owner/posters" />}
        />
        <Route
          path="/admin/settings"
          element={<Navigate replace to="/owner/settings" />}
        />
        <Route
          path="/register"
          element={<Navigate replace to="/owner/register" />}
        />
        <Route path="/owner/login" element={<Login />} />
        <Route path="/owner/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/booking/review/:reference"
          element={<BookingReview />}
        />

        <Route path="/track-booking" element={<TrackBooking />} />

        <Route
          path="/booking/status/:reference"
          element={<BookingStatus />}
        />

        <Route
          path="/dashboard"
          element={<Navigate replace to="/owner/dashboard" />}
        />

        <Route
          path="/posters"
          element={<Navigate replace to="/owner/posters" />}
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/posters"
          element={
            <ProtectedRoute>
              <Posters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isOwnerRoute ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
