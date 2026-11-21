import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Register the user
      const registerResponse = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      console.log("Registration:", registerResponse.data);

      // Step 2: Automatically login after registration
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const loginResponse = await API.post("/auth/login", formData);

      // Step 3: Store JWT token
      localStorage.setItem(
        "token",
        loginResponse.data.access_token
      );

      // Step 4: Redirect to Dashboard
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Create Account</h1>

        <p>Start managing your finances with FinTrack</p>

        <form onSubmit={handleRegister}>

          {/* Username */}
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Register Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="auth-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;