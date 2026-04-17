import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import Booking from "./pages/Booking";
import BookingReview from "./pages/BookingReview";
import BookingStatus from "./pages/BookingStatus";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Posters from "./pages/Posters";
import ProtectedRoute from "./routes/ProtectedRoute";
import TrackBooking from "./pages/TrackBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* Shared layout wrapper used across all public pages. */}
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
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
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posters"
            element={
              <ProtectedRoute>
                <Posters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
