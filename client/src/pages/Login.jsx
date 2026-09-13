import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form);

      // We can use this later when implementing
      // persistent sessions.
      if (rememberMe) {
        localStorage.setItem("resumesync_remember", "true");
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* Logo + Heading */}
        <div className="auth-heading">
          <div className="auth-icon">
            <span className="material-symbols-outlined">
              smart_toy
            </span>
          </div>

          <h1>Sign in</h1>

          <p>
            Enter your details to access your account
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email">
              Email
            </label>

            <div className="auth-input-wrapper">
              <span className="material-symbols-outlined">
                mail
              </span>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">

            <div className="auth-label-row">
              <label htmlFor="password">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <div className="auth-input-wrapper">

              <span className="material-symbols-outlined">
                lock
              </span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <span className="material-symbols-outlined">
                  {showPassword
                    ? "visibility_off"
                    : "visibility"}
                </span>
              </button>

            </div>
          </div>

          {/* Remember me */}
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
            />

            <span>
              Remember this device for 30 days
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <span>
              {loading ? "Signing in..." : "Sign in"}
            </span>

            <span className="material-symbols-outlined">
              {loading
                ? "progress_activity"
                : "arrow_forward"}
            </span>
          </button>

        </form>

        {/* Register */}
        <div className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Sign up
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Login;