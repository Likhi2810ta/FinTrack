import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await API.post("/auth/login", formData);

      // Store JWT token
      localStorage.setItem("token", response.data.access_token);

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Welcome Back</h1>
        <p>Login to your FinTrack account</p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="auth-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;