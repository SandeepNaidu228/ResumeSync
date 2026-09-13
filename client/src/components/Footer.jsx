function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-inner">

        <div className="logo">
          <span className="logo-icon">🤖</span>
          <span>ResumeSync</span>
        </div>

        <div className="footer-links">

          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>

        </div>

        <p>
          © {new Date().getFullYear()} ResumeSync
        </p>

      </div>

    </footer>
  );
}

export default Footer;