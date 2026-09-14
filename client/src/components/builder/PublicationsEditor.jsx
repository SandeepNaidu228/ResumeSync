import { useState } from "react";

function createPublication() {
  return {
    id: crypto.randomUUID(),
    name: "",
    publisher: "",
    date: "",
    url: "",
    summary: "",
    hidden: false,
  };
}

function PublicationsEditor({ resume, onChange }) {
  const publications =
    resume.sections?.publications?.items || [];

  const [editingId, setEditingId] = useState(
    publications[0]?.id || null
  );

  const updatePublications = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        publications: {
          ...(resume.sections?.publications || {}),
          items,
        },
      },
    });
  };

  const addPublication = () => {
    const publication = createPublication();

    updatePublications([
      ...publications,
      publication,
    ]);

    setEditingId(publication.id);
  };

  const updatePublication = (id, field, value) => {
    updatePublications(
      publications.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deletePublication = (id) => {
    const next = publications.filter(
      (item) => item.id !== id
    );

    updatePublications(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updatePublications(
      publications.map((item) =>
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
            PUBLICATIONS
          </span>

          <h1>Publications</h1>

          <p>
            Add research papers, articles,
            presentations and other publications.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addPublication}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Publication
        </button>
      </div>

      {publications.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              article
            </span>
          </div>

          <h2>No publications added yet</h2>

          <p>
            Add papers, articles or other published
            work.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addPublication}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Publication
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {publications.map((item) => (
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
                      "Untitled Publication"}
                  </strong>

                  <span>
                    {item.publisher ||
                      "Publisher"}
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
            {publications
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <PublicationForm
                  key={item.id}
                  item={item}
                  onUpdate={updatePublication}
                  onDelete={() =>
                    deletePublication(item.id)
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

function PublicationForm({
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
            PUBLICATION ENTRY
          </span>

          <h2>
            {item.name || "New Publication"}
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
            title="Delete publication"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Title</label>

        <input
          value={item.name}
          onChange={(event) =>
            onUpdate(
              item.id,
              "name",
              event.target.value
            )
          }
          placeholder="Deep Learning for Image Classification"
        />
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Publisher</label>

          <input
            value={item.publisher}
            onChange={(event) =>
              onUpdate(
                item.id,
                "publisher",
                event.target.value
              )
            }
            placeholder="IEEE"
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
            placeholder="March 2026"
          />
        </div>
      </div>

      <div className="editor-field">
        <label>Publication URL</label>

        <input
          value={item.url}
          onChange={(event) =>
            onUpdate(
              item.id,
              "url",
              event.target.value
            )
          }
          placeholder="https://doi.org/..."
        />
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Briefly describe the publication.
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
          placeholder="Research focused on..."
        />
      </div>
    </div>
  );
}

export default PublicationsEditor;