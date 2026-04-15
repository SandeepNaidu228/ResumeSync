import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/config";

export default function ProfileOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    target_roles: [""],
    experience_level: "Fresher",
    raw_bio: "",
    technical_skills: [""],
    soft_skills: [""],
    projects: [{ name: "", tech_stack: "", description: "" }]
  });

  const handleArrayChange = (field: keyof typeof profile, index: number, val: string) => {
    const newArr = [...profile[field]] as any[];
    newArr[index] = val;
    setProfile({ ...profile, [field]: newArr });
  };

  const addArrayItem = (field: keyof typeof profile) => {
    setProfile({ ...profile, [field]: [...profile[field] as any[], ""] });
  };
  
  const removeArrayItem = (field: keyof typeof profile, index: number) => {
    if ((profile[field] as any[]).length > 1) {
      const newArr = [...profile[field]] as any[];
      newArr.splice(index, 1);
      setProfile({ ...profile, [field]: newArr });
    }
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
    if (profile.projects.length > 1) {
      const newProjects = [...profile.projects];
      newProjects.splice(index, 1);
      setProfile({ ...profile, projects: newProjects });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userJSON = localStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;
      
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

      if (user) {
        user.profile_completed = true;
        localStorage.setItem("user", JSON.stringify(user));
      }
      localStorage.setItem("profile_completed", "true");

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-bold text-slate-700 mb-1.5">{children}</label>
  );

  return (
    <div className="min-h-screen bg-[#f3f6f4] flex flex-col items-center justify-center p-6 font-['Inter',sans-serif]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#112116] p-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Build Your Master Vault</h1>
          <p className="text-sm text-green-100 opacity-90">Give our AI everything it needs to write world-class resumes for you.</p>
        </div>

        <div className="flex">
            <div className={`h-1 flex-1 transition-all ${step >= 1 ? 'bg-[#17e85d]' : 'bg-gray-200'}`} />
            <div className={`h-1 flex-1 transition-all ${step >= 2 ? 'bg-[#17e85d]' : 'bg-gray-200'}`} />
            <div className={`h-1 flex-1 transition-all ${step >= 3 ? 'bg-[#17e85d]' : 'bg-gray-200'}`} />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">1. The Basics</h2>
              
              <div>
                 <FieldLabel>Target Indusrty / Role</FieldLabel>
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

              <div>
                <FieldLabel>Raw Bio (Brain Dump)</FieldLabel>
                <p className="text-xs text-gray-500 mb-2">Don't worry about formatting. Just type exactly who you are, what you love building, and what makes you good. The AI will polish it automatically later.</p>
                <textarea 
                  value={profile.raw_bio} 
                  onChange={(e) => setProfile({...profile, raw_bio: e.target.value})}
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] resize-none"
                  placeholder="I am a passionate CS student. I got into coding because..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">2. Skills Vault</h2>
              <p className="text-xs text-gray-500 -mt-2">List any technologies or platforms you have used.</p>

              <div>
                 <FieldLabel>Technical Skills (Languages, Frameworks, Tools)</FieldLabel>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                 {profile.technical_skills.map((skill, i) => (
                    <div key={i} className="flex gap-1">
                       <input value={skill} onChange={(e) => handleArrayChange('technical_skills', i, e.target.value)} placeholder="e.g. React.js" className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" />
                    </div>
                 ))}
                 </div>
                 <button onClick={() => addArrayItem('technical_skills')} className="text-xs font-bold text-[#17e85d] mt-2">+ ADD TECH SKILL</button>
              </div>

              <div className="mt-8">
                 <FieldLabel>Soft Skills (Leadership, Methodologies)</FieldLabel>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                 {profile.soft_skills.map((skill, i) => (
                    <div key={i} className="flex gap-1">
                       <input value={skill} onChange={(e) => handleArrayChange('soft_skills', i, e.target.value)} placeholder="e.g. Agile Scrum" className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" />
                    </div>
                 ))}
                 </div>
                 <button onClick={() => addArrayItem('soft_skills')} className="text-xs font-bold text-[#17e85d] mt-2">+ ADD SOFT SKILL</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">3. Master Projects</h2>
              <p className="text-xs text-gray-500 -mt-2">Add all the projects you've ever built. We will dynamically select the best 2-3 to show on your final resume based on the specific job you apply for.</p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                {profile.projects.map((proj, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                    <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 font-bold text-xs">Remove</button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <FieldLabel>Project Name</FieldLabel>
                        <input value={proj.name} onChange={(e) => handleProjectChange(i, 'name', e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" placeholder="Spotify Clone" />
                      </div>
                      <div>
                        <FieldLabel>Tech Stack</FieldLabel>
                        <input value={proj.tech_stack} onChange={(e) => handleProjectChange(i, 'tech_stack', e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[#0e1b12] outline-none focus:border-[#17e85d]" placeholder="React, Node, MongoDB" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Description / Problem Solved</FieldLabel>
                      <textarea value={proj.description} onChange={(e) => handleProjectChange(i, 'description', e.target.value)} className="w-full h-20 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#0e1b12] outline-none focus:border-[#17e85d] resize-none" placeholder="Built a full stack music player that allowed users to..." />
                    </div>
                  </div>
                ))}
                <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-[#17e85d] text-[#112116] rounded-xl font-bold hover:bg-[#17e85d]/10 transition">
                  + Add Another Master Project
                </button>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-lg font-bold text-gray-500 hover:bg-gray-100">Back</button>
            ) : <div />}

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)} 
                className="px-8 py-2.5 rounded-lg font-bold bg-[#112116] text-white hover:bg-[#112116]/90 shadow-md transition"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="px-8 py-2.5 rounded-lg font-bold bg-[#17e85d] text-[#112116] hover:brightness-105 shadow-md transition flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? "Saving..." : "Finish Setup ✨"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
