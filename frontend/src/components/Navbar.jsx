import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1 className="logo">Hire Path</h1>

      <div className="nav-right">
        <p className="welcome">Welcome, {user} 👋</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;