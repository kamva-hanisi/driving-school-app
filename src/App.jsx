import { BrowserRouter, Route, Routes } from "react-router-dom";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Posters from "./pages/Posters";

import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posters" element={<Posters />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
