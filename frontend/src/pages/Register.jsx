import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";

export default function Register() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "owner",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again.",
      );
    }
  };

  return (
    <div className="sign-R-L-wrapper">
      <div className="R-L-box">
        <h2>Create Owner Account</h2>

        <label>Full Name:</label>
        <input
          type="text"
          placeholder="Lucas Hanisi"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="lucashanisi@gmail.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password:</label>
        <input
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Confirm Password:</label>
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <div className="show-password">
          <input type="checkbox" onChange={() => setShow(!show)} />
          <span>Show Password</span>
        </div>
        {error ? <p className="form-status form-status--error">{error}</p> : null}

        <Button onClick={handleRegister}>Register</Button>

        <div className="divider">
          <span>or continue with</span>
        </div>
        <SocialAuthButtons />
        <div className="R-L-links">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
