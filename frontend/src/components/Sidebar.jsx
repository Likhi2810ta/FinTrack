import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">₹</div>
        <h2>FinTrack</h2>
      </div>

      {/* Navigation */}
      <p className="nav-label">MENU</p>

      <nav>
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>↔</span>
          Transactions
        </NavLink>

        {/* Budgets */}
        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>◷</span>
          Budgets
        </NavLink>

        {/* Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>◉</span>
          Analytics
        </NavLink>
      </nav>

      {/* Sidebar Bottom */}
      <div className="sidebar-bottom">
        {/* Settings */}
        <a className="nav-item">
          <span>⚙</span>
          Settings
        </a>

        {/* Profile */}
        <div className="profile">
          <div className="avatar">L</div>

          <div>
            <strong>Likhita</strong>
            <small>Personal Account</small>
          </div>
        </div>

        {/* Logout */}
        <button className="logout-button" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;