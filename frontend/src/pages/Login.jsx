import { useState } from "react";
import { loginUser, loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const apiCall = role === "admin" ? loginAdmin : loginUser;

  apiCall(form)
    .then(res => {
      const token = res.data.access_token;

      if (!token) {
        alert("No token received");
        return;
      }

      localStorage.setItem("token", token);

      if (role === "admin") {
        localStorage.setItem("admin_id", res.data.admin.id);
        localStorage.setItem("admin_name", res.data.admin.name);
        localStorage.setItem("role", "admin");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 100); // 🔥 important
      } else {
        localStorage.setItem("user_id", res.data.user.id);
        localStorage.setItem("user_name", res.data.user.name);
        localStorage.setItem("role", "user");

        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    })
    .catch(() => {
      alert("Login failed");
    });
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

        <button type="submit">Sign In</button>
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