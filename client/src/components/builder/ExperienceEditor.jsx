import { useState } from "react";

function createExperience() {
  return {
    id: crypto.randomUUID(),
    hidden: false,
    company: "",
    position: "",
    location: "",
    period: "",
    website: {
      url: "",
      label: "",
    },
    description: "",
  };
}

function ExperienceEditor({ resume, onChange }) {
  const experiences =
    resume.sections?.experience?.items || [];

  const [editingId, setEditingId] = useState(
    experiences[0]?.id || null
  );

  const updateExperiences = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        experience: {
          ...resume.sections?.experience,
          items,
        },
      },
    });
  };

  const addExperience = () => {
    const item = createExperience();

    updateExperiences([
      ...experiences,
      item,
    ]);

    setEditingId(item.id);
  };

  const updateExperience = (id, field, value) => {
    const updated = experiences.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    updateExperiences(updated);
  };

  const updateWebsite = (id, value) => {
    const updated = experiences.map((item) =>
      item.id === id
        ? {
            ...item,
            website: {
              ...(item.website || {}),
              url: value,
            },
          }
        : item
    );

    updateExperiences(updated);
  };

  const deleteExperience = (id) => {
    const updated = experiences.filter(
      (item) => item.id !== id
    );

    updateExperiences(updated);

    if (editingId === id) {
      setEditingId(updated[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    const updated = experiences.map((item) =>
      item.id === id
        ? {
            ...item,
            hidden: !item.hidden,
          }
        : item
    );

    updateExperiences(updated);
  };

  return (
    <section className="resume-editor">

      <div className="editor-heading">
        <div>
          <span className="editor-eyebrow">
            WORK HISTORY
          </span>

          <h1>Experience</h1>

          <p>
            Add your professional experience and
            describe the impact you made.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addExperience}
        >
          <span className="material-symbols-outlined">
            add
          </span>

          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              work
            </span>
          </div>

          <h2>No experience added yet</h2>

          <p>
            Add your latest role first. You can add
            as many positions as you need.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addExperience}
          >
            <span className="material-symbols-outlined">
              add
            </span>

            Add Experience
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">

          <div className="experience-list">
            {experiences.map((experience) => (
              <button
                type="button"
                key={experience.id}
                className={`experience-list-item ${
                  editingId === experience.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setEditingId(experience.id)
                }
              >
                <div className="experience-list-main">
                  <strong>
                    {experience.position ||
                      "Untitled Position"}
                  </strong>

                  <span>
                    {experience.company ||
                      "Company name"}
                  </span>

                  {experience.period && (
                    <small>
                      {experience.period}
                    </small>
                  )}
                </div>

                {experience.hidden && (
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="experience-form">

            {experiences
              .filter(
                (experience) =>
                  experience.id === editingId
              )
              .map((experience) => (
                <ExperienceForm
                  key={experience.id}
                  experience={experience}
                  onUpdate={updateExperience}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteExperience(
                      experience.id
                    )
                  }
                  onToggleHidden={() =>
                    toggleHidden(
                      experience.id
                    )
                  }
                />
              ))}

          </div>

        </div>
      )}

    </section>
  );
}

function ExperienceForm({
  experience,
  onUpdate,
  onUpdateWebsite,
  onDelete,
  onToggleHidden,
}) {
  const [showWebsite, setShowWebsite] =
    useState(Boolean(experience.website?.url));

  return (
    <div className="experience-form-card">

      <div className="experience-form-header">
        <div>
          <span className="editor-eyebrow">
            EXPERIENCE ENTRY
          </span>

          <h2>
            {experience.position ||
              "New Experience"}
          </h2>
        </div>

        <div className="experience-form-actions">

          <button
            type="button"
            className="builder-icon-button"
            onClick={onToggleHidden}
            title={
              experience.hidden
                ? "Show in resume"
                : "Hide from resume"
            }
          >
            <span className="material-symbols-outlined">
              {experience.hidden
                ? "visibility_off"
                : "visibility"}
            </span>
          </button>

          <button
            type="button"
            className="builder-icon-button danger"
            onClick={onDelete}
            title="Delete experience"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>

        </div>
      </div>

      <div className="editor-two-columns">

        <div className="editor-field">
          <label>Position</label>

          <input
            value={experience.position}
            onChange={(event) =>
              onUpdate(
                experience.id,
                "position",
                event.target.value
              )
            }
            placeholder="Software Engineer"
          />
        </div>

        <div className="editor-field">
          <label>Company</label>

          <input
            value={experience.company}
            onChange={(event) =>
              onUpdate(
                experience.id,
                "company",
                event.target.value
              )
            }
            placeholder="Google"
          />
        </div>

      </div>

      <div className="editor-two-columns">

        <div className="editor-field">
          <label>Location</label>

          <input
            value={experience.location}
            onChange={(event) =>
              onUpdate(
                experience.id,
                "location",
                event.target.value
              )
            }
            placeholder="Bengaluru, India"
          />
        </div>

        <div className="editor-field">
          <label>Period</label>

          <input
            value={experience.period}
            onChange={(event) =>
              onUpdate(
                experience.id,
                "period",
                event.target.value
              )
            }
            placeholder="Jan 2024 – Present"
          />
        </div>

      </div>

      <div className="editor-field">
        <label>Website</label>

        <input
          value={experience.website?.url || ""}
          onChange={(event) =>
            onUpdateWebsite(
              experience.id,
              event.target.value
            )
          }
          placeholder="https://company.com"
          disabled={!showWebsite}
        />

        <button
          type="button"
          className="inline-text-button"
          onClick={() =>
            setShowWebsite((current) => !current)
          }
        >
          {showWebsite
            ? "Remove website"
            : "Add website"}
        </button>
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Describe your responsibilities and impact
          </span>
        </div>

        <textarea
          rows={10}
          value={experience.description}
          onChange={(event) =>
            onUpdate(
              experience.id,
              "description",
              event.target.value
            )
          }
          placeholder={
            "• Built and maintained...\n" +
            "• Improved...\n" +
            "• Led..."
          }
        />
      </div>

    </div>
  );
}

export default ExperienceEditor;