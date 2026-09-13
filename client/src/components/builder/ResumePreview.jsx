 function ResumePreview({ resume }) {
  const basics = resume.basics || {};
  const summary = resume.summary || {};

  return (
    <aside className="resume-preview-panel">

      <div className="preview-toolbar">
        <span>LIVE PREVIEW</span>

        <button type="button">
          <span className="material-symbols-outlined">
            open_in_full
          </span>
        </button>
      </div>

      <div className="preview-stage">

        <div
          className="resume-paper"
          style={{
            "--resume-primary":
              resume.metadata?.primaryColor ||
              "#0ea841",
          }}
        >

          <header className="resume-paper-header">

            <h1>
              {basics.name || "Your Name"}
            </h1>

            <h2>
              {basics.headline ||
                "Professional Headline"}
            </h2>

            <div className="resume-contact">

              {basics.email && (
                <span>{basics.email}</span>
              )}

              {basics.phone && (
                <span>{basics.phone}</span>
              )}

              {basics.location && (
                <span>{basics.location}</span>
              )}

            </div>

          </header>

          {summary.content && (
            <section className="paper-section">

              <h3>Summary</h3>

              <p>
                {summary.content}
              </p>

            </section>
          )}

          <section className="paper-section">

            <h3>Experience</h3>

            <p className="paper-placeholder">
              Your experience will appear here.
            </p>

          </section>

          <section className="paper-section">

            <h3>Education</h3>

            <p className="paper-placeholder">
              Your education will appear here.
            </p>

          </section>

        </div>

      </div>

    </aside>
  );
}

export default ResumePreview;