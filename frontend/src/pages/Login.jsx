import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function Login() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", form);
      login(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="sign-R-L-wrapper">
      <div className="R-L-box">
        <h2>Login</h2>

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

        <Button onClick={handleLogin}>SIGN IN</Button>

        <div className="R-L-links">
          <p>
            Forgot <span>Username / Password?</span>
          </p>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
