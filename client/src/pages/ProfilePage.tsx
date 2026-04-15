import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/config";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile_completed");
    navigate("/login");
  };

  const [profile, setProfile] = useState({
    target_roles: [""],
    experience_level: "Fresher",
    raw_bio: "",
    technical_skills: [""],
    soft_skills: [""],
    projects: [{ name: "", tech_stack: "", description: "" }]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          target_roles: data.target_roles?.length ? data.target_roles : [""],
          experience_level: data.experience_level || "Fresher",
          raw_bio: data.raw_bio || "",
          technical_skills: data.technical_skills?.length ? data.technical_skills : [""],
          soft_skills: data.soft_skills?.length ? data.soft_skills : [""],
          projects: data.projects?.length ? data.projects : [{ name: "", tech_stack: "", description: "" }]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleArrayChange = (field: keyof typeof profile, index: number, val: string) => {
    const newArr = [...profile[field]] as any[];
    newArr[index] = val;
    setProfile({ ...profile, [field]: newArr });
  };

  const addArrayItem = (field: keyof typeof profile) => {
    setProfile({ ...profile, [field]: [...profile[field] as any[], ""] });
  };
  
  const removeArrayItem = (field: keyof typeof profile, index: number) => {
    const newArr = [...profile[field]] as any[];
    newArr.splice(index, 1);
    setProfile({ ...profile, [field]: newArr });
  };

  const handleProjectChange = (index: number, key: string, val: string) => {
    const newProjects = [...profile.projects];
    newProjects[index] = { ...newProjects[index], [key]: val };
    setProfile({ ...profile, projects: newProjects });
  };

  const addProject = () => {
    setProfile({ ...profile, projects: [...profile.projects, { name: "", tech_stack: "", description: "" }] });
  };

  const removeProject = (index: number) => {
    const newProjects = [...profile.projects];
    newProjects.splice(index, 1);
    setProfile({ ...profile, projects: newProjects });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const payload = {
        target_roles: profile.target_roles.filter(Boolean),
        experience_level: profile.experience_level,
        raw_bio: profile.raw_bio,
        technical_skills: profile.technical_skills.filter(Boolean),
        soft_skills: profile.soft_skills.filter(Boolean),
        projects: profile.projects.filter(p => p.name || p.description)
      };

      const res = await fetch(`${API}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      alert("Profile Saved Successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-bold text-slate-700 mb-1.5">{children}</label>
  );

  if (initialLoad) {
    return <div className="min-h-screen bg-[#f3f6f4] flex items-center justify-center font-['Inter',sans-serif]">Loading Profile...</div>;
  }

  const userName = localStorage.getItem("user_name") || "User";

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f6f4] font-['Inter',sans-serif]">
      <Navbar />
      <div className="flex-1 flex flex-col items-center py-10 px-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#112116] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}><span className="material-symbols-outlined hover:text-[#17e85d] transition-colors">arrow_back</span> {userName}'s Master Profile</h1>
            <p className="text-sm text-green-100 opacity-90 mt-1">Manage all your global profile data used for AI Generations.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout} 
              className="text-red-400 font-bold hover:text-red-300 transition text-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span> Logout
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="px-6 py-2 rounded-lg font-bold bg-[#17e85d] text-[#112116] hover:brightness-105 shadow-md transition"
            >
              {loading ? "Saving..." : "Save Master Profile"}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Section 1 */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">Professional Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <FieldLabel>Target Indusrty / Roles</FieldLabel>
                 {profile.target_roles.map((role, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                       <input value={role} onChange={(e) => handleArrayChange('target_roles', i, e.target.value)} placeholder="e.g. Software Engineer" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d]" />
                       <button onClick={() => removeArrayItem('target_roles', i)} className="text-red-400 hover:text-red-600 px-2 font-bold">✕</button>
                    </div>
                 ))}
                 <button onClick={() => addArrayItem('target_roles')} className="text-xs font-bold text-[#17e85d]">+ ADD ROLE</button>
              </div>

              <div>
                <FieldLabel>Experience Level</FieldLabel>
                <select value={profile.experience_level} onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d]">
                  <option>Fresher / Student</option>
                  <option>Entry Level (1-2 Years)</option>
                  <option>Mid Level (3-5 Years)</option>
                  <option>Senior (5+ Years)</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Raw Bio (Brain Dump)</FieldLabel>
              <textarea 
                value={profile.raw_bio} 
                onChange={(e) => setProfile({...profile, raw_bio: e.target.value})}
                className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] resize-none"
                placeholder="I am a passionate CS student. I got into coding because..."
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">Skills Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <FieldLabel>Technical Skills</FieldLabel>
                 <div className="space-y-2 mt-2">
                 {profile.technical_skills.map((skill, i) => (
                    <div key={i} className="flex gap-2">
                       <input value={skill} onChange={(e) => handleArrayChange('technical_skills', i, e.target.value)} placeholder="e.g. React.js" className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" />
                       <button onClick={() => removeArrayItem('technical_skills', i)} className="text-red-400 hover:text-red-600 px-2 font-bold">✕</button>
                    </div>
                 ))}
                 </div>
                 <button onClick={() => addArrayItem('technical_skills')} className="text-xs font-bold text-[#17e85d] mt-2">+ ADD TECH SKILL</button>
              </div>

              <div>
                 <FieldLabel>Soft Skills</FieldLabel>
                 <div className="space-y-2 mt-2">
                 {profile.soft_skills.map((skill, i) => (
                    <div key={i} className="flex gap-2">
                       <input value={skill} onChange={(e) => handleArrayChange('soft_skills', i, e.target.value)} placeholder="e.g. Agile Scrum" className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" />
                       <button onClick={() => removeArrayItem('soft_skills', i)} className="text-red-400 hover:text-red-600 px-2 font-bold">✕</button>
                    </div>
                 ))}
                 </div>
                 <button onClick={() => addArrayItem('soft_skills')} className="text-xs font-bold text-[#17e85d] mt-2">+ ADD SOFT SKILL</button>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-6">
            <div className="border-b pb-2 flex justify-between items-end">
              <h2 className="text-xl font-bold">Master Projects</h2>
              <button onClick={addProject} className="text-sm font-bold text-[#17e85d]">+ Add Project</button>
            </div>
            
            <div className="space-y-6">
              {profile.projects.map((proj, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                  <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md font-bold text-xs flex items-center"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <FieldLabel>Project Name</FieldLabel>
                      <input value={proj.name} onChange={(e) => handleProjectChange(i, 'name', e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d]" placeholder="Spotify Clone" />
                    </div>
                    <div>
                      <FieldLabel>Tech Stack</FieldLabel>
                      <input value={proj.tech_stack} onChange={(e) => handleProjectChange(i, 'tech_stack', e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d]" placeholder="React, Node, MongoDB" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Description / Problem Solved</FieldLabel>
                    <textarea value={proj.description} onChange={(e) => handleProjectChange(i, 'description', e.target.value)} className="w-full h-24 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d] resize-none" placeholder="Built a full stack music player that allowed users to..." />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
