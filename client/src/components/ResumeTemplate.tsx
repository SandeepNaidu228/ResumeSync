import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EducationEntry {
  institution: string;
  degree: string;
  dateRange: string;
  location: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  dateRange: string;
  location: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  stack: string;
  link?: string;
  bullets: string[];
}

export interface SkillCategory {
  label: string;
  value: string;
}

export interface AchievementGroup {
  heading: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio: string;
  github: string;
  location: string;
  profileSummary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  certifications: string[];
  achievements: AchievementGroup[];
}

// ── Default Data (pre-filled with Sandeep's resume) ──────────────────────────

export const defaultResumeData: ResumeData = {
  name: "M V N Sandeep Naidu",
  phone: "+91 9381248165",
  email: "mvnsandeepsandeep@gmail.com",
  linkedin: "https://www.linkedin.com/in/mvnsandeepnaidu/",
  portfolio: "https://mvnsandeepnaidu.vercel.app/",
  github: "https://github.com/SandeepNaidu228",
  location: "Chennai, Tamil Nadu",
  profileSummary:
    "B.Tech Computer Science and Engineering (IoT) student at Shiv Nadar University, Chennai, with hands-on experience in full-stack development, backend services, and real-time web applications. Skilled in using modern frameworks such as React.js, Node.js, and Express.js. Passionate about solving complex problems through code and continuously improving user experiences.",
  education: [
    {
      institution: "Shiv Nadar University, Chennai",
      degree: "B.Tech in Computer Science and Engineering (IoT)",
      dateRange: "Aug 2023 – May 2027",
      location: "Chennai, Tamil Nadu",
    },
    {
      institution: "Sri Chaitanya Junior College",
      degree: "Intermediate (MPC)",
      dateRange: "Apr 2021 – May 2023",
      location: "Visakhapatnam, Andhra Pradesh",
    },
  ],
  experience: [
    {
      company: "Infosys Springboard",
      role: "Full Stack Intern",
      dateRange: "Aug 2025 – Oct 2025",
      location: "Remote",
      bullets: [
        "Developed dynamic UI components using Angular, improving application interactivity and performance.",
        "Collaborated with cross-functional team members to implement and refine frontend features.",
        "Gained hands-on experience with Angular components, services, routing, and data binding.",
      ],
    },
    {
      company: "McCarthy",
      role: "Backend Intern",
      dateRange: "May 2025 – July 2025",
      location: "Remote",
      bullets: [
        "Developed and deployed backend microservices, ensuring scalable and maintainable server-side architecture.",
        "Optimized API routes to enhance performance and reduce downtime.",
        "Collaborated with fellow interns to test, monitor, and maintain deployed services.",
      ],
    },
  ],
  projects: [
    {
      name: "Inaikka: Real-Time Full-Stack Chat Application",
      stack: "MongoDB · Express.js · React.js · Node.js · Socket.IO",
      link: "https://github.com/SandeepNaidu228/Inaikka.git",
      bullets: [
        "Developed a real-time full-stack chat application using the MERN stack with Socket.IO to enable instant message delivery and real-time online/offline user status updates.",
        "Implemented core features including secure user authentication, searchable user list, real-time text and image messaging, and user profile management.",
        "Designed a responsive multi-column UI to display user profiles, conversations, and detailed chat information, and prepared the application for free online deployment.",
      ],
    },
    {
      name: "Ytheys: Startup Discovery Platform",
      stack: "Next.js · ShadCN UI · Tailwind CSS",
      link: "https://github.com/SandeepNaidu228/Ytheys.git",
      bullets: [
        "Built the complete UI for Ytheys using React.js and ShadCN components, ensuring a clean, scalable, and responsive design aligned with modern industry standards.",
        "Implemented dynamic search and filtering features to help users efficiently discover and explore startups based on categories and relevance.",
      ],
    },
  ],
  skills: [
    { label: "Languages", value: "C, C++, Java, Python, JavaScript, TypeScript" },
    { label: "Frontend", value: "React, Next.js, Angular, Tailwind CSS, HTML, CSS" },
    { label: "Backend", value: "Node.js, Express.js, REST APIs, n8n" },
    { label: "Databases", value: "MySQL, MongoDB" },
    { label: "Tools", value: "VS Code, GitHub, Figma, Vite" },
  ],
  certifications: [
    "AI: Transformative Learning Program – Microsoft, SAP, AICTE (Edunet Foundation)",
    "J.P. Morgan Software Engineering Job Simulation – Forage",
  ],
  achievements: [
    {
      heading: "2× Finalists in Internal Hackathon",
      bullets: [
        "Developed a gamified website promoting marine education and ocean literacy.",
        "Built an app for citizens to post civic issues directly to government bodies.",
      ],
    },
    {
      heading: "Finalists at VOIDv1, VIT Chennai",
      bullets: ["Developed a software to bridge the gap between industries and startups."],
    },
  ],
};

