import { useState } from "react";

function createInterest() {
  return {
    id: crypto.randomUUID(),
    name: "",
    hidden: false,
  };
}

function InterestsEditor({ resume, onChange }) {
  const interests =
    resume.sections?.interests?.items || [];

  const [editingId, setEditingId] = useState(
    interests[0]?.id || null
  );

  const updateInterests = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        interests: {
          ...(resume.sections?.interests || {}),
          items,
        },
      },
    });
  };

  const addInterest = () => {
    const interest = createInterest();

    updateInterests([...interests, interest]);
    setEditingId(interest.id);
  };

  const updateInterest = (id, field, value) => {
    updateInterests(
      interests.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deleteInterest = (id) => {
    const next = interests.filter(
      (item) => item.id !== id
    );

    updateInterests(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateInterests(
      interests.map((item) =>
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
            INTERESTS
          </span>

          <h1>Interests</h1>

          <p>
            Add hobbies and interests that are
            relevant to your professional profile.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addInterest}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Interest
        </button>
      </div>

      {interests.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              interests
            </span>
          </div>

          <h2>No interests added yet</h2>

          <p>
            Add hobbies, activities or professional
            interests.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addInterest}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Interest
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {interests.map((item) => (
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
                    {item.name ||
                      "Untitled Interest"}
                  </strong>
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
            {interests
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <InterestForm
                  key={item.id}
                  item={item}
                  onUpdate={updateInterest}
                  onDelete={() =>
                    deleteInterest(item.id)
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

function InterestForm({
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
            INTEREST
          </span>

          <h2>
            {item.name || "New Interest"}
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
            title="Delete interest"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Interest</label>

        <input
          value={item.name}
          onChange={(event) =>
            onUpdate(
              item.id,
              "name",
              event.target.value
            )
          }
          placeholder="Open-source development"
        />
      </div>
    </div>
  );
}

export default InterestsEditor;