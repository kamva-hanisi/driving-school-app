import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  Booking,
  BookingReview,
  BookingStatus,
  Home,
  TrackBooking,
} from "./pages";
import { Footer, Navbar } from "./components/layout";

function ClientApp() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/review/:reference" element={<BookingReview />} />
        <Route path="/booking/status/:reference" element={<BookingStatus />} />
        <Route path="/track-booking" element={<TrackBooking />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ClientApp />
    </BrowserRouter>
  );
}
