import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_BASE_URL } from "../api";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (data.message === "Login successful") {
        localStorage.setItem("username", formData.username);
        const { isProfileComplete } = data;
        if (isProfileComplete) {
          navigate("/moodSnap");
        } else {
          navigate("/profile");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Error logging in");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Sign In</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
      <div className="text-center mt-3">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
