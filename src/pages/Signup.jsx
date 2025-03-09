import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { registerAPI } from "../utils/ApiRequest"; // ✅ Import API Endpoint
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required!", toastOptions);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(registerAPI, { name, email, password });

      if (data.success) {
        toast.success("Account created! Redirecting...", toastOptions);
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Signup failed!", toastOptions);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Create an Account</h2>
      <Form className="p-4 shadow-sm bg-light rounded" onSubmit={handleSignup}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default Signup;
