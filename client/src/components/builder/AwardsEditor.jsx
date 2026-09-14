import { useState } from "react";

function createAward() {
  return {
    id: crypto.randomUUID(),
    title: "",
    issuer: "",
    date: "",
    summary: "",
    hidden: false,
  };
}

function AwardsEditor({ resume, onChange }) {
  const awards = resume.sections?.awards?.items || [];

  const [editingId, setEditingId] = useState(
    awards[0]?.id || null
  );

  const updateAwards = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        awards: {
          ...(resume.sections?.awards || {}),
          items,
        },
      },
    });
  };

  const addAward = () => {
    const award = createAward();

    updateAwards([...awards, award]);
    setEditingId(award.id);
  };

  const updateAward = (id, field, value) => {
    updateAwards(
      awards.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deleteAward = (id) => {
    const next = awards.filter(
      (item) => item.id !== id
    );

    updateAwards(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateAwards(
      awards.map((item) =>
        item.id === id
          ? { ...item, hidden: !item.hidden }
          : item
      )
    );
  };

  return (
    <section className="resume-editor">
      <div className="editor-heading">
        <div>
          <span className="editor-eyebrow">
            AWARDS
          </span>

          <h1>Awards</h1>

          <p>
            Highlight awards, honors and achievements
            that strengthen your profile.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addAward}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Award
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              emoji_events
            </span>
          </div>

          <h2>No awards added yet</h2>

          <p>
            Add academic, professional or other
            notable achievements.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addAward}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Award
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {awards.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`experience-list-item ${
                  editingId === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setEditingId(item.id)
                }
              >
                <div className="experience-list-main">
                  <strong>
                    {item.title ||
                      "Untitled Award"}
                  </strong>

                  <span>
                    {item.issuer ||
                      "Issuing Organization"}
                  </span>

                  {item.date && (
                    <small>{item.date}</small>
                  )}
                </div>

                {item.hidden && (
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="experience-form">
            {awards
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <AwardForm
                  key={item.id}
                  item={item}
                  onUpdate={updateAward}
                  onDelete={() =>
                    deleteAward(item.id)
                  }
                  onToggleHidden={() =>
                    toggleHidden(item.id)
                  }
                />
              ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AwardForm({
  item,
  onUpdate,
  onDelete,
  onToggleHidden,
}) {
  return (
    <div className="experience-form-card">
      <div className="experience-form-header">
        <div>
          <span className="editor-eyebrow">
            AWARD ENTRY
          </span>

          <h2>
            {item.title || "New Award"}
          </h2>
        </div>

        <div className="experience-form-actions">
          <button
            type="button"
            className="builder-icon-button"
            onClick={onToggleHidden}
            title={
              item.hidden
                ? "Show in resume"
                : "Hide from resume"
            }
          >
            <span className="material-symbols-outlined">
              {item.hidden
                ? "visibility_off"
                : "visibility"}
            </span>
          </button>

          <button
            type="button"
            className="builder-icon-button danger"
            onClick={onDelete}
            title="Delete award"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Award / Honor</label>

        <input
          value={item.title}
          onChange={(event) =>
            onUpdate(
              item.id,
              "title",
              event.target.value
            )
          }
          placeholder="Dean's List"
        />
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Issuer</label>

          <input
            value={item.issuer}
            onChange={(event) =>
              onUpdate(
                item.id,
                "issuer",
                event.target.value
              )
            }
            placeholder="Anna University"
          />
        </div>

        <div className="editor-field">
          <label>Date</label>

          <input
            value={item.date}
            onChange={(event) =>
              onUpdate(
                item.id,
                "date",
                event.target.value
              )
            }
            placeholder="2025"
          />
        </div>
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Explain why the award was received.
          </span>
        </div>

        <textarea
          rows={7}
          value={item.summary}
          onChange={(event) =>
            onUpdate(
              item.id,
              "summary",
              event.target.value
            )
          }
          placeholder="Awarded for academic excellence..."
        />
      </div>
    </div>
  );
}

export default AwardsEditor;