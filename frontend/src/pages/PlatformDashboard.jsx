import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import BookingTable from "../components/dashboard/BookingTable";
import Sidebar from "../components/layout/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";

const emptySummary = {
  total_bookings: 0,
  total_clients: 0,
  pending_bookings: 0,
  confirmed_bookings: 0,
  completed_bookings: 0,
  cancelled_bookings: 0,
  today_bookings: 0,
  upcoming_bookings: 0,
};

export default function PlatformDashboard() {
  const [summary, setSummary] = useState(emptySummary);
  const [admins, setAdmins] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlatformData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = {};

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const [summaryResponse, bookingsResponse, adminsResponse] =
        await Promise.all([
          API.get("/bookings/summary"),
          API.get("/bookings", { params }),
          API.get("/auth/admins"),
        ]);

      setSummary(summaryResponse.data.summary || emptySummary);
      setBookings(bookingsResponse.data || []);
      setAdmins(adminsResponse.data || []);
    } catch (requestError) {
      console.error("Failed to load platform dashboard:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not load the platform dashboard right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.status]);

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const stats = useMemo(
    () => [
      {
        title: "All bookings",
        value: summary.total_bookings,
        helper: "Bookings across every driving school",
      },
      {
        title: "Companies",
        value: admins.length,
        helper: "Active company admin accounts",
      },
      {
        title: "Pending",
        value: summary.pending_bookings,
        helper: "Bookings waiting for action",
      },
      {
        title: "Upcoming",
        value: summary.upcoming_bookings,
        helper: "Future lessons across the platform",
      },
    ],
    [admins.length, summary],
  );

  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === "delete") {
        if (!window.confirm("Delete this client booking permanently?")) {
          return;
        }

        await API.delete(`/bookings/${bookingId}`);
      } else {
        await API.patch(`/bookings/${bookingId}/status`, { status: action });
      }

      await fetchPlatformData();
    } catch (requestError) {
      console.error("Failed to update platform booking:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not update the booking right now.",
      );
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchPlatformData();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Platform admin</p>
            <h1>See every company and every booking</h1>
            <p className="dashboard-intro">
              This view is only for the project owner. Company admins still see
              only the bookings attached to their own school link.
            </p>
          </div>
        </section>

        {error ? <p className="form-status form-status--error">{error}</p> : null}

        <section className="stats-cards">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              helper={stat.helper}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Company admins</h2>
              <p>Each company admin owns one school booking link.</p>
            </div>
          </div>

          <div className="company-grid">
            {admins.length === 0 ? (
              <p className="field__hint">No company admins yet.</p>
            ) : (
              admins.map((admin) => (
                <article className="company-card" key={admin.id}>
                  <strong>{admin.name}</strong>
                  <span>{admin.email}</span>
                  <span>School {admin.school_id}</span>
                  <span>{admin.total_bookings} bookings</span>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>All platform bookings</h2>
              <p>Search by client, service, or company admin.</p>
            </div>
          </div>

          <form className="dashboard-filters" onSubmit={handleSearchSubmit}>
            <label className="field">
              <span className="field__label">Search</span>
              <input
                className="field__input"
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Client, service, admin name, admin email"
                value={filters.search}
              />
            </label>

            <label className="field">
              <span className="field__label">Status</span>
              <select
                className="field__input"
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                value={filters.status}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <button className="btn btn--dark dashboard-filters__button" type="submit">
              Search
            </button>
          </form>

          {isLoading ? (
            <p className="field__hint">Loading platform bookings...</p>
          ) : (
            <BookingTable
              bookings={bookings}
              onStatusChange={handleBookingAction}
              showAdmin
            />
          )}
        </section>
      </main>
    </div>
  );
}
