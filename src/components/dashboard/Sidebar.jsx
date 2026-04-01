import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>DriveAdmin</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/booking">Booking</Link>
        <Link to="/dashboard/posters">Posters</Link>
      </nav>
    </aside>
  );
}
