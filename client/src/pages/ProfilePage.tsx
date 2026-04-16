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

  // Skill gap state
  const [missingSkills, setMissingSkills] = useState<any[]>([]);
  const [gapLoading, setGapLoading] = useState(false);
  const [gapAnalyzed, setGapAnalyzed] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

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

              {/* Skill Gap Analyzer */}
              <section className="bg-[#112116] text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#17e85d]/20 rounded-lg shrink-0">
                    <MI name="trending_up" className="text-[#17e85d] text-[20px]" filled />
                  </div>
                  <div>
                    <h2 className="font-black text-base tracking-tight">Skill Gap Analyzer</h2>
                    <p className="text-[11px] text-[#4d9966] font-bold uppercase tracking-widest">Based on your applied jobs</p>
                  </div>
                </div>

                {!gapAnalyzed && !gapLoading && (
                  <div className="text-center py-4">
                    <p className="text-xs text-white/50 mb-4 leading-relaxed">
                      Analyzes your applied job descriptions and finds skills you're missing. Requires jobs with status other than "Want to Apply".
                    </p>
                    <button
                      onClick={async () => {
                        setGapLoading(true);
                        setGapAnalyzed(false);
                        try {
                          const token = localStorage.getItem("token");
                          // Fetch all jobs
                          const jobsRes = await fetch(`${API}/api/jobs`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          const allJobs = jobsRes.ok ? await jobsRes.json() : [];
                          const appliedJobs = allJobs.filter((j: any) => j.status !== "Wishlist" && j.job_description);

                          if (appliedJobs.length === 0) {
                            alert("No applied jobs with job descriptions found. Add jobs with 'Already Applied' status and paste their job descriptions.");
                            setGapLoading(false);
                            return;
                          }

                          const res = await fetch(`${API}/api/resume/skill-gap-analysis`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({
                              userSkills: profile.technical_skills,
                              appliedJobs,
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);
                          setMissingSkills(data.missingSkills || []);
                          setGapAnalyzed(true);
                        } catch (err: any) {
                          alert("Error: " + err.message);
                        } finally {
                          setGapLoading(false);
                        }
                      }}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Analyze Skill Gap
                    </button>
                  </div>
                )}

                {gapLoading && (
                  <div className="flex flex-col items-center py-6 gap-3">
                    <div className="w-6 h-6 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-white/60">Analyzing your job requirements...</p>
                  </div>
                )}

                {gapAnalyzed && !gapLoading && (
                  <>
                    {missingSkills.length === 0 ? (
                      <div className="text-center py-4">
                        <MI name="verified" className="text-[#17e85d] text-3xl mb-2" filled />
                        <p className="text-sm font-bold text-white">Great match!</p>
                        <p className="text-xs text-white/50 mt-1">Your skills cover the requirements of your applied jobs.</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                          {missingSkills.map((skill, i) => (
                            <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-white">{skill.skill}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  skill.priority === "High" ? "bg-red-500/20 text-red-300" :
                                  skill.priority === "Medium" ? "bg-amber-500/20 text-amber-300" :
                                  "bg-white/10 text-white/50"
                                }`}>
                                  {skill.priority}
                                </span>
                              </div>
                              <p className="text-[11px] text-white/50 leading-relaxed">{skill.reason}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setShowRoadmap(true)}
                          className="w-full py-2.5 bg-[#17e85d] text-[#112116] font-black text-sm rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          <MI name="map" className="text-[16px]" />
                          Generate Learning Roadmap
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { setGapAnalyzed(false); setMissingSkills([]); }}
                      className="w-full mt-2 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      Re-analyze
                    </button>
                  </>
                )}
              </section>


              {/* Quick Summary */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6eadd]/50">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#497d65] mb-4">Quick Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Tech Skills</span>
                    <span className="font-black text-[#0e1b12]">{profile.technical_skills.filter(Boolean).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Soft Skills</span>
                    <span className="font-black text-[#0e1b12]">{profile.soft_skills.filter(Boolean).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Projects</span>
                    <span className="font-black text-[#0e1b12]">{profile.projects.filter((p) => p.name).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#497d65] font-medium">Target Roles</span>
                    <span className="font-black text-[#0e1b12]">{profile.target_roles.filter(Boolean).length}</span>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full mt-5 py-2.5 bg-[#17e85d] text-[#112116] font-black text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-[#112116] border-t-transparent rounded-full animate-spin" /> : <MI name="save" className="text-[16px]" />}
                  {loading ? "Saving..." : "Save All Changes"}
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* ── Roadmap Modal ── */}
      {showRoadmap && missingSkills.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowRoadmap(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#d6eadd] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#ecf6ef] flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ecf6ef] flex items-center justify-center">
                  <MI name="map" className="text-[#17e85d] text-[20px]" filled />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0e1b12]">Your Learning Roadmap</h2>
                  <p className="text-xs text-[#497d65]">Skills to learn · Ordered by priority</p>
                </div>
              </div>
              <button onClick={() => setShowRoadmap(false)} className="text-[#89bca1] hover:text-red-500 transition-colors">
                <MI name="close" />
              </button>
            </div>

            {/* Skills list */}
            <div className="p-6 space-y-4">
              {missingSkills.map((skill, i) => {
                const roadmapUrl = skill.roadmap_slug
                  ? `https://roadmap.sh/${skill.roadmap_slug}`
                  : null;
                const resourceUrl = roadmapUrl || skill.alt_resource;
                const resourceName = roadmapUrl
                  ? "roadmap.sh"
                  : skill.alt_resource_name || "Learning Resource";
                const isRoadmap = !!roadmapUrl;

                return (
                  <div key={i} className="flex gap-4 items-start">
                    {/* Step number */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                      skill.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : skill.priority === "Medium"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {i + 1}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-[#f6f8f6] border border-[#d6eadd] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-bold text-[#0e1b12] text-base">{skill.skill}</p>
                          <p className="text-xs text-[#497d65] mt-1 leading-relaxed">{skill.reason}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-full ${
                          skill.priority === "High" ? "bg-red-100 text-red-600" :
                          skill.priority === "Medium" ? "bg-amber-100 text-amber-600" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {skill.priority} Priority
                        </span>
                      </div>

                      {/* Resource link */}
                      {resourceUrl && (
                        <a
                          href={resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            isRoadmap
                              ? "bg-[#112116] text-[#17e85d] hover:brightness-125"
                              : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          <MI name={isRoadmap ? "route" : "open_in_new"} className="text-[14px]" />
                          Learn on {resourceName}
                          {isRoadmap && <span className="opacity-60">↗</span>}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6">
              <p className="text-xs text-[#89bca1] text-center">
                Skills are ordered by frequency across your applied job descriptions.
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-[#d6eadd]/40 text-center w-full">
        <p className="text-[#89bca1] text-sm font-medium">© 2025 ResumeSync — Powered by Groq AI</p>
      </footer>
    </div>
  );
}
