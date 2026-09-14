import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

function createProject() {
  return {
    id: crypto.randomUUID(),
    hidden: false,
    name: "",
    description: "",
    period: "",
    location: "",
    website: {
      url: "",
      label: "",
    },
    highlights: [],
  };
}

function ProjectEditor({ resume, onChange }) {
  const projects = resume.sections?.projects?.items || [];

  const [editingId, setEditingId] = useState(
    projects[0]?.id || null
  );

  const updateProjects = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        projects: {
          ...(resume.sections?.projects || {}),
          items,
        },
      },
    });
  };

  const addProject = () => {
    const item = createProject();
    updateProjects([...projects, item]);
    setEditingId(item.id);
  };

  const updateItem = (id, field, value) => {
    updateProjects(
      projects.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateWebsite = (id, value) => {
    updateProjects(
      projects.map((item) =>
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

  const deleteProject = (id) => {
    const next = projects.filter((item) => item.id !== id);

    updateProjects(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateProjects(
      projects.map((item) =>
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
          <span className="editor-eyebrow">PROJECTS</span>
          <h1>Projects</h1>
          <p>
            Showcase projects, products and work that
            demonstrate your skills.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addProject}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              folder
            </span>
          </div>

          <h2>No projects added yet</h2>

          <p>
            Add projects that are relevant to the role
            you're applying for.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addProject}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Project
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {projects.map((item) => (
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
                    {item.name || "Untitled Project"}
                  </strong>

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
            {projects
              .filter((item) => item.id === editingId)
              .map((item) => (
                <ProjectForm
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onUpdateWebsite={updateWebsite}
                  onDelete={() =>
                    deleteProject(item.id)
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

function ProjectForm({
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
            PROJECT ENTRY
          </span>
          <h2>{item.name || "New Project"}</h2>
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
            title="Delete project"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Project Name</label>
        <input
          value={item.name}
          onChange={(event) =>
            onUpdate(
              item.id,
              "name",
              event.target.value
            )
          }
          placeholder="ResumeSync"
        />
      </div>

      <div className="editor-two-columns">
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
            placeholder="2025 - Present"
          />
        </div>

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
          placeholder="https://github.com/..."
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
            Explain what you built and why it matters.
          </span>
        </div>

        <RichTextEditor
          value={item.description || ""}
          onChange={(value) =>
            onUpdate(
              item.id,
              "description",
              value
            )
          }
          placeholder="Built a full-stack resume builder..."
        />
      </div>
    </div>
  );
}

export default ProjectEditor;