import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

function createVolunteer() {
  return {
    id: crypto.randomUUID(),
    organization: "",
    position: "",
    location: "",
    period: "",
    website: {
      url: "",
      label: "",
    },
    summary: "",
    hidden: false,
  };
}

function VolunteerEditor({ resume, onChange }) {
  const volunteer =
    resume.sections?.volunteer?.items || [];

  const [editingId, setEditingId] = useState(
    volunteer[0]?.id || null
  );

  const updateVolunteer = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        volunteer: {
          ...(resume.sections?.volunteer || {}),
          items,
        },
      },
    });
  };

  const addVolunteer = () => {
    const item = createVolunteer();

    updateVolunteer([...volunteer, item]);
    setEditingId(item.id);
  };

  const updateItem = (id, field, value) => {
    updateVolunteer(
      volunteer.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateWebsite = (id, value) => {
    updateVolunteer(
      volunteer.map((item) =>
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

  const deleteVolunteer = (id) => {
    const next = volunteer.filter(
      (item) => item.id !== id
    );

    updateVolunteer(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateVolunteer(
      volunteer.map((item) =>
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
            VOLUNTEER EXPERIENCE
          </span>

          <h1>Volunteer</h1>

          <p>
            Showcase community work, volunteering and
            leadership experience.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addVolunteer}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Volunteer Experience
        </button>
      </div>

      {volunteer.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              volunteer_activism
            </span>
          </div>

          <h2>No volunteer experience added yet</h2>

          <p>
            Add organizations, positions and
            contributions.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addVolunteer}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Volunteer Experience
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {volunteer.map((item) => (
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
                    {item.position ||
                      "Volunteer Position"}
                  </strong>

                  <span>
                    {item.organization ||
                      "Organization"}
                  </span>

                  {item.period && (
                    <small>{item.period}</small>
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
            {volunteer
              .filter(
                (item) =>
                  item.id === editingId
              )
              .map((item) => (
                <VolunteerForm
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteVolunteer(item.id)
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

function VolunteerForm({
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
            VOLUNTEER ENTRY
          </span>

          <h2>
            {item.position ||
              "New Volunteer Experience"}
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
            title="Delete volunteer experience"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-two-columns">
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
            placeholder="Red Cross"
          />
        </div>

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
            placeholder="Volunteer Coordinator"
          />
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Location</label>

          <input
            value={item.location}
            onChange={(event) =>
              onUpdate(
                item.id,
                "location",
                event.target.value
              )
            }
            placeholder="Chennai, India"
          />
        </div>

        <div className="editor-field">
          <label>Period</label>

          <input
            value={item.period}
            onChange={(event) =>
              onUpdate(
                item.id,
                "period",
                event.target.value
              )
            }
            placeholder="2024 - Present"
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
          placeholder="https://organization.org"
        />
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Describe your responsibilities and
            contributions.
          </span>
        </div>

        <RichTextEditor
          value={item.summary || ""}
          onChange={(value) =>
            onUpdate(
              item.id,
              "summary",
              value
            )
          }
          placeholder="Organized community events..."
        />
      </div>
    </div>
  );
}

export default VolunteerEditor;