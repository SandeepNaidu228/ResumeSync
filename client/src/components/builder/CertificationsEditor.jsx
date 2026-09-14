import { useState } from "react";

function createCertification() {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    date: "",
    expiryDate: "",
    credentialId: "",
    website: {
      url: "",
      label: "",
    },
    hidden: false,
  };
}

function CertificationsEditor({ resume, onChange }) {
  const certifications =
    resume.sections?.certifications?.items || [];

  const [editingId, setEditingId] = useState(
    certifications[0]?.id || null
  );

  const updateCertifications = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        certifications: {
          ...(resume.sections?.certifications || {}),
          items,
        },
      },
    });
  };

  const addCertification = () => {
    const item = createCertification();

    updateCertifications([
      ...certifications,
      item,
    ]);

    setEditingId(item.id);
  };

  const updateItem = (id, field, value) => {
    updateCertifications(
      certifications.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateWebsite = (id, value) => {
    updateCertifications(
      certifications.map((item) =>
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

  const deleteCertification = (id) => {
    const next = certifications.filter(
      (item) => item.id !== id
    );

    updateCertifications(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateCertifications(
      certifications.map((item) =>
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
            CERTIFICATIONS
          </span>

          <h1>Certifications</h1>

          <p>
            Add professional certifications,
            credentials and licenses.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addCertification}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              workspace_premium
            </span>
          </div>

          <h2>No certifications added yet</h2>

          <p>
            Add certificates and credentials that
            strengthen your resume.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addCertification}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Certification
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {certifications.map((item) => (
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
                      "Untitled Certification"}
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
            {certifications
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <CertificationForm
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteCertification(item.id)
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

function CertificationForm({
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
            CERTIFICATION ENTRY
          </span>

          <h2>
            {item.name ||
              "New Certification"}
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
            title="Delete certification"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Certification Name</label>

        <input
          value={item.name}
          onChange={(event) =>
            onUpdate(
              item.id,
              "name",
              event.target.value
            )
          }
          placeholder="AWS Certified Cloud Practitioner"
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
            placeholder="Amazon Web Services"
          />
        </div>

        <div className="editor-field">
          <label>Credential ID</label>

          <input
            value={item.credentialId}
            onChange={(event) =>
              onUpdate(
                item.id,
                "credentialId",
                event.target.value
              )
            }
            placeholder="ABC123XYZ"
          />
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Issue Date</label>

          <input
            value={item.date}
            onChange={(event) =>
              onUpdate(
                item.id,
                "date",
                event.target.value
              )
            }
            placeholder="August 2026"
          />
        </div>

        <div className="editor-field">
          <label>Expiry Date</label>

          <input
            value={item.expiryDate}
            onChange={(event) =>
              onUpdate(
                item.id,
                "expiryDate",
                event.target.value
              )
            }
            placeholder="August 2029"
          />
        </div>
      </div>

      <div className="editor-field">
        <label>Credential URL</label>

        <input
          value={item.website?.url || ""}
          onChange={(event) =>
            onUpdateWebsite(
              item.id,
              event.target.value
            )
          }
          placeholder="https://credly.com/..."
        />
      </div>
    </div>
  );
}

export default CertificationsEditor;