import "./ClassicATS.css";

function ClassicATS({ resume }) {
  const basics = resume?.basics || {};
  const summary = resume?.summary || {};

  const profiles =
    resume?.sections?.profiles?.items || [];

  const experiences =
    resume?.sections?.experience?.items || [];

  const education =
    resume?.sections?.education?.items || [];

  const projects =
    resume?.sections?.projects?.items || [];

  const skills =
    resume?.sections?.skills?.items || [];

  const languages =
    resume?.sections?.languages?.items || [];

  const certifications =
    resume?.sections?.certifications?.items || [];

  const awards =
    resume?.sections?.awards?.items || [];

  const publications =
    resume?.sections?.publications?.items || [];

  const volunteer =
    resume?.sections?.volunteer?.items || [];

  const interests =
    resume?.sections?.interests?.items || [];

  const references =
    resume?.sections?.references?.items || [];

  const visible = (items) =>
    items.filter((item) => !item.hidden);

  const visibleExperiences = visible(experiences);
  const visibleEducation = visible(education);
  const visibleProjects = visible(projects);
  const visibleSkills = visible(skills);
  const visibleLanguages = visible(languages);
  const visibleCertifications = visible(certifications);
  const visibleAwards = visible(awards);
  const visiblePublications = visible(publications);
  const visibleVolunteer = visible(volunteer);
  const visibleInterests = visible(interests);
  const visibleReferences = visible(references);
  const visibleProfiles = visible(profiles);

  const hasSummary =
    summary?.content && !summary.hidden;

  return (
    <div className="classic-ats-template">

      {/* =========================
          HEADER
      ========================= */}

      <header className="classic-ats-header">

        {basics.name && (
          <h1>{basics.name}</h1>
        )}

        {basics.headline && (
          <div className="classic-ats-headline">
            {basics.headline}
          </div>
        )}

        <div className="classic-ats-contact">

          {basics.phone && (
            <span>{basics.phone}</span>
          )}

          {basics.email && (
            <a href={`mailto:${basics.email}`}>
              {basics.email}
            </a>
          )}

          {basics.location && (
            <span>{basics.location}</span>
          )}

          {basics.website?.url && (
            <a
              href={basics.website.url}
              target="_blank"
              rel="noreferrer"
            >
              {basics.website.label ||
                basics.website.url}
            </a>
          )}

          {visibleProfiles.map((profile) => (
            <a
              key={profile.id}
              href={profile.url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              {profile.network ||
                profile.username ||
                profile.url}
            </a>
          ))}

        </div>
      </header>

      {/* =========================
          SUMMARY
      ========================= */}

      {hasSummary && (
        <ClassicSection
          title={summary.title || "Profile Summary"}
        >
          <div
            className="classic-ats-rich-text"
            dangerouslySetInnerHTML={{
              __html: summary.content,
            }}
          />
        </ClassicSection>
      )}

      {/* =========================
          EDUCATION
      ========================= */}

      {visibleEducation.length > 0 && (
        <ClassicSection title="Education">

          {visibleEducation.map((item) => (
            <ClassicEntry
              key={item.id}
              title={item.school}
              subtitle={item.degree}
              meta={item.location}
              date={item.period}
            >
              {item.area && (
                <div>{item.area}</div>
              )}

              {item.grade && (
                <div>
                  Grade: {item.grade}
                </div>
              )}

              {item.description && (
                <div
                  className="classic-ats-rich-text"
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
              )}
            </ClassicEntry>
          ))}

        </ClassicSection>
      )}

      {/* =========================
          EXPERIENCE
      ========================= */}

      {visibleExperiences.length > 0 && (
        <ClassicSection title="Experience">

          {visibleExperiences.map((item) => (
            <ClassicEntry
              key={item.id}
              title={item.company}
              subtitle={item.position}
              meta={item.location}
              date={item.period}
            >
              {item.description && (
                <div
                  className="classic-ats-rich-text"
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
              )}
            </ClassicEntry>
          ))}

        </ClassicSection>
      )}

      {/* =========================
          PROJECTS
      ========================= */}

      {visibleProjects.length > 0 && (
        <ClassicSection title="Projects">

          {visibleProjects.map((item) => (
            <ClassicProject
              key={item.id}
              item={item}
            />
          ))}

        </ClassicSection>
      )}

      {/* =========================
          SKILLS
      ========================= */}

      {visibleSkills.length > 0 && (
        <ClassicSection title="Technical Skills">

          <div className="classic-ats-skills">

            {visibleSkills.map((group) => {
              const values = (
                group.items ||
                group.keywords ||
                []
              ).filter(Boolean);

              if (
                !group.name &&
                values.length === 0
              ) {
                return null;
              }

              return (
                <div
                  className="classic-ats-skill-row"
                  key={group.id}
                >

                  {group.name && (
                    <strong>
                      {group.name}:
                    </strong>
                  )}

                  {values.length > 0 && (
                    <span>
                      {values.join(", ")}
                    </span>
                  )}

                </div>
              );
            })}

          </div>
        </ClassicSection>
      )}

      {/* =========================
          CERTIFICATIONS
      ========================= */}

      {visibleCertifications.length > 0 && (
        <ClassicSection title="Certifications">

          <ul className="classic-ats-bullets">

            {visibleCertifications.map((item) => (
              <li key={item.id}>

                {item.name && (
                  <strong>{item.name}</strong>
                )}

                {item.issuer && (
                  <> — {item.issuer}</>
                )}

                {item.date && (
                  <> ({item.date})</>
                )}

              </li>
            ))}

          </ul>

        </ClassicSection>
      )}

      {/* =========================
          AWARDS
      ========================= */}

      {visibleAwards.length > 0 && (
        <ClassicSection title="Achievements">

          <ul className="classic-ats-bullets">

            {visibleAwards.map((item) => (
              <li key={item.id}>

                {item.title && (
                  <strong>{item.title}</strong>
                )}

                {item.issuer && (
                  <> — {item.issuer}</>
                )}

                {item.date && (
                  <> ({item.date})</>
                )}

                {item.summary && (
                  <> — {item.summary}</>
                )}

              </li>
            ))}

          </ul>

        </ClassicSection>
      )}

      {/* =========================
          PUBLICATIONS
      ========================= */}

      {visiblePublications.length > 0 && (
        <ClassicSection title="Publications">

          {visiblePublications.map((item) => (
            <ClassicEntry
              key={item.id}
              title={item.name}
              subtitle={item.publisher}
              date={item.date}
            >
              {item.summary && (
                <div>{item.summary}</div>
              )}

              {item.url && (
                <a
                  className="classic-ats-link"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.url}
                </a>
              )}
            </ClassicEntry>
          ))}

        </ClassicSection>
      )}

      {/* =========================
          VOLUNTEER
      ========================= */}

      {visibleVolunteer.length > 0 && (
        <ClassicSection title="Volunteer Experience">

          {visibleVolunteer.map((item) => (
            <ClassicEntry
              key={item.id}
              title={item.organization}
              subtitle={item.position}
              meta={item.location}
              date={item.period}
            >
              {item.summary && (
                <div
                  className="classic-ats-rich-text"
                  dangerouslySetInnerHTML={{
                    __html: item.summary,
                  }}
                />
              )}
            </ClassicEntry>
          ))}

        </ClassicSection>
      )}

      {/* =========================
          LANGUAGES
      ========================= */}

      {visibleLanguages.length > 0 && (
        <ClassicSection title="Languages">

          <div className="classic-ats-inline-list">

            {visibleLanguages.map((item) => (
              <span key={item.id}>
                <strong>
                  {item.language}
                </strong>

                {item.fluency && (
                  <> — {item.fluency}</>
                )}
              </span>
            ))}

          </div>

        </ClassicSection>
      )}

      {/* =========================
          INTERESTS
      ========================= */}

      {visibleInterests.length > 0 && (
        <ClassicSection title="Interests">

          <div className="classic-ats-inline-list">

            {visibleInterests
              .filter((item) => item.name)
              .map((item) => (
                <span key={item.id}>
                  {item.name}
                </span>
              ))}

          </div>

        </ClassicSection>
      )}

      {/* =========================
          REFERENCES
      ========================= */}

      {visibleReferences.length > 0 && (
        <ClassicSection title="References">

          {visibleReferences.map((item) => (
            <ClassicEntry
              key={item.id}
              title={item.name}
              subtitle={item.position}
              meta={item.organization}
            >

              {item.email && (
                <div>{item.email}</div>
              )}

              {item.phone && (
                <div>{item.phone}</div>
              )}

              {item.website?.url && (
                <a
                  className="classic-ats-link"
                  href={item.website.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.website.label ||
                    item.website.url}
                </a>
              )}

              {item.description && (
                <div>
                  {item.description}
                </div>
              )}

            </ClassicEntry>
          ))}

        </ClassicSection>
      )}

    </div>
  );
}

