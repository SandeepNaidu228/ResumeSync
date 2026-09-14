import { useState } from "react";

function createSkillGroup() {
  return {
    id: crypto.randomUUID(),
    name: "",
    hidden: false,
    items: [],
  };
}

function SkillsEditor({ resume, onChange }) {
  const groups = Array.isArray(
    resume?.sections?.skills?.items
  )
    ? resume.sections.skills.items
    : [];

  const [editingId, setEditingId] = useState(
    groups[0]?.id || null
  );

  const updateGroups = (items) => {
    onChange({
      sections: {
        ...resume.sections,
        skills: {
          ...(resume.sections?.skills || {}),
          items,
        },
      },
    });
  };

  const addGroup = () => {
    const group = createSkillGroup();

    updateGroups([...groups, group]);
    setEditingId(group.id);
  };

  const updateGroup = (id, field, value) => {
    updateGroups(
      groups.map((group) =>
        group.id === id
          ? { ...group, [field]: value }
          : group
      )
    );
  };

  const deleteGroup = (id) => {
    const next = groups.filter(
      (group) => group.id !== id
    );

    updateGroups(next);

    if (editingId === id) {
      setEditingId(next[0]?.id || null);
    }
  };

  const toggleHidden = (id) => {
    updateGroups(
      groups.map((group) =>
        group.id === id
          ? { ...group, hidden: !group.hidden }
          : group
      )
    );
  };

  const addSkill = (id) => {
    updateGroups(
      groups.map((group) =>
        group.id === id
          ? {
              ...group,
              items: [...group.items, ""],
            }
          : group
      )
    );
  };

  const updateSkill = (groupId, index, value) => {
    updateGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: (group.items || []).map(
                (skill, skillIndex) =>
                  skillIndex === index
                    ? value
                    : skill
              ),
            }
          : group
      )
    );
  };

  const deleteSkill = (groupId, index) => {
    updateGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.filter(
                (_, skillIndex) =>
                  skillIndex !== index
              ),
            }
          : group
      )
    );
  };

  return (
    <section className="resume-editor">
      <div className="editor-heading">
        <div>
          <span className="editor-eyebrow">
            SKILLS
          </span>

          <h1>Skills</h1>

          <p>
            Organize your technical and professional
            skills into groups.
          </p>
        </div>

        <button
          type="button"
          className="editor-add-button"
          onClick={addGroup}
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Skill Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="editor-empty">
          <div className="editor-empty-icon">
            <span className="material-symbols-outlined">
              psychology
            </span>
          </div>

          <h2>No skills added yet</h2>

          <p>
            Create a group such as Programming,
            Frameworks or Tools.
          </p>

          <button
            type="button"
            className="workspace-primary-btn"
            onClick={addGroup}
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Skill Group
          </button>
        </div>
      ) : (
        <div className="experience-editor-layout">
          <div className="experience-list">
            {groups.map((group) => (
              <button
                type="button"
                key={group.id}
                className={`experience-list-item ${
                  editingId === group.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setEditingId(group.id)
                }
              >
                <div className="experience-list-main">
                  <strong>
                    {group.name ||
                      "Untitled Group"}
                  </strong>

                  <small>
                    {(group.items || []).length}{" "}
                    {(group.items || []).length === 1
                        ? "skill"
                        : "skills"}
                  </small>
                </div>

                {group.hidden && (
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="experience-form">
            {groups
              .filter(
                (group) =>
                  group.id === editingId
              )
              .map((group) => (
                <SkillGroupForm
                  key={group.id}
                  group={group}
                  onUpdate={updateGroup}
                  onDelete={() =>
                    deleteGroup(group.id)
                  }
                  onToggleHidden={() =>
                    toggleHidden(group.id)
                  }
                  onAddSkill={() =>
                    addSkill(group.id)
                  }
                  onUpdateSkill={(index, value) =>
                    updateSkill(
                      group.id,
                      index,
                      value
                    )
                  }
                  onDeleteSkill={(index) =>
                    deleteSkill(
                      group.id,
                      index
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

function SkillGroupForm({
  group,
  onUpdate,
  onDelete,
  onToggleHidden,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
}) {
  return (
    <div className="experience-form-card">
      <div className="experience-form-header">
        <div>
          <span className="editor-eyebrow">
            SKILL GROUP
          </span>

          <h2>
            {group.name || "New Skill Group"}
          </h2>
        </div>

        <div className="experience-form-actions">
          <button
            type="button"
            className="builder-icon-button"
            onClick={onToggleHidden}
            title={
              group.hidden
                ? "Show in resume"
                : "Hide from resume"
            }
          >
            <span className="material-symbols-outlined">
              {group.hidden
                ? "visibility_off"
                : "visibility"}
            </span>
          </button>

          <button
            type="button"
            className="builder-icon-button danger"
            onClick={onDelete}
            title="Delete skill group"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="editor-field">
        <label>Group Name</label>

        <input
          value={group.name}
          onChange={(event) =>
            onUpdate(
              group.id,
              "name",
              event.target.value
            )
          }
          placeholder="Programming Languages"
        />
      </div>

      <div className="editor-field">
        <div className="editor-label-row">
          <label>Skills</label>

          <span className="editor-hint">
            Add individual skills to this group.
          </span>
        </div>

        <div className="skills-editor-list">
          {(group.items || []).map(
            (skill, index) => (
              <div
                className="skill-editor-row"
                key={`${group.id}-${index}`}
              >
                <input
                  value={skill}
                  onChange={(event) =>
                    onUpdateSkill(
                      index,
                      event.target.value
                    )
                  }
                  placeholder="JavaScript"
                />

                <button
                  type="button"
                  className="builder-icon-button danger"
                  onClick={() =>
                    onDeleteSkill(index)
                  }
                >
                  <span className="material-symbols-outlined">
                    delete
                  </span>
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          className="inline-text-button"
          onClick={onAddSkill}
        >
          + Add skill
        </button>
      </div>
    </div>
  );
}

export default SkillsEditor;