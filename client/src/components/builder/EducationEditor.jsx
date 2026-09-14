import { useState } from "react";

function createEducation() {
  return {
    id: crypto.randomUUID(),
    hidden: false,
    school: "",
    degree: "",
    area: "",
    grade: "",
    period: "",
    location: "",
    website: {
      url: "",
      label: "",
    },
    description: "",
  };
}

function EducationEditor({ resume, onChange }) {
  const education =
    resume.sections?.education?.items || [];

  const [editingId, setEditingId] = useState(
    education[0]?.id || null
  );

  const updateEducation = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        education: {
          ...(resume.sections?.education || {}),
          items,
        },
      },
    });
  };

  const addEducation = () => {
    const item = createEducation();

    updateEducation([...education, item]);
    setEditingId(item.id);
  };

  const updateItem = (id, field, value) => {
    updateEducation(
      education.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateWebsite = (id, value) => {
    updateEducation(
      education.map((item) =>
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

  const deleteEducation = (id) => {
    const next = education.filter(
      (item) => item.id !== id
    );

    updateEducation(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateEducation(
      education.map((item) =>
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
            EDUCATIONAL BACKGROUND
          </span>

          <h1>Education</h1>

          <p>
            Add your degrees, schools and academic
            achievements.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addEducation}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              school
            </span>
          </div>

          <h2>No education added yet</h2>

          <p>
            Add your degree or qualification to your
            resume.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addEducation}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Education
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {education.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`experience-list-item ${
                  editingId === item.id ? "active" : ""
                }`}
                onClick={() => setEditingId(item.id)}
              >
                <div className="experience-list-main">
                  <strong>
                    {item.degree || "Untitled Degree"}
                  </strong>

                  <span>
                    {item.school || "Institution"}
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
            {education
              .filter((item) => item.id === editingId)
              .map((item) => (
                <EducationForm
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteEducation(item.id)
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

function EducationForm({
  item,
  onUpdate,
  onUpdateWebsite,
  onDelete,
  onToggleHidden,
}) {
  const [showWebsite, setShowWebsite] = useState(
    Boolean(item.website?.url)
  );

  return (
    <div className="experience-form-card">
      <div className="experience-form-header">
        <div>
          <span className="editor-eyebrow">
            EDUCATION ENTRY
          </span>

          <h2>
            {item.degree || "New Education"}
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
            title="Delete education"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>School / Institution</label>

          <input
            value={item.school}
            onChange={(event) =>
              onUpdate(
                item.id,
                "school",
                event.target.value
              )
            }
            placeholder="Anna University"
          />
        </div>

        <div className="editor-field">
          <label>Degree</label>

          <input
            value={item.degree}
            onChange={(event) =>
              onUpdate(
                item.id,
                "degree",
                event.target.value
              )
            }
            placeholder="B.E. Computer Science"
          />
        </div>
      </div>

      <div className="editor-two-columns">
        <div className="editor-field">
          <label>Field of Study</label>

          <input
            value={item.area}
            onChange={(event) =>
              onUpdate(
                item.id,
                "area",
                event.target.value
              )
            }
            placeholder="Computer Science"
          />
        </div>

        <div className="editor-field">
          <label>Grade</label>

          <input
            value={item.grade}
            onChange={(event) =>
              onUpdate(
                item.id,
                "grade",
                event.target.value
              )
            }
            placeholder="8.7 CGPA"
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
            placeholder="2022 - 2026"
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
          placeholder="https://university.edu"
          disabled={!showWebsite}
        />

        <button
          type="button"
          className="inline-text-button"
          onClick={() =>
            setShowWebsite((current) => !current)
          }
        >
          {showWebsite ? "Remove website" : "Add website"}
        </button>
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Description</label>

          <span className="editor-hint">
            Coursework, achievements, activities, etc.
          </span>
        </div>

        {/* We'll switch this to RichTextEditor next,
            exactly like Experience. */}
        <textarea
          rows={8}
          value={item.description}
          onChange={(event) =>
            onUpdate(
              item.id,
              "description",
              event.target.value
            )
          }
          placeholder="Describe relevant academic achievements..."
        />
      </div>
    </div>
  );
}

export default EducationEditor;