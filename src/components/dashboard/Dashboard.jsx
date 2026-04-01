import BookingTable from "./BookingTable";
import Sidebar from "./Sidebar";
import StatsCard from "./StatsCard";

export default function Dashboard() {
  const bookings = [
    {
      name: "John Doe",
      code: "8",
      date: "2023-10-15",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      name: "Jane Smith",
      code: "10",
      date: "2023-10-16",
      time: "2:00 PM",
      status: "Confirmed",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main>
        <h1>Dashboard</h1>

        <div className="stats-cards">
          <StatsCard title="Total Bookings" value="20" />
          <StatsCard title="Revenue" value="R5,000" />
          <StatsCard title="Today" value="5" />
        </div>

        <h2>Recent Bookings</h2>
        <BookingTable bookings={bookings} />
      </main>
    </div>
  );
}
