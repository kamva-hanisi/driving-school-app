import { BrowserRouter, Route, Routes } from "react-router-dom";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Posters from "./pages/Posters";
import ProtectedRoute from "./routes/ProtectedRoute";
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
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