// ── Editable Field Component ──────────────────────────────────────────────────

interface EditableProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  tag?: keyof JSX.IntrinsicElements;
}

export const Editable: React.FC<EditableProps> = ({
  value,
  onChange,
  className = "",
  multiline = false,
  placeholder = "Click to edit…",
  style,
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onChange(e.currentTarget.innerText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none focus:bg-[#fff8f0] focus:ring-1 focus:ring-[#8b2c1a]/30 rounded transition-colors cursor-text ${className}`}
      style={{ display: "inline", whiteSpace: multiline ? "pre-wrap" : "normal", ...style }}
      data-placeholder={placeholder}
    >
      {value}
    </span>
  );
};

// ── Main ResumeTemplate Component ─────────────────────────────────────────────

interface ResumeTemplateProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  /** When true, fields are read-only (e.g. for PDF export) */
  readOnly?: boolean;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ data, onChange, readOnly = false }) => {
  const set = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    onChange({ ...data, [key]: value });

  const setStr = (key: keyof ResumeData) => (val: string) => set(key, val as any);

  // Education helpers
  const setEdu = (idx: number, field: keyof EducationEntry, val: string) => {
    const updated = data.education.map((e, i) => (i === idx ? { ...e, [field]: val } : e));
    set("education", updated);
  };

  const addEdu = () =>
    set("education", [
      ...data.education,
      { institution: "New Institution", degree: "Degree", dateRange: "Year – Year", location: "City, State" },
    ]);

  const removeEdu = (idx: number) => set("education", data.education.filter((_, i) => i !== idx));

  // Experience helpers
  const setExp = (idx: number, field: keyof ExperienceEntry, val: string | string[]) => {
    const updated = data.experience.map((e, i) => (i === idx ? { ...e, [field]: val } : e));
    set("experience", updated);
  };

  const setExpBullet = (expIdx: number, bIdx: number, val: string) => {
    const bullets = data.experience[expIdx].bullets.map((b, i) => (i === bIdx ? val : b));
    setExp(expIdx, "bullets", bullets);
  };

  const addExpBullet = (expIdx: number) =>
    setExp(expIdx, "bullets", [...data.experience[expIdx].bullets, "New bullet point."]);

  const removeExpBullet = (expIdx: number, bIdx: number) =>
    setExp(
      expIdx,
      "bullets",
      data.experience[expIdx].bullets.filter((_, i) => i !== bIdx)
    );

  const addExp = () =>
    set("experience", [
      ...data.experience,
      { company: "Company Name", role: "Role", dateRange: "Month Year – Month Year", location: "City", bullets: ["Describe your responsibility here."] },
    ]);

  const removeExp = (idx: number) => set("experience", data.experience.filter((_, i) => i !== idx));

  // Project helpers
  const setProj = (idx: number, field: keyof ProjectEntry, val: string | string[]) => {
    const updated = data.projects.map((p, i) => (i === idx ? { ...p, [field]: val } : p));
    set("projects", updated);
  };

  const setProjBullet = (pIdx: number, bIdx: number, val: string) => {
    const bullets = data.projects[pIdx].bullets.map((b, i) => (i === bIdx ? val : b));
    setProj(pIdx, "bullets", bullets);
  };

  const addProjBullet = (pIdx: number) =>
    setProj(pIdx, "bullets", [...data.projects[pIdx].bullets, "New bullet point."]);

  const removeProjBullet = (pIdx: number, bIdx: number) =>
    setProj(
      pIdx,
      "bullets",
      data.projects[pIdx].bullets.filter((_, i) => i !== bIdx)
    );

  const addProj = () =>
    set("projects", [
      ...data.projects,
      { name: "New Project", stack: "Tech Stack", link: "", bullets: ["Describe your project here."] },
    ]);

  const removeProj = (idx: number) => set("projects", data.projects.filter((_, i) => i !== idx));

  // Skills helpers
  const setSkill = (idx: number, field: keyof SkillCategory, val: string) => {
    const updated = data.skills.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    set("skills", updated);
  };

  const addSkill = () => set("skills", [...data.skills, { label: "Category", value: "Skill 1, Skill 2" }]);
  const removeSkill = (idx: number) => set("skills", data.skills.filter((_, i) => i !== idx));

  // Cert helpers
  const setCert = (idx: number, val: string) => {
    const updated = data.certifications.map((c, i) => (i === idx ? val : c));
    set("certifications", updated);
  };
  const addCert = () => set("certifications", [...data.certifications, "New Certification – Issuer"]);
  const removeCert = (idx: number) => set("certifications", data.certifications.filter((_, i) => i !== idx));

  // Achievement helpers
  const setAch = (idx: number, field: keyof AchievementGroup, val: string | string[]) => {
    const updated = data.achievements.map((a, i) => (i === idx ? { ...a, [field]: val } : a));
    set("achievements", updated);
  };

  const setAchBullet = (aIdx: number, bIdx: number, val: string) => {
    const bullets = data.achievements[aIdx].bullets.map((b, i) => (i === bIdx ? val : b));
    setAch(aIdx, "bullets", bullets);
  };

  const addAchBullet = (aIdx: number) =>
    setAch(aIdx, "bullets", [...data.achievements[aIdx].bullets, "New achievement detail."]);

  const removeAchBullet = (aIdx: number, bIdx: number) =>
    setAch(
      aIdx,
      "bullets",
      data.achievements[aIdx].bullets.filter((_, i) => i !== bIdx)
    );

  const addAch = () =>
    set("achievements", [
      ...data.achievements,
      { heading: "New Achievement", bullets: ["Detail about your achievement."] },
    ]);

  const removeAch = (idx: number) => set("achievements", data.achievements.filter((_, i) => i !== idx));

  // ── Styles (matching the original HTML exactly) ─────────────────────────────

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

    .resume-root {
      --bg: #f8f5f0;
      --paper: #fffefb;
      --ink: #1a1a18;
      --ink-light: #4a4a44;
      --ink-muted: #7a7a72;
      --rule: #2a2a24;
      --accent: #8b2c1a;
      --accent-pale: #f2e8e5;
      --border: #d8d4cc;
      font-family: 'EB Garamond', Georgia, serif;
      color: var(--ink);
      background: var(--paper);
    }
    .resume-root * { box-sizing: border-box; margin: 0; padding: 0; }

    .resume-page {
      background: var(--paper);
      width: 100%;
      padding: 3rem 3.5rem;
      position: relative;
    }
    .resume-page::before, .resume-page::after {
      content: '';
      position: absolute;
      width: 14px; height: 14px;
      border-color: var(--accent);
      border-style: solid;
      opacity: 0.35;
    }
    .resume-page::before { top: 14px; left: 14px; border-width: 1.5px 0 0 1.5px; }
    .resume-page::after  { bottom: 14px; right: 14px; border-width: 0 1.5px 1.5px 0; }

    .resume-header { text-align: center; margin-bottom: 1.6rem; }
    .resume-header h1 {
      font-size: 2.15rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--ink); line-height: 1.1;
    }
    .contact-line {
      margin-top: 0.55rem;
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem; font-weight: 300; color: var(--ink-light);
      display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3rem 0.9rem;
    }
    .contact-line a { color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
    .contact-line a:hover { border-color: var(--accent); }
    .sep { color: var(--border); }

    .resume-section { margin-bottom: 1.4rem; }
    .section-title {
      font-size: 0.72rem; font-family: 'DM Mono', monospace; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--rule);
      padding-bottom: 0.3rem; border-bottom: 1.5px solid var(--rule); margin-bottom: 0.85rem;
    }
    .profile-text { font-size: 0.95rem; line-height: 1.75; color: var(--ink-light); }

    .block { margin-bottom: 0.9rem; }
    .block-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
    .block-title { font-size: 1.02rem; font-weight: 700; color: var(--ink); }
    .block-date { font-family: 'DM Mono', monospace; font-size: 0.68rem; font-weight: 400; color: var(--ink-muted); white-space: nowrap; }
    .block-sub { display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.05rem; }
    .block-role { font-style: italic; font-size: 0.88rem; color: var(--ink-light); }
    .block-loc { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--ink-muted); }

    .bullet-list { list-style: none; margin-top: 0.4rem; padding-left: 0.9rem; }
    .bullet-list li {
      font-size: 0.88rem; line-height: 1.65; color: var(--ink-light);
      position: relative; padding-left: 0.9rem;
    }
    .bullet-list li::before {
      content: '▸'; position: absolute; left: 0; color: var(--accent);
      font-size: 0.7rem; top: 0.12em;
    }
    strong { color: var(--ink); font-weight: 600; }

    .project-block { margin-bottom: 1rem; }
    .project-head { display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap; }
    .project-name { font-size: 1rem; font-weight: 700; color: var(--ink); }
    .project-stack {
      font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--ink-muted);
      background: var(--accent-pale); padding: 0.1rem 0.45rem; border-radius: 2px;
    }
    .project-link {
      font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--accent);
      text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s;
    }
    .project-link:hover { border-color: var(--accent); }

    .skills-grid { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 1rem; font-size: 0.88rem; }
    .skill-label {
      font-family: 'DM Mono', monospace; font-size: 0.68rem; font-weight: 500;
      color: var(--accent); white-space: nowrap; padding-top: 0.1rem;
    }
    .skill-value { color: var(--ink-light); line-height: 1.55; }

    .cert-list { list-style: none; }
    .cert-list li {
      font-size: 0.88rem; color: var(--ink-light); line-height: 1.65;
      padding-left: 1rem; position: relative;
    }
    .cert-list li::before {
      content: '✦'; position: absolute; left: 0; color: var(--accent);
      font-size: 0.6rem; top: 0.25em;
    }

    .ach-group { margin-bottom: 0.7rem; }
    .ach-heading { font-weight: 700; font-size: 0.95rem; color: var(--ink); margin-bottom: 0.25rem; }

    /* Edit controls */
    .edit-ctrl {
      display: inline-flex; align-items: center; justify-content: center;
      width: 18px; height: 18px; border-radius: 3px; font-size: 11px; font-weight: 700;
      cursor: pointer; border: none; padding: 0; line-height: 1;
      vertical-align: middle; transition: all 0.15s;
      font-family: 'DM Mono', monospace;
    }
    .edit-ctrl-add { background: #d6f5e3; color: #166534; margin-left: 6px; }
    .edit-ctrl-add:hover { background: #17e85d; color: #fff; }
    .edit-ctrl-remove { background: #fee2e2; color: #991b1b; margin-left: 4px; }
    .edit-ctrl-remove:hover { background: #ef4444; color: #fff; }
    .edit-block-actions { display: flex; gap: 4px; margin-left: 8px; align-items: center; }
  `;

  // helper to not render edit controls in readOnly mode
  const AddBtn = ({ onClick, title = "Add" }: { onClick: () => void; title?: string }) =>
    readOnly ? null : (
      <button className="edit-ctrl edit-ctrl-add" onClick={onClick} title={title} type="button">
        +
      </button>
    );

  const RemoveBtn = ({ onClick, title = "Remove" }: { onClick: () => void; title?: string }) =>
    readOnly ? null : (
      <button className="edit-ctrl edit-ctrl-remove" onClick={onClick} title={title} type="button">
        ×
      </button>
    );

  const E = readOnly
    ? ({ value, className, style }: EditableProps) => (
        <span className={className} style={style}>
          {value}
        </span>
      )
    : Editable;

  return (
    <div className="resume-root">
      <style>{css}</style>
      <div className="resume-page">
        {/* ── HEADER ── */}
        <header className="resume-header">
          <h1>
            <E value={data.name} onChange={setStr("name")} className="resume-h1-editable" />
          </h1>
          <div className="contact-line">
            <E value={data.phone} onChange={setStr("phone")} />
            <span className="sep">|</span>
            <E value={data.email} onChange={setStr("email")} />
            <span className="sep">|</span>
            <E value={data.linkedin} onChange={setStr("linkedin")} />
            <span className="sep">|</span>
            <E value={data.portfolio} onChange={setStr("portfolio")} />
            <span className="sep">|</span>
            <E value={data.github} onChange={setStr("github")} />
            <span className="sep">|</span>
            <E value={data.location} onChange={setStr("location")} />
          </div>
        </header>

        {/* ── PROFILE SUMMARY ── */}
        <section className="resume-section">
          <div className="section-title">Profile Summary</div>
          <p className="profile-text">
            <E value={data.profileSummary} onChange={setStr("profileSummary")} multiline />
          </p>
        </section>

        {/* ── EDUCATION ── */}
        <section className="resume-section">
          <div className="section-title">
            Education
            <AddBtn onClick={addEdu} title="Add education entry" />
          </div>
          {data.education.map((edu, idx) => (
            <div className="block" key={idx}>
              <div className="block-head">
                <span className="block-title">
                  <E value={edu.institution} onChange={(v) => setEdu(idx, "institution", v)} />
                </span>
                <span className="block-date">
                  <E value={edu.dateRange} onChange={(v) => setEdu(idx, "dateRange", v)} />
                  {!readOnly && (
                    <span className="edit-block-actions">
                      <RemoveBtn onClick={() => removeEdu(idx)} title="Remove this education" />
                    </span>
                  )}
                </span>
              </div>
              <div className="block-sub">
                <span className="block-role">
                  <E value={edu.degree} onChange={(v) => setEdu(idx, "degree", v)} />
                </span>
                <span className="block-loc">
                  <E value={edu.location} onChange={(v) => setEdu(idx, "location", v)} />
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ── EXPERIENCE ── */}
        <section className="resume-section">
          <div className="section-title">
            Experience
            <AddBtn onClick={addExp} title="Add experience entry" />
          </div>
          {data.experience.map((exp, idx) => (
            <div className="block" key={idx}>
              <div className="block-head">
                <span className="block-title">
                  <E value={exp.company} onChange={(v) => setExp(idx, "company", v)} />
                </span>
                <span className="block-date">
                  <E value={exp.dateRange} onChange={(v) => setExp(idx, "dateRange", v)} />
                  {!readOnly && (
                    <span className="edit-block-actions">
                      <RemoveBtn onClick={() => removeExp(idx)} title="Remove this experience" />
                    </span>
                  )}
                </span>
              </div>
              <div className="block-sub">
                <span className="block-role">
                  <E value={exp.role} onChange={(v) => setExp(idx, "role", v)} />
                </span>
                <span className="block-loc">
                  <E value={exp.location} onChange={(v) => setExp(idx, "location", v)} />
                </span>
              </div>
              <ul className="bullet-list">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx}>
                    <E value={b} onChange={(v) => setExpBullet(idx, bIdx, v)} multiline />
                    {!readOnly && (
                      <>
                        <AddBtn onClick={() => addExpBullet(idx)} title="Add bullet" />
                        <RemoveBtn onClick={() => removeExpBullet(idx, bIdx)} title="Remove bullet" />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── PROJECTS ── */}
        <section className="resume-section">
          <div className="section-title">
            Projects
            <AddBtn onClick={addProj} title="Add project" />
          </div>
          {data.projects.map((proj, idx) => (
            <div className="project-block" key={idx}>
              <div className="project-head">
                <span className="project-name">
                  <E value={proj.name} onChange={(v) => setProj(idx, "name", v)} />
                </span>
                <span className="project-stack">
                  <E value={proj.stack} onChange={(v) => setProj(idx, "stack", v)} />
                </span>
                {proj.link !== undefined && (
                  <span className="project-link">
                    ↗{" "}
                    <E value={proj.link} onChange={(v) => setProj(idx, "link", v)} placeholder="GitHub URL" />
                  </span>
                )}
                {!readOnly && (
                  <RemoveBtn onClick={() => removeProj(idx)} title="Remove project" />
                )}
              </div>
              <ul className="bullet-list">
                {proj.bullets.map((b, bIdx) => (
                  <li key={bIdx}>
                    <E value={b} onChange={(v) => setProjBullet(idx, bIdx, v)} multiline />
                    {!readOnly && (
                      <>
                        <AddBtn onClick={() => addProjBullet(idx)} title="Add bullet" />
                        <RemoveBtn onClick={() => removeProjBullet(idx, bIdx)} title="Remove bullet" />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── TECHNICAL SKILLS ── */}
        <section className="resume-section">
          <div className="section-title">
            Technical Skills
            <AddBtn onClick={addSkill} title="Add skill category" />
          </div>
          <div className="skills-grid">
            {data.skills.map((skill, idx) => (
              <React.Fragment key={idx}>
                <span className="skill-label">
                  <E value={skill.label} onChange={(v) => setSkill(idx, "label", v)} />
                  {!readOnly && (
                    <RemoveBtn onClick={() => removeSkill(idx)} title="Remove skill category" />
                  )}
                </span>
                <span className="skill-value">
                  <E value={skill.value} onChange={(v) => setSkill(idx, "value", v)} />
                </span>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="resume-section">
          <div className="section-title">
            Certifications
            <AddBtn onClick={addCert} title="Add certification" />
          </div>
          <ul className="cert-list">
            {data.certifications.map((cert, idx) => (
              <li key={idx}>
                <E value={cert} onChange={(v) => setCert(idx, v)} multiline />
                {!readOnly && <RemoveBtn onClick={() => removeCert(idx)} title="Remove certification" />}
              </li>
            ))}
          </ul>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section className="resume-section">
          <div className="section-title">
            Achievements
            <AddBtn onClick={addAch} title="Add achievement group" />
          </div>
          {data.achievements.map((ach, idx) => (
            <div className="ach-group" key={idx}>
              <div className="ach-heading">
                <E value={ach.heading} onChange={(v) => setAch(idx, "heading", v)} />
                {!readOnly && (
                  <RemoveBtn onClick={() => removeAch(idx)} title="Remove achievement group" />
                )}
              </div>
              <ul className="bullet-list">
                {ach.bullets.map((b, bIdx) => (
                  <li key={bIdx}>
                    <E value={b} onChange={(v) => setAchBullet(idx, bIdx, v)} multiline />
                    {!readOnly && (
                      <>
                        <AddBtn onClick={() => addAchBullet(idx)} title="Add bullet" />
                        <RemoveBtn onClick={() => removeAchBullet(idx, bIdx)} title="Remove bullet" />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ResumeTemplate;

// ── Serializer: Convert ResumeData → plain text (for AI analysis) ─────────────

export function serializeResumeToText(data: ResumeData): string {
  const lines: string[] = [];
  lines.push(data.name.toUpperCase());
  lines.push(`${data.phone} | ${data.email} | ${data.linkedin} | ${data.portfolio} | ${data.github} | ${data.location}`);
  lines.push("");
  lines.push("PROFILE SUMMARY");
  lines.push(data.profileSummary);
  lines.push("");
  lines.push("EDUCATION");
  data.education.forEach((e) => {
    lines.push(`${e.institution} | ${e.dateRange}`);
    lines.push(`${e.degree} | ${e.location}`);
  });
  lines.push("");
  lines.push("EXPERIENCE");
  data.experience.forEach((e) => {
    lines.push(`${e.company} | ${e.role} | ${e.dateRange} | ${e.location}`);
    e.bullets.forEach((b) => lines.push(`- ${b}`));
  });
  lines.push("");
  lines.push("PROJECTS");
  data.projects.forEach((p) => {
    lines.push(`${p.name} | ${p.stack}${p.link ? ` | ${p.link}` : ""}`);
    p.bullets.forEach((b) => lines.push(`- ${b}`));
  });
  lines.push("");
  lines.push("TECHNICAL SKILLS");
  data.skills.forEach((s) => lines.push(`${s.label}: ${s.value}`));
  lines.push("");
  lines.push("CERTIFICATIONS");
  data.certifications.forEach((c) => lines.push(`- ${c}`));
  lines.push("");
  lines.push("ACHIEVEMENTS");
  data.achievements.forEach((a) => {
    lines.push(a.heading);
    a.bullets.forEach((b) => lines.push(`- ${b}`));
  });
  return lines.join("\n");
}