function ClassicSection({ title, children }) {
  return (
    <section className="classic-ats-section">

      <h2>{title}</h2>

      <div className="classic-ats-section-content">
        {children}
      </div>

    </section>
  );
}

function ClassicEntry({
  title,
  subtitle,
  meta,
  date,
  children,
}) {
  const hasTopRow =
    title ||
    subtitle ||
    meta ||
    date;

  return (
    <article className="classic-ats-entry">

      {hasTopRow && (
        <div className="classic-ats-entry-header">

          <div className="classic-ats-entry-left">

            {title && (
              <strong>{title}</strong>
            )}

            {subtitle && (
              <em>{subtitle}</em>
            )}

            {meta && (
              <span>{meta}</span>
            )}

          </div>

          {date && (
            <span className="classic-ats-date">
              {date}
            </span>
          )}

        </div>
      )}

      {children && (
        <div className="classic-ats-entry-body">
          {children}
        </div>
      )}

    </article>
  );
}

function ClassicProject({ item }) {
  const technologies =
    item.technologies ||
    item.skills ||
    [];

  return (
    <article className="classic-ats-project">

      <div className="classic-ats-project-header">

        <div>

          {item.name && (
            <strong>{item.name}</strong>
          )}

          {technologies.length > 0 && (
            <span>
              {" | "}
              {technologies.join(", ")}
            </span>
          )}

        </div>

        {item.period && (
          <span className="classic-ats-date">
            {item.period}
          </span>
        )}

      </div>

      {item.location && (
        <span className="classic-ats-project-meta">
          {item.location}
        </span>
      )}

      {item.description && (
        <div
          className="classic-ats-rich-text"
          dangerouslySetInnerHTML={{
            __html: item.description,
          }}
        />
      )}

    </article>
  );
}

export default ClassicATS;