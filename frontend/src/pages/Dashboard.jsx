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

export default function Dashboard() {
  const [summary, setSummary] = useState(emptySummary);
  const [recentClients, setRecentClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError("");

      const params = {};

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const [summaryResponse, bookingsResponse] = await Promise.all([
        API.get("/bookings/summary"),
        API.get("/bookings", { params }),
      ]);

      setSummary(summaryResponse.data.summary || emptySummary);
      setRecentClients(summaryResponse.data.recentClients || []);
      setBookings(bookingsResponse.data || []);
    } catch (requestError) {
      console.error("Failed to load dashboard:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not load the dashboard right now.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters.search, filters.status]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(
    () => [
      {
        title: "Total bookings",
        value: summary.total_bookings,
        helper: "All client bookings in the system",
      },
      {
        title: "Total clients",
        value: summary.total_clients,
        helper: "Unique clients who have booked",
      },
      {
        title: "Today",
        value: summary.today_bookings,
        helper: "Bookings happening today",
      },
      {
        title: "Upcoming",
        value: summary.upcoming_bookings,
        helper: "Future bookings to prepare for",
      },
    ],
    [summary],
  );

  const handleStatusChange = async (bookingId, status) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status });
      await fetchDashboardData({ silent: true });
    } catch (requestError) {
      console.error("Failed to update booking status:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not update the booking status.",
      );
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchDashboardData();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Owner dashboard</p>
            <h1>Manage real client bookings</h1>
            <p className="dashboard-intro">
              Track incoming bookings, see client demand, and keep your lesson
              schedule under control.
            </p>
          </div>
          <div className="dashboard-status-group">
            <div className="status status--pending">
              Pending: {summary.pending_bookings}
            </div>
            <div className="status status--confirmed">
              Confirmed: {summary.confirmed_bookings}
            </div>
            <div className="status status--completed">
              Completed: {summary.completed_bookings}
            </div>
          </div>
        </div>

        {error ? <p className="form-status form-status--error">{error}</p> : null}

        <div className="stats-cards">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              helper={stat.helper}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Booking controls</h2>
              <p>Filter bookings and review the latest client activity.</p>
            </div>
            {isRefreshing ? (
              <span className="field__hint">Refreshing...</span>
            ) : null}
          </div>

          <form className="dashboard-filters" onSubmit={handleSearchSubmit}>
            <label className="field">
              <span className="field__label">Search client or service</span>
              <input
                className="field__input"
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Name, email, phone, code, service"
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
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <h2>All bookings</h2>
                <p>Each booking below is coming from the real database.</p>
              </div>
            </div>
            {isLoading ? (
              <p className="field__hint">Loading bookings...</p>
            ) : (
              <BookingTable
                bookings={bookings}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          <aside className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <h2>Recent clients</h2>
                <p>The latest people who booked through the website.</p>
              </div>
            </div>

            <div className="client-list">
              {recentClients.length === 0 ? (
                <p className="field__hint">No client bookings yet.</p>
              ) : (
                recentClients.map((client) => (
                  <article className="client-card" key={client.id}>
                    <div className="client-card__row">
                      <strong>{client.customer_name}</strong>
                      <span className={`status status--${client.status}`}>
                        {client.status}
                      </span>
                    </div>
                    <p>{client.customer_email || "No email provided"}</p>
                    <p>{client.customer_phone}</p>
                    <p>
                      {client.code} • {client.service}
                    </p>
                  </article>
                ))
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
