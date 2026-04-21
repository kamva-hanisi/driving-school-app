import { BrowserRouter, Route, Routes } from "react-router-dom";

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
  TrackBooking,
  Contact,
  About,
} from "./pages";

import { ProtectedRoute } from "./routes";
import { Navbar, Footer } from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
