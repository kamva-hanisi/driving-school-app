import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import BookingTable from "../components/dashboard/BookingTable";
import Sidebar from "../components/layout/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import { AuthContext } from "../context/AuthContext";

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
  const { user } = useContext(AuthContext);
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
        helper: "All client bookings received through the website",
      },
      {
        title: "Total clients",
        value: summary.total_clients,
        helper: "Unique people who have booked lessons",
      },
      {
        title: "Pending today",
        value: summary.pending_bookings,
        helper: "Bookings still waiting for your action",
      },
      {
        title: "Upcoming",
        value: summary.upcoming_bookings,
        helper: "Future lessons to plan and prepare for",
      },
    ],
    [summary],
  );

  const schoolBookingLink = `${window.location.origin}/booking${
    user?.school_id ? `?school_id=${user.school_id}` : ""
  }`;

  const copyBookingLink = async () => {
    try {
      await navigator.clipboard.writeText(schoolBookingLink);
      setError("");
    } catch {
      setError("We could not copy the booking link.");
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === "delete") {
        const shouldDelete = window.confirm(
          "Delete this client booking permanently?",
        );

        if (!shouldDelete) {
          return;
        }

        await API.delete(`/bookings/${bookingId}`);
      } else {
        await API.patch(`/bookings/${bookingId}/status`, { status: action });
      }

      await fetchDashboardData({ silent: true });
    } catch (requestError) {
      console.error("Failed to update booking:", requestError);
      setError(
        requestError.response?.data?.message ||
          "We could not update the booking right now.",
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
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Private owner area</p>
            <h1>Manage client bookings with confidence</h1>
            <p className="dashboard-intro">
              Review every booking, confirm lesson slots, and remove records you
              no longer need from one focused dashboard.
            </p>
          </div>

          <div className="dashboard-status-group">
            <span className="status status--pending">
              Pending: {summary.pending_bookings}
            </span>
            <span className="status status--confirmed">
              Confirmed: {summary.confirmed_bookings}
            </span>
            <span className="status status--completed">
              Completed: {summary.completed_bookings}
            </span>
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
              <h2>Booking filters</h2>
              <p>
                Find a client quickly and narrow results by booking status.
                Share your booking link so new clients go to this admin account.
              </p>
            </div>
            {isRefreshing ? (
              <span className="field__hint">Refreshing live data...</span>
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

          <div className="school-link">
            <span>{schoolBookingLink}</span>
            <button className="btn btn--secondary" onClick={copyBookingLink} type="button">
              Copy booking link
            </button>
          </div>
        </section>

        <section className="dashboard-grid">
          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <h2>Client bookings</h2>
                <p>These are the real bookings submitted through the website.</p>
              </div>
            </div>

            {isLoading ? (
              <p className="field__hint">Loading bookings...</p>
            ) : (
              <BookingTable
                bookings={bookings}
                onStatusChange={handleBookingAction}
              />
            )}
          </section>

          <aside className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <h2>Recent clients</h2>
                <p>Latest people who booked from the public booking form.</p>
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
                    <p>{`${client.code} | ${client.service}`}</p>
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
