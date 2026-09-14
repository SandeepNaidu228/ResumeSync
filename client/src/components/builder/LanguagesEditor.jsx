import { useState } from "react";

function createLanguage() {
  return {
    id: crypto.randomUUID(),
    language: "",
    fluency: "",
    hidden: false,
  };
}

function LanguagesEditor({ resume, onChange }) {
  const languages =
    resume.sections?.languages?.items || [];

  const [editingId, setEditingId] = useState(
    languages[0]?.id || null
  );

  const updateLanguages = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        languages: {
          ...(resume.sections?.languages || {}),
          items,
        },
      },
    });
  };

  const addLanguage = () => {
    const language = createLanguage();

    updateLanguages([...languages, language]);
    setEditingId(language.id);
  };

  const updateLanguage = (id, field, value) => {
    updateLanguages(
      languages.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deleteLanguage = (id) => {
    const next = languages.filter(
      (item) => item.id !== id
    );

    updateLanguages(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateLanguages(
      languages.map((item) =>
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
            LANGUAGES
          </span>

          <h1>Languages</h1>

          <p>
            Add the languages you know and your
            proficiency level.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addLanguage}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Language
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              translate
            </span>
          </div>

          <h2>No languages added yet</h2>

          <p>
            Add languages and describe your
            proficiency.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addLanguage}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Language
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {languages.map((item) => (
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
                    {item.language ||
                      "Unnamed Language"}
                  </strong>

                  {item.fluency && (
                    <small>{item.fluency}</small>
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
            {languages
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <LanguageForm
                  key={item.id}
                  item={item}
                  onUpdate={updateLanguage}
                  onDelete={() =>
                    deleteLanguage(item.id)
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

function LanguageForm({
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
            LANGUAGE ENTRY
          </span>

          <h2>
            {item.language || "New Language"}
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
            title="Delete language"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Language</label>

          <input
            value={item.language}
            onChange={(event) =>
              onUpdate(
                item.id,
                "language",
                event.target.value
              )
            }
            placeholder="English"
          />
        </div>

        <div className="editor-field">
          <label>Fluency</label>

          <select
            value={item.fluency}
            onChange={(event) =>
              onUpdate(
                item.id,
                "fluency",
                event.target.value
              )
            }
          >
            <option value="">
              Select proficiency
            </option>
            <option value="Native">
              Native
            </option>
            <option value="Fluent">
              Fluent
            </option>
            <option value="Advanced">
              Advanced
            </option>
            <option value="Intermediate">
              Intermediate
            </option>
            <option value="Elementary">
              Elementary
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default LanguagesEditor;