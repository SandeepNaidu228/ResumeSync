import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const mainItems = [
  {
    label: "Resumes",
    icon: "description",
    path: "/resumes",
  },
  {
    label: "Applications",
    icon: "work",
    path: "/applications",
  },
  {
    label: "Cover Letters",
    icon: "mail",
    path: "/cover-letters",
  },
];

const toolItems = [
  {
    label: "ATS Score",
    icon: "analytics",
    path: "/ats",
    comingSoon: true,
  },
];

const settingsItems = [
  {
    label: "Profile",
    icon: "person",
    path: "/settings/profile",
  },
  {
    label: "Preferences",
    icon: "tune",
    path: "/settings/preferences",
  },
  {
    label: "AI Providers",
    icon: "auto_awesome",
    path: "/settings/ai",
  },
];

function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="app-sidebar">

      <div className="sidebar-top">

        <NavLink to="/resumes" className="sidebar-brand">
          <span className="sidebar-brand-icon">
            <span className="material-symbols-outlined">
              smart_toy
            </span>
          </span>

          <span className="sidebar-brand-name">
            Resume<span>Sync</span>
          </span>
        </NavLink>

        <nav className="sidebar-nav">

          <div className="sidebar-section">
            <span className="sidebar-section-title">
              WORKSPACE
            </span>

            {mainItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-title">
              TOOLS
            </span>

            {toolItems.map((item) => (
              <div
                key={item.path}
                className={`sidebar-link disabled ${
                  item.comingSoon ? "coming-soon" : ""
                }`}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span>{item.label}</span>

                {item.comingSoon && (
                  <span className="sidebar-badge">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-title">
              SETTINGS
            </span>

            {settingsItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

        </nav>

      </div>

      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={logout}
            title="Logout"
          >
            <span className="material-symbols-outlined">
              logout
            </span>
          </button>

        </div>

      </div>

    </aside>
  );
}

export default AppSidebar;