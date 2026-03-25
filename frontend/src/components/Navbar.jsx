import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const user = localStorage.getItem("user") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isSearchEnabled = search !== undefined && setSearch !== undefined;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      
      <div className="nav-left">
        <h1 className="logo" onClick={() => navigate("/dashboard")}>
          HirePath
        </h1>

        <div className="nav-links">
          <p onClick={() => navigate("/companies")}>Companies</p>
          <p onClick={() => navigate("/topics")}>Topics</p>
          <p onClick={() => navigate("/practice")}>Practice</p>
        </div>
      </div>

      <div className="nav-right">

        {/* ✅ SAFE SEARCH */}
        {isSearchEnabled && (
          <input
            type="text"
            placeholder="Search companies..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        <div className="profile-section" ref={dropdownRef}>
          <div className="profile" onClick={() => setOpen(!open)}>
            <img src="../logos/profile.jpg" alt="user" />
          </div>

          {open && (
            <div className="dropdown">
              <div className="dropdown-header">
                <h1>{user}</h1>
              </div>

              <p onClick={() => { setOpen(false); navigate("/profile"); }}>
                Profile
              </p>

              <p onClick={() => { setOpen(false); navigate("/attempts"); }}>
                My Attempts
              </p>

              <p onClick={() => { setOpen(false); navigate("/targets"); }}>
                Target Companies
              </p>

              <p onClick={() => { setOpen(false); navigate("/settings"); }}>
                Settings
              </p>

              <hr />

              <p className="logout" onClick={logout}>
                Logout
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;