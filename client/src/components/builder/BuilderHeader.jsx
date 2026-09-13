import { useState } from "react";

function BuilderHeader({
  resume,
  saving,
  onSave,
  onBack,
}) {
  const [title, setTitle] = useState(resume.title);

  return (
    <header className="builder-header">

      <div className="builder-header-left">

        <button
          type="button"
          className="builder-back"
          onClick={onBack}
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>
        </button>

        <div className="builder-brand">
          <span className="builder-brand-icon">
            <span className="material-symbols-outlined">
              smart_toy
            </span>
          </span>

          <span>
            Resume<span>Sync</span>
          </span>
        </div>

        <div className="builder-divider" />

        <input
          className="builder-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          onBlur={() => {
            if (title !== resume.title) {
              // The actual title update will be wired into
              // autosave immediately after the core editor works.
            }
          }}
        />

      </div>

      <div className="builder-header-right">

        <span
          className={`save-status ${
            saving ? "saving" : ""
          }`}
        >
          <span className="save-dot" />

          {saving ? "Saving..." : "Saved"}
        </span>

        <button
          type="button"
          className="builder-secondary-btn"
        >
          <span className="material-symbols-outlined">
            visibility
          </span>
          Preview
        </button>

        <button
          type="button"
          className="builder-primary-btn"
          onClick={onSave}
          disabled={saving}
        >
          <span className="material-symbols-outlined">
            save
          </span>

          {saving ? "Saving..." : "Save"}
        </button>

      </div>

    </header>
  );
}

export default BuilderHeader;