import ExperienceEditor from "./ExperienceEditor";

function ResumeEditor({
  resume,
  activeSection,
  onChange,
}) {
  const basics = resume.basics || {};
  const summary = resume.summary || {};

  const updateBasics = (field, value) => {
    onChange({
      basics: {
        ...basics,
        [field]: value,
      },
    });
  };

  const updateWebsite = (value) => {
    onChange({
      basics: {
        ...basics,
        website: {
          ...(basics.website || {}),
          url: value,
        },
      },
    });
  };

  if (activeSection === "basics") {
    return (
      <section className="resume-editor">
        <div className="editor-heading">
          <div>
            <span className="editor-eyebrow">
              PERSONAL INFORMATION
            </span>

            <h1>Basics</h1>

            <p>
              Add the information employers should see
              at the top of your resume.
            </p>
          </div>
        </div>

        <div className="editor-form">
          <div className="editor-field">
            <label>Full Name</label>

            <input
              type="text"
              value={basics.name || ""}
              onChange={(event) =>
                updateBasics(
                  "name",
                  event.target.value
                )
              }
              placeholder="John Doe"
            />
          </div>

          <div className="editor-field">
            <label>Professional Headline</label>

            <input
              type="text"
              value={basics.headline || ""}
              onChange={(event) =>
                updateBasics(
                  "headline",
                  event.target.value
                )
              }
              placeholder="Software Engineer"
            />
          </div>

          <div className="editor-two-columns">
            <div className="editor-field">
              <label>Email</label>

              <input
                type="email"
                value={basics.email || ""}
                onChange={(event) =>
                  updateBasics(
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
                type="tel"
                value={basics.phone || ""}
                onChange={(event) =>
                  updateBasics(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="editor-field">
            <label>Location</label>

            <input
              type="text"
              value={basics.location || ""}
              onChange={(event) =>
                updateBasics(
                  "location",
                  event.target.value
                )
              }
              placeholder="Chennai, India"
            />
          </div>

          <div className="editor-field">
            <label>Website</label>

            <input
              type="url"
              value={basics.website?.url || ""}
              onChange={(event) =>
                updateWebsite(event.target.value)
              }
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </section>
    );
  }

  if (activeSection === "summary") {
    return (
      <section className="resume-editor">
        <div className="editor-heading">
          <div>
            <span className="editor-eyebrow">
              PROFESSIONAL PROFILE
            </span>

            <h1>Summary</h1>

            <p>
              Introduce yourself and highlight your
              strongest professional qualities.
            </p>
          </div>
        </div>

        <div className="editor-form">
          <div className="editor-field">
            <label>Professional Summary</label>

            <textarea
              rows={10}
              value={summary.content || ""}
              onChange={(event) =>
                onChange({
                  summary: {
                    ...summary,
                    content: event.target.value,
                  },
                })
              }
              placeholder="Write a short professional summary..."
            />
          </div>
        </div>
      </section>
    );
  }

  if (activeSection === "experience") {
    return (
        <ExperienceEditor
        resume={resume}
        onChange={onChange}
        />
    );
    }

  return (
    <section className="resume-editor">
      <div className="editor-heading">
        <div>
          <span className="editor-eyebrow">
            RESUME BUILDER
          </span>

          <h1>
            {getSectionLabel(activeSection)}
          </h1>

          <p>
            This section will be implemented next.
          </p>
        </div>
      </div>

      <div className="editor-coming-soon">
        <span className="material-symbols-outlined">
          construction
        </span>

        <h2>
          {getSectionLabel(activeSection)}
        </h2>

        <p>
          The section is already part of the builder
          architecture. Its full editor will be added
          next.
        </p>
      </div>
    </section>
  );
}

function getSectionLabel(section) {
  if (!section) {
    return "Resume";
  }

  return section.charAt(0).toUpperCase() + section.slice(1);
}

export default ResumeEditor;