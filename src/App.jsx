import { BrowserRouter, Route, Routes } from "react-router-dom";
import Booking from "./pages/Booking";
import Dashboard from "./components/dashboard/Dashboard";
import Posters from "./components/poster/Posters";
import Home from "./pages/Home";

import { Navbar } from "./components/navbar/Navbar";

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
