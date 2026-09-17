import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import { AuthContext } from "../context/AuthContext";

export default function Team() {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTeam = async () => {
    try {
      setError("");
      const response = await API.get("/auth/team");
      setMembers(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load team members.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const addMember = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError("Name, email, and temporary password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await API.post("/auth/team", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setMembers((current) => [...current, response.data.member]);
      setForm({});
      setStatus("Staff account created. Share the login details privately.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not create staff account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this company?`)) return;

    try {
      setError("");
      setStatus("");
      await API.delete(`/auth/team/${member.id}`);
      setMembers((current) => current.filter((item) => item.id !== member.id));
      setStatus("Staff account removed.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not remove staff account.",
      );
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main settings-page">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Company access</p>
            <h1>Team members</h1>
            <p className="dashboard-intro">
              Staff in this company share the same bookings and customer records.
            </p>
          </div>
        </section>

        {error ? <p className="form-status form-status--error">{error}</p> : null}
        {status ? <p className="form-status form-status--success">{status}</p> : null}

        {user?.role === "owner" ? (
          <section className="settings-grid">
            <article className="dashboard-panel settings-card">
              <div className="dashboard-panel__header">
                <div>
                  <h2>Add staff member</h2>
                  <p>Create login details for a trusted employee.</p>
                </div>
              </div>

              <form className="team-form" onSubmit={addMember}>
                <label htmlFor="team-name">Full name</label>
                <input id="team-name" value={form.name || ""} onChange={updateField("name")} />

                <label htmlFor="team-email">Email</label>
                <input id="team-email" type="email" value={form.email || ""} onChange={updateField("email")} />

                <label htmlFor="team-password">Temporary password</label>
                <input id="team-password" type="password" value={form.password || ""} onChange={updateField("password")} />

                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? "CREATING..." : "ADD STAFF"}
                </Button>
              </form>
            </article>

            <article className="dashboard-panel settings-card">
              <div className="dashboard-panel__header">
                <div>
                  <h2>Current team</h2>
                  <p>{members.length} account{members.length === 1 ? "" : "s"} in this company.</p>
                </div>
              </div>

              {isLoading ? <p>Loading team...</p> : null}
              {!isLoading && members.length === 0 ? <p>No team members found.</p> : null}
              <div className="team-list">
                {members.map((member) => (
                  <div className="team-member" key={member.id}>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.email}</span>
                      <small>{member.role}</small>
                    </div>
                    {member.role === "admin" ? (
                      <button className="btn btn--danger" onClick={() => removeMember(member)} type="button">
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : (
          <section className="dashboard-panel settings-card">
            <h2>Owner access required</h2>
            <p>Only the company owner can add or remove staff accounts.</p>
          </section>
        )}
      </main>
    </div>
  );
}
