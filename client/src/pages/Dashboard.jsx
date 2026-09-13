import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome, {user?.name} 👋</h1>

      <p>
        You're logged into ResumeSync.
      </p>

      <p>
        Email: {user?.email}
      </p>

      <button
        className="primary-btn"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;