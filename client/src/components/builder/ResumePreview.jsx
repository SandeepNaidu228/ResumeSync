function ResumePreview({ resume }) {
  const basics = resume.basics || {};
  const summary = resume.summary || {};

  const experiences =
    resume.sections?.experience?.items || [];

  const education =
    resume.sections?.education?.items || [];

  const projects =
    resume.sections?.projects?.items || [];

  const profiles =
    resume.sections?.profiles?.items || [];

  const languages =
    resume.sections?.languages?.items || [];

  const certifications =
    resume.sections?.certifications?.items || [];

  const visibleSkills =
    resume.sections?.skills?.items?.filter(
      (item) =>
        !item.hidden &&
        (
          item.name ||
          item.items?.some(Boolean) ||
          item.keywords?.some(Boolean)
        )
    ) || [];

  const visibleAwards =
    resume.sections?.awards?.items?.filter(
      (item) =>
        !item.hidden &&
        (
          item.title ||
          item.issuer ||
          item.date ||
          item.summary
        )
    ) || [];

  const visiblePublications =
    resume.sections?.publications?.items?.filter(
      (item) =>
        !item.hidden &&
        (
          item.name ||
          item.publisher ||
          item.date ||
          item.summary ||
          item.url
        )
    ) || [];

  const visibleVolunteer =
    resume.sections?.volunteer?.items?.filter(
      (item) =>
        !item.hidden &&
        (
          item.position ||
          item.organization ||
          item.period ||
          item.location ||
          item.summary ||
          item.website?.url
        )
    ) || [];

  const visibleInterests =
    resume.sections?.interests?.items?.filter(
      (item) =>
        !item.hidden &&
        item.name
    ) || [];

  const primaryColor =
    resume.metadata?.primaryColor || "#0ea841";

  return (
    <aside className="resume-preview-panel">

      <div className="preview-toolbar">
        <span>LIVE PREVIEW</span>

        <button
          type="button"
          title="Expand preview"
        >
          <span className="material-symbols-outlined">
            open_in_full
          </span>
        </button>
      </div>

      <div className="preview-stage">

        <div
          className="resume-paper"
          style={{
            "--resume-primary": primaryColor,
          }}
        >

          {/* =========================
              HEADER
          ========================= */}

          <header className="resume-paper-header">

            <h1>
              {basics.name || "Your Name"}
            </h1>

            {basics.headline && (
              <h2>{basics.headline}</h2>
            )}

            <div className="resume-contact">

              {basics.email && (
                <span>{basics.email}</span>
              )}

              {basics.phone && (
                <span>{basics.phone}</span>
              )}

              {basics.location && (
                <span>{basics.location}</span>
              )}

              {basics.website?.url && (
                <span>
                  {basics.website.url}
                </span>
              )}

            </div>

            {profiles.some(
              (profile) => !profile.hidden
            ) && (
              <div className="resume-profiles">
                {profiles
                  .filter((profile) => !profile.hidden)
                  .map((profile) => (
                    <span key={profile.id}>
                      {profile.network ||
                        profile.username}
                    </span>
                  ))}
              </div>
            )}

          </header>

          {/* =========================
              SUMMARY
          ========================= */}

          {summary.content &&
            !summary.hidden && (
              <section className="paper-section">

                <h3>
                  {summary.title || "Summary"}
                </h3>

                <div
                  className="paper-rich-text"
                  dangerouslySetInnerHTML={{
                    __html: summary.content,
                  }}
                />

              </section>
            )}

          {/* =========================
              EXPERIENCE
          ========================= */}

          {experiences.some(
            (item) => !item.hidden
          ) && (
            <section className="paper-section">

              <h3>Experience</h3>

              <div className="paper-items">

                {experiences
                  .filter((item) => !item.hidden)
                  .map((experience) => (
                    <article
                      className="paper-item"
                      key={experience.id}
                    >

                      <div className="paper-item-header">

                        <div>
                          <h4>
                            {experience.position ||
                              "Position"}
                          </h4>

                          {experience.company && (
                            <p className="paper-company">
                              {experience.company}
                            </p>
                          )}
                        </div>

                        {experience.period && (
                          <span className="paper-period">
                            {experience.period}
                          </span>
                        )}

                      </div>

                      {experience.location && (
                        <p className="paper-location">
                          {experience.location}
                        </p>
                      )}

                      {experience.description && (
                        <div
                          className="paper-rich-text"
                          dangerouslySetInnerHTML={{
                            __html:
                              experience.description,
                          }}
                        />
                      )}

                    </article>
                  ))}

              </div>

            </section>
          )}

          {/* =========================
              EDUCATION
          ========================= */}

          {education.some(
            (item) => !item.hidden
          ) && (
            <section className="paper-section">

              <h3>Education</h3>

              <div className="paper-items">

                {education
                  .filter((item) => !item.hidden)
                  .map((item) => (
                    <article
                      className="paper-item"
                      key={item.id}
                    >

                      <div className="paper-item-header">

                        <div>
                          <h4>
                            {item.degree ||
                              "Degree"}
                          </h4>

                          {item.school && (
                            <p className="paper-company">
                              {item.school}
                            </p>
                          )}
                        </div>

                        {item.period && (
                          <span className="paper-period">
                            {item.period}
                          </span>
                        )}

                      </div>

                      {item.area && (
                        <p className="paper-secondary">
                          {item.area}
                        </p>
                      )}

                      {item.grade && (
                        <p className="paper-secondary">
                          Grade: {item.grade}
                        </p>
                      )}

                      {item.location && (
                        <p className="paper-location">
                          {item.location}
                        </p>
                      )}

                    </article>
                  ))}

              </div>

            </section>
          )}

          {/* =========================
              SKILLS
          ========================= */}

          {visibleSkills.length > 0 && (
            <section className="paper-section">

              <h3>Skills</h3>

              <div className="paper-skills">

                {visibleSkills.map((skill) => (
                  <div
                    className="paper-skill-group"
                    key={skill.id}
                  >

                    {skill.name && (
                      <strong>
                        {skill.name}
                      </strong>
                    )}

                    <span>
                      {(skill.items || skill.keywords || [])
                        .filter(Boolean)
                        .join(", ")}
                    </span>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* =========================
              PROJECTS
          ========================= */}

          {projects.some(
            (item) => !item.hidden
          ) && (
            <section className="paper-section">

              <h3>Projects</h3>

              <div className="paper-items">

                {projects
                  .filter((item) => !item.hidden)
                  .map((project) => (
                    <article
                      className="paper-item"
                      key={project.id}
                    >

                      <div className="paper-item-header">

                        <div>
                          <h4>
                            {project.name ||
                              "Project"}
                          </h4>

                          {project.website?.url && (
                            <p className="paper-secondary">
                              {project.website.url}
                            </p>
                          )}
                        </div>

                        {project.period && (
                          <span className="paper-period">
                            {project.period}
                          </span>
                        )}

                      </div>

                      {project.location && (
                        <p className="paper-location">
                          {project.location}
                        </p>
                      )}

                      {project.description && (
                        <div
                          className="paper-rich-text"
                          dangerouslySetInnerHTML={{
                            __html:
                              project.description,
                          }}
                        />
                      )}

                    </article>
                  ))}

              </div>

            </section>
          )}

          {/* =========================
              LANGUAGES
          ========================= */}

          {languages.some(
            (item) => !item.hidden
          ) && (
            <section className="paper-section">

              <h3>Languages</h3>

              <div className="paper-simple-list">

                {languages
                  .filter((item) => !item.hidden)
                  .map((language) => (
                    <div key={language.id}>

                      <strong>
                        {language.language}
                      </strong>

                      {language.fluency && (
                        <span>
                          {" "}— {language.fluency}
                        </span>
                      )}

                    </div>
                  ))}

              </div>

            </section>
          )}

          {/* =========================
              CERTIFICATIONS
          ========================= */}

          {certifications.some(
            (item) => !item.hidden
          ) && (
            <section className="paper-section">

              <h3>Certifications</h3>

              <div className="paper-items">

                {certifications
                  .filter((item) => !item.hidden)
                  .map((certificate) => (
                    <article
                      className="paper-item"
                      key={certificate.id}
                    >

                      <div className="paper-item-header">

                        <div>
                          <h4>
                            {certificate.name}
                          </h4>

                          {certificate.issuer && (
                            <p className="paper-company">
                              {certificate.issuer}
                            </p>
                          )}
                        </div>

                        {certificate.date && (
                          <span className="paper-period">
                            {certificate.date}
                          </span>
                        )}

                      </div>

                      {certificate.credentialId && (
                        <p className="paper-secondary">
                          Credential ID:{" "}
                          {certificate.credentialId}
                        </p>
                      )}

                      {certificate.expiryDate && (
                        <p className="paper-secondary">
                          Expires:{" "}
                          {certificate.expiryDate}
                        </p>
                      )}

                      {certificate.website?.url && (
                        <p className="paper-secondary">
                          {certificate.website.url}
                        </p>
                      )}

                    </article>
                  ))}

              </div>

            </section>
          )}

          {/* =========================
              AWARDS
          ========================= */}

          {visibleAwards.length > 0 && (
            <section className="paper-section">

              <h3>Awards</h3>

              <div className="paper-items">

                {visibleAwards.map((award) => (
                  <article
                    className="paper-item"
                    key={award.id}
                  >

                    <div className="paper-item-header">

                      <div>
                        {award.title && (
                          <h4>
                            {award.title}
                          </h4>
                        )}

                        {award.issuer && (
                          <p className="paper-company">
                            {award.issuer}
                          </p>
                        )}
                      </div>

                      {award.date && (
                        <span className="paper-period">
                          {award.date}
                        </span>
                      )}

                    </div>

                    {award.summary && (
                      <p className="paper-secondary">
                        {award.summary}
                      </p>
                    )}

                  </article>
                ))}

              </div>

            </section>
          )}

          {/* =========================
              PUBLICATIONS
          ========================= */}

          {visiblePublications.length > 0 && (
            <section className="paper-section">

              <h3>Publications</h3>

              <div className="paper-items">

                {visiblePublications.map((publication) => (
                  <article
                    className="paper-item"
                    key={publication.id}
                  >

                    <div className="paper-item-header">

                      <div>
                        {publication.name && (
                          <h4>
                            {publication.name}
                          </h4>
                        )}

                        {publication.publisher && (
                          <p className="paper-company">
                            {publication.publisher}
                          </p>
                        )}
                      </div>

                      {publication.date && (
                        <span className="paper-period">
                          {publication.date}
                        </span>
                      )}

                    </div>

                    {publication.summary && (
                      <p className="paper-secondary">
                        {publication.summary}
                      </p>
                    )}

                    {publication.url && (
                      <p className="paper-secondary">
                        {publication.url}
                      </p>
                    )}

                  </article>
                ))}

              </div>

            </section>
          )}

          {/* =========================
              VOLUNTEER
          ========================= */}

          {visibleVolunteer.length > 0 && (
            <section className="paper-section">

              <h3>Volunteer</h3>

              <div className="paper-items">

                {visibleVolunteer.map((item) => (
                  <article
                    className="paper-item"
                    key={item.id}
                  >

                    <div className="paper-item-header">

                      <div>
                        {item.position && (
                          <h4>
                            {item.position}
                          </h4>
                        )}

                        {item.organization && (
                          <p className="paper-company">
                            {item.organization}
                          </p>
                        )}
                      </div>

                      {item.period && (
                        <span className="paper-period">
                          {item.period}
                        </span>
                      )}

                    </div>

                    {item.location && (
                      <p className="paper-location">
                        {item.location}
                      </p>
                    )}

                    {item.summary && (
                      <div
                        className="paper-rich-text"
                        dangerouslySetInnerHTML={{
                          __html: item.summary,
                        }}
                      />
                    )}

                    {item.website?.url && (
                      <p className="paper-secondary">
                        {item.website.url}
                      </p>
                    )}

                  </article>
                ))}

              </div>

            </section>
          )}

          {/* =========================
              INTERESTS
          ========================= */}

          {visibleInterests.length > 0 && (
            <section className="paper-section">

              <h3>Interests</h3>

              <div className="paper-simple-list">

                {visibleInterests.map((item) => (
                  <div key={item.id}>
                    {item.name}
                  </div>
                ))}

              </div>

            </section>
          )}

          {/* =========================
                REFERENCES
            ========================= */}

            {resume.sections?.references?.items?.some(
            (item) =>
                !item.hidden &&
                (
                item.name ||
                item.position ||
                item.organization ||
                item.email ||
                item.phone ||
                item.website?.url ||
                item.description
                )
            ) && (
            <section className="paper-section">
                <h3>References</h3>

                <div className="paper-items">
                {resume.sections.references.items
                    .filter(
                    (item) =>
                        !item.hidden &&
                        (
                        item.name ||
                        item.position ||
                        item.organization ||
                        item.email ||
                        item.phone ||
                        item.website?.url ||
                        item.description
                        )
                    )
                    .map((reference) => (
                    <article
                        className="paper-item"
                        key={reference.id}
                    >
                        <div className="paper-item-header">
                        <div>
                            {reference.name && (
                            <h4>{reference.name}</h4>
                            )}

                            {(reference.position ||
                            reference.organization) && (
                            <p className="paper-company">
                                {reference.position}
                                {reference.position &&
                                reference.organization &&
                                " · "}
                                {reference.organization}
                            </p>
                            )}
                        </div>
                        </div>

                        <div className="paper-secondary">
                        {reference.email && (
                            <div>{reference.email}</div>
                        )}

                        {reference.phone && (
                            <div>{reference.phone}</div>
                        )}

                        {reference.website?.url && (
                            <div>
                            {reference.website.url}
                            </div>
                        )}
                        </div>

                        {reference.description && (
                        <p className="paper-secondary">
                            {reference.description}
                        </p>
                        )}
                    </article>
                    ))}
                </div>
            </section>
            )}

        </div>
      </div>
    </aside>
  );
}

export default ResumePreview;