import { Link, useLocation } from "react-router-dom";

function Navbar({ links }) {
  const location = useLocation();

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
      <div className="navbar-user">
        <button className="btn btn-secondary" onClick={handleLogout}>Çıkış Yap</button>
      </div>
    </div>
  );
}

export default Navbar;