import { useState } from "react";
import { registerUser, registerAdmin } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.includes("admin");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("Fill all fields");
    }

    const apiCall = isAdmin ? registerAdmin : registerUser;

    setLoading(true);

    try {
      await apiCall(form);

      toast.success(
        isAdmin
          ? "Admin registered successfully"
          : "User registered successfully"
      );

      setTimeout(() => navigate("/login"), 300);

    } catch {
      toast.error("Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="page-center">
      <div className="auth-card">

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

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
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