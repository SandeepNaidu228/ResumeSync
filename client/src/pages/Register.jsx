import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      await register(form);
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

          <h1>Create account</h1>

          <p>
            Create your account to get started
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Name */}
          <div className="auth-field">
            <label htmlFor="name">
              Full Name
            </label>

            <div className="auth-input-wrapper">
              <span className="material-symbols-outlined">
                person
              </span>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
          </div>

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
            <label htmlFor="password">
              Password
            </label>

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
                autoComplete="new-password"
                minLength={6}
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

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <span>
              {loading
                ? "Creating account..."
                : "Create account"}
            </span>

            <span className="material-symbols-outlined">
              {loading
                ? "progress_activity"
                : "arrow_forward"}
            </span>
          </button>

        </form>

        {/* Login */}
        <div className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Register;