import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2>Prep Platform</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;