import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Login() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  const handleLogin = async () => {
    if (!form.email?.trim() || !form.password?.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setError("");
      const response = await API.post("/auth/login", form);
      const user = response.data.user;

      login(response.data.token, user);
      navigate("/dashboard");
    } catch (requestError) {
      console.error("Login failed:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    }
  };

  return (
    <div className="sign-R-L-wrapper">
      <div className="R-L-box">
        <h2>Admin Login</h2>

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password:</label>
        <input
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="show-password">
          <input type="checkbox" onChange={() => setShow(!show)} />
          <span>Show Password</span>
        </div>
        {error ? <p className="form-status form-status--error">{error}</p> : null}

        <Button onClick={handleLogin}>SIGN IN</Button>

        <div className="R-L-links">
          <p>
            Authorized staff registration: <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
