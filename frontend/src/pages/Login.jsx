import { useState } from "react";
import { loginUser, loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Fill all fields");
    }

    const apiCall = role === "admin" ? loginAdmin : loginUser;

    setLoading(true);

    try {
      const res = await apiCall(form);
      const token = res.data.access_token;

      if (!token) {
        toast.error("No token received");
        return;
      }

      localStorage.setItem("token", token);

      if (role === "admin") {
        localStorage.setItem("admin_id", res.data.admin.id);
        localStorage.setItem("admin_name", res.data.admin.name);
        localStorage.setItem("role", "admin");

        toast.success("Admin login successful");

        setTimeout(() => navigate("/admin/dashboard"), 300);
      } else {
        localStorage.setItem("user_id", res.data.user.id);
        localStorage.setItem("user_name", res.data.user.name);
        localStorage.setItem("role", "user");

        toast.success("Login successful");

        setTimeout(() => navigate("/dashboard"), 300);
      }

    } catch {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="page-center">
      <div className="auth-card">

        <div className="role-switch">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            User
          </button>

          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <h1>{role === "admin" ? "Admin Login" : "User Login"}</h1>

        <form onSubmit={handleSubmit}>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p>
          {role === "admin"
            ? "Create an admin account"
            : "Don't have an account?"}{" "}
          <span
            onClick={() =>
              navigate(role === "admin" ? "/admin/register" : "/register")
            }
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;