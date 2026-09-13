import { useState } from "react";

function formatUpdatedDate(date) {
  if (!date) return "Recently updated";

  const updated = new Date(date);
  const now = new Date();

  const difference = now - updated;
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `Updated ${minutes}m ago`;
  if (hours < 24) return `Updated ${hours}h ago`;
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days}d ago`;

  return `Updated ${updated.toLocaleDateString()}`;
}

function ResumeCard({
  resume,
  onDelete,
  onOpen,
  isNew = false,
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (isNew) {
    return (
      <button
        type="button"
        className="resume-card resume-create-card"
        onClick={onOpen}
      >
        <div className="resume-create-icon">
          <span className="material-symbols-outlined">
            add
          </span>
        </div>

        <h3>Create New Resume</h3>

        <p>
          Start building your next resume.
        </p>
      </button>
    );
  }

  return (
    <article className="resume-card">
      <button
        type="button"
        className="resume-preview-button"
        onClick={onOpen}
        aria-label={`Open ${resume.title}`}
      >
        <div className="resume-preview-area">
          <div className="resume-mini-page">
            <div className="mini-header" />
            <div className="mini-line large" />
            <div className="mini-line medium" />

            <div className="mini-section">
              <span />
              <span />
              <span />
            </div>

            <div className="mini-section">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </button>

      <div className="resume-card-content">
        <div className="resume-card-info">
          <h3>{resume.title}</h3>

          <p>
            {formatUpdatedDate(resume.updatedAt)}
          </p>
        </div>

        <div className="resume-menu-wrapper">
          <button
            type="button"
            className="resume-card-menu"
            onClick={() => setShowMenu((value) => !value)}
            aria-label="Resume options"
          >
            <span className="material-symbols-outlined">
              more_vert
            </span>
          </button>

          {showMenu && (
            <div className="resume-menu">
              <button
                type="button"
                onClick={onOpen}
              >
                <span className="material-symbols-outlined">
                  edit
                </span>
                Edit
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
              >
                <span className="material-symbols-outlined">
                  delete
                </span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ResumeCard;