import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginAPI } from "../utils/ApiRequest"; // ✅ Import API Endpoint
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  // ✅ Handle Login API Request
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password", toastOptions);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(loginAPI, { email, password });

      if (data.success) {
        toast.success("Login Successful! Redirecting...", toastOptions);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(data.message || "Invalid credentials", toastOptions);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>
      <div className="content">
        <div className="header-text">
          <h1 className="headline">Welcome to Personal Finance Manager</h1>
          <p className="subtext">Track your income, expenses, and manage finances easily.</p>
        </div>

        <div className="login-box">
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-3">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
