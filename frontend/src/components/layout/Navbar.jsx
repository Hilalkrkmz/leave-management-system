import { Link, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import AdminNotificationBell from "./AdminNotificationBell";

function Navbar({ links }) {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="navbar-user" style={{ gap: 16 }}>
        {role === "EMPLOYEE" && <NotificationBell />}
        {role === "ADMIN" && <AdminNotificationBell />}
        <button className="btn btn-secondary" onClick={handleLogout}>Çıkış Yap</button>
      </div>
    </div>
  );
}

export default Navbar;