import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">

        {/* LEFT */}
        <div className="hero-content">

          <div className="hero-badge">
            <span>⚡</span>
            <span>New: AI Career Engine</span>
          </div>

          <h1>
            Sync Your Skills to Your{" "}
            <span>Dream Job</span>
          </h1>

          <p className="hero-description">
            Our AI-powered platform helps you build better resumes,
            optimize your experience and align your skills with
            the opportunities you actually want.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn hero-btn">
              Get Started for Free
              <span>→</span>
            </Link>

            <button className="secondary-btn hero-btn">
              <span>▶</span>
              Watch Demo
            </button>

          </div>

          <div className="trusted-users">

            <div className="avatars">
              <div className="avatar avatar-1">A</div>
              <div className="avatar avatar-2">R</div>
              <div className="avatar avatar-3">S</div>
            </div>

            <span>Trusted by 10,000+ job seekers</span>

          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-dashboard">

          <div className="optimization-card">

            <div className="optimization-header">
              <div className="optimization-title">
                <span className="icon-circle">✓</span>

                <div>
                  <small>Resumes Optimized Today</small>
                  <strong>1,248</strong>
                </div>
              </div>

              <span className="growth">↗ +12%</span>
            </div>

          </div>

          <div className="resume-preview">

            <div className="window-header">

              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>

              <span className="file-name">
                resume_analysis_v4.pdf
              </span>

            </div>

            <div className="resume-content">

              <h3>
                <span>📊</span>
                Optimization Score
              </h3>

              <div className="score-block">

                <div className="score-row">
                  <span>Original Resume</span>
                  <strong className="old-score">35/100</strong>
                </div>

                <div className="score-bar">
                  <div
                    className="score-fill old"
                    style={{ width: "35%" }}
                  />
                </div>

              </div>

              <div className="score-block">

                <div className="score-row">
                  <span>After ResumeSync AI</span>
                  <strong className="new-score">92/100</strong>
                </div>

                <div className="score-bar">
                  <div
                    className="score-fill new"
                    style={{ width: "92%" }}
                  />
                </div>

                <p className="matched">
                  ✨ Keywords Matched: 98%
                </p>

              </div>

              <div className="score-checks">

                <div>
                  <span>◉</span>
                  <small>Readable</small>
                </div>

                <div className="active">
                  <span>✓</span>
                  <small>Keywords</small>
                </div>

                <div className="active">
                  <span>☰</span>
                  <small>Format</small>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;