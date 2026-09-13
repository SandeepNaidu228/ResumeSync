import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">

        <a href="/" className="logo">
          <span className="logo-icon">🤖</span>
          <span>ResumeSync</span>
        </a>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="primary-btn">
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;