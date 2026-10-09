import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setMobileMenuOpen(false);
      navigate("/login");
    }
  };

  const handleScrollTo = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        {/* Brand */}
        <Link
          to="/"
          className="brand"
          onClick={() => {
            setMobileMenuOpen(false);
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          [PITCH VAULT]<span>.</span>
        </Link>

        {/* Desktop Links */}
        <nav className="nav-links" aria-label="Main navigation">
          {/* Scrolls to 'How it works' section */}
          <button
            type="button"
            onClick={() => handleScrollTo("how")}
            className="nav-link"
            style={{
              background: "none",
              border: 0,
              padding: 0,
              cursor: "pointer",
            }}
          >
            How it works
          </button>

          {/* Scrolls to 'For investors' section */}
          <button
            type="button"
            onClick={() => handleScrollTo("investors")}
            className="nav-link"
            style={{
              background: "none",
              border: 0,
              padding: 0,
              cursor: "pointer",
            }}
          >
            For investors
          </button>

          {/* Navigates to separate /discover page */}
          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Browse pitches
          </NavLink>

          {/* Navigates to separate /investors page */}
          <NavLink
            to="/investors"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Investors
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/inbox"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Inbox
              </NavLink>

              {user.role === "founder" && (
                <NavLink
                  to="/my-pitches"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  My pitches
                </NavLink>
              )}

              <NavLink
                to="/settings/profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Settings
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {user.role === "founder" && (
                <Link to="/pitches/new" className="btn btn-primary btn-sm">
                  Post a pitch
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Start pitching
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <button
          type="button"
          onClick={() => handleScrollTo("how")}
          className="nav-link"
          style={{
            background: "none",
            border: 0,
            padding: "8px 0",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          How it works
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("investors")}
          className="nav-link"
          style={{
            background: "none",
            border: 0,
            padding: "8px 0",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          For investors
        </button>
        <NavLink
          to="/discover"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Browse pitches
        </NavLink>
        <NavLink
          to="/investors"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Investors directory
        </NavLink>

        {user && (
          <>
            <NavLink
              to="/inbox"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inbox
            </NavLink>
            {user.role === "founder" && (
              <NavLink
                to="/my-pitches"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                My pitches
              </NavLink>
            )}
            <NavLink
              to="/settings/profile"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </NavLink>
          </>
        )}

        <div className="nav-actions-mobile">
          {user ? (
            <>
              {user.role === "founder" && (
                <Link
                  to="/pitches/new"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post a pitch
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start pitching
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
