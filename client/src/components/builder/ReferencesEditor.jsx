import { useState } from "react";

function createReference() {
  return {
    id: crypto.randomUUID(),
    name: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
    website: {
      url: "",
      label: "",
    },
    description: "",
    hidden: false,
  };
}

function ReferencesEditor({ resume, onChange }) {
  const references =
    resume.sections?.references?.items || [];

  const [editingId, setEditingId] = useState(
    references[0]?.id || null
  );

  const updateReferences = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        references: {
          ...(resume.sections?.references || {}),
          items,
        },
      },
    });
  };

  const addReference = () => {
    const reference = createReference();

    updateReferences([
      ...references,
      reference,
    ]);

    setEditingId(reference.id);
  };

  const updateReference = (id, field, value) => {
    updateReferences(
      references.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateWebsite = (id, value) => {
    updateReferences(
      references.map((item) =>
        item.id === id
          ? {
              ...item,
              website: {
                ...(item.website || {}),
                url: value,
              },
            }
          : item
      )
    );
  };

  const deleteReference = (id) => {
    const next = references.filter(
      (item) => item.id !== id
    );

    updateReferences(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateReferences(
      references.map((item) =>
        item.id === id
          ? {
              ...item,
              hidden: !item.hidden,
            }
          : item
      )
    );
  };

  return (
    <section className="resume-editor">
      <div className="editor-heading">
        <div>
          <span className="editor-eyebrow">
            REFERENCES
          </span>

          <h1>References</h1>

          <p>
            Add professional references and their
            contact information.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addReference}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Reference
        </button>
      </div>

      {references.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              groups
            </span>
          </div>

          <h2>No references added yet</h2>

          <p>
            Add managers, professors or other
            professional references.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addReference}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Reference
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {references.map((item) => (
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
                      "Unnamed Reference"}
                  </strong>

                  <span>
                    {item.position ||
                      item.organization ||
                      "Professional Reference"}
                  </span>
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
            {references
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <ReferenceForm
                  key={item.id}
                  item={item}
                  onUpdate={updateReference}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteReference(item.id)
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

function ReferenceForm({
  item,
  onUpdate,
  onUpdateWebsite,
  onDelete,
  onToggleHidden,
}) {
  return (
    <div className="experience-form-card">
      <div className="experience-form-header">
        <div>
          <span className="editor-eyebrow">
            REFERENCE ENTRY
          </span>

          <h2>
            {item.name || "New Reference"}
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
            title="Delete reference"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Name</label>

        <input
          value={item.name}
          onChange={(event) =>
            onUpdate(
              item.id,
              "name",
              event.target.value
            )
          }
          placeholder="John Doe"
        />
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Position</label>

          <input
            value={item.position}
            onChange={(event) =>
              onUpdate(
                item.id,
                "position",
                event.target.value
              )
            }
            placeholder="Engineering Manager"
          />
        </div>

        <div className="editor-field">
          <label>Organization</label>

          <input
            value={item.organization}
            onChange={(event) =>
              onUpdate(
                item.id,
                "organization",
                event.target.value
              )
            }
            placeholder="Google"
          />
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Email</label>

          <input
            type="email"
            value={item.email}
            onChange={(event) =>
              onUpdate(
                item.id,
                "email",
                event.target.value
              )
            }
            placeholder="john@example.com"
          />
        </div>

        <div className="editor-field">
          <label>Phone</label>

          <input
            value={item.phone}
            onChange={(event) =>
              onUpdate(
                item.id,
                "phone",
                event.target.value
              )
            }
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="editor-field">
        <label>Website</label>

        <input
          value={item.website?.url || ""}
          onChange={(event) =>
            onUpdateWebsite(
              item.id,
              event.target.value
            )
          }
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Add any additional context about the
            reference.
          </span>
        </div>

        <textarea
          rows={6}
          value={item.description}
          onChange={(event) =>
            onUpdate(
              item.id,
              "description",
              event.target.value
            )
          }
          placeholder="Former manager who can speak about..."
        />
      </div>
    </div>
  );
}

export default ReferencesEditor;