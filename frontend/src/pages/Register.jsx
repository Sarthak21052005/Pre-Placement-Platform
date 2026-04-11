import { useState } from "react";
import { registerUser, registerAdmin } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 detect role from route
  const isAdmin = location.pathname.includes("admin");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = isAdmin ? registerAdmin : registerUser;

    apiCall(form)
      .then(res => {
        alert(isAdmin ? "Admin Registered Successfully" : "User Registered Successfully");
        navigate("/login");
      })
      .catch(err => {
        alert("Registration failed");
      });
  };

  return (
    <div className="page-center">
      <div className="auth-card">

        {/* 🔥 ROLE INDICATOR */}
        <div className="role-switch">
          <button className={!isAdmin ? "active" : ""}>User</button>
          <button className={isAdmin ? "active" : ""}>Admin</button>
        </div>

        <h1>{isAdmin ? "Admin Register" : "User Register"}</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#2563eb", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;