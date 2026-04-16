import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/config";
import Navbar from "../components/Navbar";

const MI = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

// Gradient palettes for project cards
const gradients = [
  "from-emerald-400 to-emerald-700",
  "from-teal-400 to-emerald-800",
  "from-green-400 to-teal-700",
  "from-emerald-500 to-cyan-700",
  "from-lime-500 to-emerald-700",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [saveMsg, setSaveMsg] = useState<null | "ok" | "err">(null);

  const userName = localStorage.getItem("user_name") || "User";
  const userEmail = localStorage.getItem("user_email") || "";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile_completed");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const [profile, setProfile] = useState({
    target_roles: [""],
    experience_level: "Fresher / Student",
    raw_bio: "",
    technical_skills: [""],
    soft_skills: [""],
    projects: [{ name: "", tech_stack: "", description: "" }],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          target_roles: data.target_roles?.length ? data.target_roles : [""],
          experience_level: data.experience_level || "Fresher / Student",
          raw_bio: data.raw_bio || "",
          technical_skills: data.technical_skills?.length ? data.technical_skills : [""],
          soft_skills: data.soft_skills?.length ? data.soft_skills : [""],
          projects: data.projects?.length
            ? data.projects
            : [{ name: "", tech_stack: "", description: "" }],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleArrayChange = (field: keyof typeof profile, index: number, val: string) => {
    const newArr = [...(profile[field] as any[])];
    newArr[index] = val;
    setProfile({ ...profile, [field]: newArr });
  };

  const addArrayItem = (field: keyof typeof profile) => {
    setProfile({ ...profile, [field]: [...(profile[field] as any[]), ""] });
  };

  const removeArrayItem = (field: keyof typeof profile, index: number) => {
    const newArr = [...(profile[field] as any[])];
    newArr.splice(index, 1);
    setProfile({ ...profile, [field]: newArr });
  };

  const handleProjectChange = (index: number, key: string, val: string) => {
    const newProjects = [...profile.projects];
    newProjects[index] = { ...newProjects[index], [key]: val };
    setProfile({ ...profile, projects: newProjects });
  };

  const addProject = () => {
    setProfile({
      ...profile,
      projects: [...profile.projects, { name: "", tech_stack: "", description: "" }],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = [...profile.projects];
    newProjects.splice(index, 1);
    setProfile({ ...profile, projects: newProjects });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveMsg(null);
      const token = localStorage.getItem("token");
      const payload = {
        target_roles: profile.target_roles.filter(Boolean),
        experience_level: profile.experience_level,
        raw_bio: profile.raw_bio,
        technical_skills: profile.technical_skills.filter(Boolean),
        soft_skills: profile.soft_skills.filter(Boolean),
        projects: profile.projects.filter((p) => p.name || p.description),
      };
      const res = await fetch(`${API}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaveMsg("ok");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err: any) {
      setSaveMsg("err");
      setTimeout(() => setSaveMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Compute completeness score
  const completenessItems = [
    profile.raw_bio.length > 20,
    profile.technical_skills.filter(Boolean).length > 0,
    profile.soft_skills.filter(Boolean).length > 0,
    profile.target_roles.filter(Boolean).length > 0,
    profile.projects.filter((p) => p.name).length > 0,
  ];
  const completeness = Math.round(
    (completenessItems.filter(Boolean).length / completenessItems.length) * 100
  );

  const inputCls =
    "w-full bg-[#f6f8f6] border border-[#d6eadd] rounded-lg px-3 py-2 text-sm text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] transition placeholder:text-[#89bca1]";

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] flex items-center justify-center font-['Inter',sans-serif]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4d9966] font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6] font-['Inter',sans-serif] text-[#0e1b12]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* ── Profile Header ── */}
        <header className="bg-white p-8 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row items-start gap-8 border border-[#d6eadd]/50">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#17e85d] to-[#0bb844] flex items-center justify-center text-[#112116] text-4xl font-black border-4 border-[#17e85d]/20 shadow-lg">
              {initials || <MI name="person" className="text-5xl" />}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-[#0e1b12]">{userName}</h1>
                <p className="text-base text-[#497d65] font-medium mt-1">
                  {profile.target_roles.filter(Boolean).join(" • ") || "Add your target roles →"}
                  {profile.target_roles.filter(Boolean).length > 0 && (
                    <span className="ml-2 text-[#89bca1] font-normal">• {profile.experience_level}</span>
                  )}
                </p>
                <p className="text-sm text-[#89bca1] mt-0.5">{userEmail}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                >
                  <MI name="logout" className="text-[16px]" />
                  Logout
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-[#17e85d] text-[#112116] font-bold rounded-lg shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#112116] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MI name="save" className="text-[16px]" />
                  )}
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-widest text-[#497d65] mb-2">About / Raw Bio</p>
              <textarea
                value={profile.raw_bio}
                onChange={(e) => setProfile({ ...profile, raw_bio: e.target.value })}
                className="w-full h-24 bg-[#f6f8f6] border border-[#d6eadd] rounded-xl px-4 py-3 text-sm text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] resize-none placeholder:text-[#89bca1] transition"
                placeholder="I am a passionate CS student who loves building products that solve real problems..."
              />
            </div>

            {/* Save feedback toast */}
            {saveMsg && (
              <div
                className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity ${
                  saveMsg === "ok"
                    ? "bg-[#ecf6ef] text-[#17a84d]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <MI name={saveMsg === "ok" ? "check_circle" : "error"} className="text-[16px]" />
                {saveMsg === "ok" ? "Profile saved successfully!" : "Error saving profile."}
              </div>
            )}
          </div>
        </header>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">

            {/* Identity Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#d6eadd]/50">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-[#0e1b12]">
                <MI name="badge" className="text-[#17e85d] text-[22px]" filled />
                Professional Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#497d65] mb-3">Target Industries / Roles</p>
                  <div className="space-y-2">
                    {profile.target_roles.map((role, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={role}
                          onChange={(e) => handleArrayChange("target_roles", i, e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className={inputCls}
                        />
                        <button
                          onClick={() => removeArrayItem("target_roles", i)}
                          className="text-red-400 hover:text-red-600 px-2 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addArrayItem("target_roles")}
                    className="mt-2 text-xs font-black tracking-wider text-[#17e85d] hover:underline"
                  >
                    + ADD ROLE
                  </button>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#497d65] mb-3">Experience Level</p>
                  <select
                    value={profile.experience_level}
                    onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                    className={inputCls}
                  >
                    <option>Fresher / Student</option>
                    <option>Entry Level (1-2 Years)</option>
                    <option>Mid Level (3-5 Years)</option>
                    <option>Senior (5+ Years)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#d6eadd]/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-[#0e1b12]">
                  <MI name="terminal" className="text-[#17e85d] text-[22px]" />
                  Skills Vault
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Technical */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#497d65] mb-3">Technical Skills</p>
                  {/* Pills preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.technical_skills.filter(Boolean).map((s, i) => (
                      <span
                        key={i}
                        className="group flex items-center gap-1 px-3 py-1 bg-[#17e85d]/10 text-[#0e1b12] border border-[#17e85d]/25 rounded-full text-sm font-medium"
                      >
                        {s}
                        <button
                          onClick={() => removeArrayItem("technical_skills", profile.technical_skills.indexOf(s))}
                          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {profile.technical_skills.map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={skill}
                          onChange={(e) => handleArrayChange("technical_skills", i, e.target.value)}
                          placeholder="e.g. React.js"
                          className={inputCls}
                        />
                        <button
                          onClick={() => removeArrayItem("technical_skills", i)}
                          className="text-red-400 hover:text-red-600 px-2 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addArrayItem("technical_skills")}
                    className="mt-2 text-xs font-black tracking-wider text-[#17e85d] hover:underline"
                  >
                    + ADD TECH SKILL
                  </button>
                </div>

                {/* Soft */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#497d65] mb-3">Soft Skills</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.soft_skills.filter(Boolean).map((s, i) => (
                      <span
                        key={i}
                        className="group flex items-center gap-1 px-3 py-1 bg-[#ecf6ef] text-[#0e1b12] border border-[#b3d6c1] rounded-full text-sm font-medium"
                      >
                        {s}
                        <button
                          onClick={() => removeArrayItem("soft_skills", profile.soft_skills.indexOf(s))}
                          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {profile.soft_skills.map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={skill}
                          onChange={(e) => handleArrayChange("soft_skills", i, e.target.value)}
                          placeholder="e.g. Team Leadership"
                          className={inputCls}
                        />
                        <button
                          onClick={() => removeArrayItem("soft_skills", i)}
                          className="text-red-400 hover:text-red-600 px-2 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addArrayItem("soft_skills")}
                    className="mt-2 text-xs font-black tracking-wider text-[#17e85d] hover:underline"
                  >
                    + ADD SOFT SKILL
                  </button>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-lg font-bold flex items-center gap-2 text-[#0e1b12]">
                  <MI name="inventory_2" className="text-[#17e85d] text-[22px]" />
                  Master Projects Vault
                </h2>
                <button
                  onClick={addProject}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#17e85d] text-[#112116] text-sm font-bold rounded-lg shadow-sm hover:brightness-105 transition-all"
                >
                  <MI name="add" className="text-[16px]" />
                  Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm border border-[#d6eadd]/50 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card gradient header */}
                    <div
                      className={`h-28 bg-gradient-to-br ${gradients[i % gradients.length]} relative flex items-end p-4`}
                    >
                      <span className="text-xs font-black text-white/80 uppercase tracking-widest">
                        Project {i + 1}
                      </span>
                      <button
                        onClick={() => removeProject(i)}
                        className="absolute top-3 right-3 bg-white/20 hover:bg-red-500 text-white p-1.5 rounded-lg transition-colors"
                        title="Remove project"
                      >
                        <MI name="delete" className="text-[16px]" />
                      </button>
                    </div>

                    {/* Editable fields */}
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#497d65] mb-1">Project Name</p>
                        <input
                          value={proj.name}
                          onChange={(e) => handleProjectChange(i, "name", e.target.value)}
                          placeholder="e.g. Spotify Clone"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#497d65] mb-1">Tech Stack</p>
                        <input
                          value={proj.tech_stack}
                          onChange={(e) => handleProjectChange(i, "tech_stack", e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                          className={inputCls}
                        />
                        {/* Tech tags preview */}
                        {proj.tech_stack && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.tech_stack.split(",").map((t, ti) =>
                              t.trim() ? (
                                <span
                                  key={ti}
                                  className="text-[10px] px-2 py-0.5 bg-[#ecf6ef] rounded font-bold text-[#497d65]"
                                >
                                  {t.trim().toUpperCase()}
                                </span>
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#497d65] mb-1">Description / Problem Solved</p>
                        <textarea
                          value={proj.description}
                          onChange={(e) => handleProjectChange(i, "description", e.target.value)}
                          placeholder="Built a full-stack music player that allowed users to..."
                          className={`${inputCls} h-20 resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right 1/3 — Completeness Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Profile Completeness */}
              <section className="bg-[#112116] text-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#17e85d]/20 rounded-lg">
                    <MI name="analytics" className="text-[#17e85d] text-[22px]" filled />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight">Profile Strength</h2>
                    <p className="text-xs text-[#4d9966] font-bold uppercase tracking-widest">Master Profile</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-white/80">Completeness</span>
                    <span className="text-3xl font-black text-[#17e85d]">{completeness}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#17e85d] rounded-full transition-all duration-700"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#4d9966] mb-2">Checklist</h3>
                  {[
                    { label: "Bio written", done: profile.raw_bio.length > 20 },
                    { label: "Target roles set", done: profile.target_roles.filter(Boolean).length > 0 },
                    { label: "Tech skills added", done: profile.technical_skills.filter(Boolean).length > 0 },
                    { label: "Soft skills added", done: profile.soft_skills.filter(Boolean).length > 0 },
                    { label: "At least 1 project", done: profile.projects.filter((p) => p.name).length > 0 },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          done ? "bg-[#17e85d]" : "bg-white/10 border border-white/20"
                        }`}
                      >
                        {done && <MI name="check" className="text-[#112116] text-[13px] font-black" />}
                      </div>
                      <span className={`text-sm ${done ? "text-white" : "text-white/40 line-through"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full mt-8 py-3 bg-[#17e85d] text-[#112116] font-black rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#112116] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MI name="save" className="text-[18px]" />
                  )}
                  {loading ? "SAVING..." : "SAVE ALL CHANGES"}
                </button>
              </section>

              {/* Quick Summary */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6eadd]/50">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#497d65] mb-4">Quick Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Tech Skills</span>
                    <span className="font-black text-[#0e1b12]">
                      {profile.technical_skills.filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Soft Skills</span>
                    <span className="font-black text-[#0e1b12]">
                      {profile.soft_skills.filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Projects</span>
                    <span className="font-black text-[#0e1b12]">
                      {profile.projects.filter((p) => p.name).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Target Roles</span>
                    <span className="font-black text-[#0e1b12]">
                      {profile.target_roles.filter(Boolean).length}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-[#d6eadd]/40 text-center w-full">
        <p className="text-[#89bca1] text-sm font-medium">© 2025 ResumeSync — Powered by Groq AI</p>
      </footer>
    </div>
  );
}
