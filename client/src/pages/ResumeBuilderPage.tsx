import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import html2pdf from "html2pdf.js";

let uid = 100;
const newId = () => ++uid;

const initState = () => ({
  name: "", phone: "", email: "", linkedin: "", github: "", portfolio: "", location: "",
  jobDescription: "",
  summary: "",
  education: [{ id: newId(), school: "", degree: "", start: "", end: "", location: "" }],
  experience: [{ id: newId(), company: "", role: "", start: "", end: "", location: "", bullets: "" }],
  projects: [{ id: newId(), name: "", tech: "", link: "", bullets: "" }],
  skills: [{ id: newId(), domain: "", skills: "" }],
  certifications: [{ id: newId(), text: "" }],
  achievements: [{ id: newId(), text: "" }],
});

const bullets = (text: string) => {
  if (!text?.trim()) return null;
  const lines = text.split("\n").filter((l) => l.trim());
  return <ul className="list-disc pl-4 text-[10.5px] text-[#333] mt-1 space-y-0.5">{lines.map((l, i) => <li key={i}>{l.trim()}</li>)}</ul>;
};

function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
      {children}
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <Field label={label}>
      <input className="w-full bg-[#f6f8f6] border border-[#e7f3eb] rounded-lg text-[#0e1b12] text-[13px] px-3 py-2.5 outline-none transition-colors hover:border-[#d6eadd] focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] placeholder:text-slate-400" {...props} />
    </Field>
  );
}

function Textarea({ label, onRefine, ...props }: any) {
  const isRefinable = props.value && props.value.trim().length > 10;
  return (
    <div className="mb-4 relative group">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
      {onRefine && (
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); if(isRefinable) onRefine(); }}
          disabled={!isRefinable}
          className={`absolute top-0 right-0 -mt-0.5 text-[10px] items-center gap-1 flex shadow-sm px-2 py-0.5 rounded font-bold transition-all ${isRefinable ? 'bg-[#17e85d] text-[#112116] hover:brightness-105 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          title="Refine with AI"
        >
          <span className="material-symbols-outlined text-[13px]">auto_awesome</span> Refine
        </button>
      )}
      <textarea className="w-full bg-[#f6f8f6] border border-[#e7f3eb] rounded-lg text-[#0e1b12] text-[13px] px-3 py-2.5 outline-none transition-colors hover:border-[#d6eadd] focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] placeholder:text-slate-400 min-h-[80px] leading-relaxed resize-y" {...props} />
    </div>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-6 first:mt-0">
      {children}
      <div className="flex-1 h-px bg-[#e7f3eb]"></div>
    </div>
  );
}

function EntryWrapper({ label, onRemove, children }: any) {
  return (
    <div className="bg-white border border-[#e7f3eb] rounded-xl p-4 mb-3 relative shadow-sm hover:border-[#d6eadd] transition-colors">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-[#17e85d] font-bold tracking-wider">{label}</span>
        {onRemove && (
          <button onClick={onRemove} className="text-[11px] text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AddBtn({ onClick, text }: any) {
  return (
    <button onClick={onClick} className="w-full py-2.5 bg-transparent border border-dashed border-[#d6eadd] rounded-lg text-slate-500 text-xs font-bold hover:border-[#17e85d] hover:text-[#17e85d] hover:bg-[#17e85d]/5 transition-all outline-none mt-1">
      {text}
    </button>
  );
}

function BasicsTab({ data, set, onRefine }: any) {
  return (
    <>
      <SectionDivider>Personal</SectionDivider>
      <Input label="Full name" placeholder="e.g. Priya Sharma" value={data.name} onChange={(e: any) => set("name", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Phone" placeholder="+91 98765 43210" value={data.phone} onChange={(e: any) => set("phone", e.target.value)} />
        <Input label="Email" placeholder="you@email.com" value={data.email} onChange={(e: any) => set("email", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="LinkedIn" placeholder="linkedin.com/in/you" value={data.linkedin} onChange={(e: any) => set("linkedin", e.target.value)} />
        <Input label="GitHub" placeholder="github.com/you" value={data.github} onChange={(e: any) => set("github", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Portfolio" placeholder="yoursite.com" value={data.portfolio} onChange={(e: any) => set("portfolio", e.target.value)} />
        <Input label="Location" placeholder="Chennai, Tamil Nadu" value={data.location} onChange={(e: any) => set("location", e.target.value)} />
      </div>

      <SectionDivider>Target Job</SectionDivider>
      <Textarea label="Job Description (Optional)" placeholder="Paste the job description you are applying for here to heavily tailor all AI suggestions..." value={data.jobDescription} onChange={(e: any) => set("jobDescription", e.target.value)} />

      <SectionDivider>Summary</SectionDivider>
      <Textarea label="Profile summary" placeholder="A brief 3-4 line intro about you, your skills, and what you're looking for..." value={data.summary} onChange={(e: any) => set("summary", e.target.value)} onRefine={() => onRefine(data.summary, "Summary", (val: string) => set("summary", val))} />

      <SectionDivider>Education</SectionDivider>
      {data.education.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`EDU_${String(i + 1).padStart(2, "0")}`} onRemove={data.education.length > 1 ? () => set("education", data.education.filter((x: any) => x.id !== e.id)) : null}>
          <Input label="School / University" placeholder="Shiv Nadar University" value={e.school} onChange={(ev: any) => set("education", data.education.map((x: any) => x.id === e.id ? { ...x, school: ev.target.value } : x))} />
          <Input label="Degree / Program" placeholder="B.Tech in Computer Science" value={e.degree} onChange={(ev: any) => set("education", data.education.map((x: any) => x.id === e.id ? { ...x, degree: ev.target.value } : x))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" placeholder="Aug 2023" value={e.start} onChange={(ev: any) => set("education", data.education.map((x: any) => x.id === e.id ? { ...x, start: ev.target.value } : x))} />
            <Input label="End / Expected" placeholder="May 2027" value={e.end} onChange={(ev: any) => set("education", data.education.map((x: any) => x.id === e.id ? { ...x, end: ev.target.value } : x))} />
          </div>
          <Input label="Location" placeholder="Chennai, Tamil Nadu" value={e.location} onChange={(ev: any) => set("education", data.education.map((x: any) => x.id === e.id ? { ...x, location: ev.target.value } : x))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Education" onClick={() => set("education", [...data.education, { id: newId(), school: "", degree: "", start: "", end: "", location: "" }])} />
    </>
  );
}

function ExperienceTab({ data, set, onRefine }: any) {
  return (
    <>
      <SectionDivider>Work Experience</SectionDivider>
      {data.experience.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`EXP_${String(i + 1).padStart(2, "0")}`} onRemove={data.experience.length > 1 ? () => set("experience", data.experience.filter((x: any) => x.id !== e.id)) : null}>
          <Input label="Company" placeholder="Infosys Springboard" value={e.company} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, company: ev.target.value } : x))} />
          <Input label="Role / Title" placeholder="Full Stack Intern" value={e.role} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, role: ev.target.value } : x))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" placeholder="Aug 2025" value={e.start} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, start: ev.target.value } : x))} />
            <Input label="End" placeholder="Oct 2025 / Present" value={e.end} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, end: ev.target.value } : x))} />
          </div>
          <Input label="Location" placeholder="Remote / Chennai" value={e.location} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, location: ev.target.value } : x))} />
          <Textarea label="Bullet points (one per line)" placeholder={"Built REST APIs using Node.js...\nOptimized database queries reducing load time by 30%..."} value={e.bullets} onChange={(ev: any) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, bullets: ev.target.value } : x))} onRefine={() => onRefine(e.bullets, "Experience Bullets", (val: string) => set("experience", data.experience.map((x: any) => x.id === e.id ? { ...x, bullets: val } : x)))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Experience" onClick={() => set("experience", [...data.experience, { id: newId(), company: "", role: "", start: "", end: "", location: "", bullets: "" }])} />
    </>
  );
}

function ProjectsTab({ data, set, onRefine }: any) {
  return (
    <>
      <SectionDivider>Projects</SectionDivider>
      {data.projects.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`PROJ_${String(i + 1).padStart(2, "0")}`} onRemove={data.projects.length > 1 ? () => set("projects", data.projects.filter((x: any) => x.id !== e.id)) : null}>
          <Input label="Project name" placeholder="Inaikka: Real-Time Chat App" value={e.name} onChange={(ev: any) => set("projects", data.projects.map((x: any) => x.id === e.id ? { ...x, name: ev.target.value } : x))} />
          <Input label="Tech stack" placeholder="MongoDB, Express.js, React.js, Node.js, Socket.IO" value={e.tech} onChange={(ev: any) => set("projects", data.projects.map((x: any) => x.id === e.id ? { ...x, tech: ev.target.value } : x))} />
          <Input label="GitHub / Live link (optional)" placeholder="github.com/you/project" value={e.link} onChange={(ev: any) => set("projects", data.projects.map((x: any) => x.id === e.id ? { ...x, link: ev.target.value } : x))} />
          <Textarea label="Bullet points (one per line)" placeholder={"Developed real-time messaging using Socket.IO...\nImplemented JWT-based authentication..."} value={e.bullets} onChange={(ev: any) => set("projects", data.projects.map((x: any) => x.id === e.id ? { ...x, bullets: ev.target.value } : x))} onRefine={() => onRefine(e.bullets, "Project Bullets", (val: string) => set("projects", data.projects.map((x: any) => x.id === e.id ? { ...x, bullets: val } : x)))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Project" onClick={() => set("projects", [...data.projects, { id: newId(), name: "", tech: "", link: "", bullets: "" }])} />
    </>
  );
}

function MoreTab({ data, set, onRefine }: any) {
  return (
    <>
      <SectionDivider>Technical Skills</SectionDivider>
      {data.skills.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`SKILL_${String(i + 1).padStart(2, "0")}`} onRemove={data.skills.length > 1 ? () => set("skills", data.skills.filter((x: any) => x.id !== e.id)) : null}>
          <Input label="Domain (e.g. Frontend)" placeholder="Frontend" value={e.domain} onChange={(ev: any) => set("skills", data.skills.map((x: any) => x.id === e.id ? { ...x, domain: ev.target.value } : x))} />
          <Input label="Skills" placeholder="React, Next.js, Tailwind CSS" value={e.skills} onChange={(ev: any) => set("skills", data.skills.map((x: any) => x.id === e.id ? { ...x, skills: ev.target.value } : x))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Skill Domain" onClick={() => set("skills", [...data.skills, { id: newId(), domain: "", skills: "" }])} />

      <SectionDivider>Certifications</SectionDivider>
      {data.certifications.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`CERT_${String(i + 1).padStart(2, "0")}`} onRemove={data.certifications.length > 1 ? () => set("certifications", data.certifications.filter((x: any) => x.id !== e.id)) : null}>
          <Input label="Certification name & issuer" placeholder="J.P. Morgan Software Engineering – Forage" value={e.text} onChange={(ev: any) => set("certifications", data.certifications.map((x: any) => x.id === e.id ? { ...x, text: ev.target.value } : x))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Certification" onClick={() => set("certifications", [...data.certifications, { id: newId(), text: "" }])} />

      <SectionDivider>Achievements</SectionDivider>
      {data.achievements.map((e: any, i: number) => (
        <EntryWrapper key={e.id} label={`ACH_${String(i + 1).padStart(2, "0")}`} onRemove={data.achievements.length > 1 ? () => set("achievements", data.achievements.filter((x: any) => x.id !== e.id)) : null}>
          <Textarea label="Achievement description" placeholder="2x Finalist in Internal Hackathon – Built a gamified website promoting marine education." value={e.text} onChange={(ev: any) => set("achievements", data.achievements.map((x: any) => x.id === e.id ? { ...x, text: ev.target.value } : x))} onRefine={() => onRefine(e.text, "Achievements", (val: string) => set("achievements", data.achievements.map((x: any) => x.id === e.id ? { ...x, text: val } : x)))} />
        </EntryWrapper>
      ))}
      <AddBtn text="+ Add Achievement" onClick={() => set("achievements", [...data.achievements, { id: newId(), text: "" }])} />
    </>
  );
}

function Preview({ data, forwardedRef }: any) {
  const contact = [data.phone, data.email, data.linkedin, data.github, data.portfolio, data.location].filter(Boolean).join("  ·  ");
  const validEdu = data.education.filter((e: any) => e.school || e.degree);
  const validExp = data.experience.filter((e: any) => e.company || e.role);
  const validProj = data.projects.filter((e: any) => e.name);
  const validSkills = data.skills.filter((e: any) => e.domain || e.skills);
  const validCerts = data.certifications.filter((e: any) => e.text);
  const validAchs = data.achievements.filter((e: any) => e.text);

  return (
    <div ref={forwardedRef} className="w-full max-w-[800px] bg-white text-[#111] p-[48px] shadow-xl border border-gray-100" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
          .p-sec { font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1.5px solid #111; padding-bottom: 4px; margin: 20px 0 10px; font-family: 'Inter', sans-serif; }
          .p-name { font-family: 'Instrument Serif', serif; font-size: 38px; font-weight: 400; letter-spacing: -0.01em; margin-bottom: 6px; text-align: center; }
          .p-contact { font-size: 11px; color: #444; letter-spacing: 0.02em; margin-bottom: 24px; text-align: center; font-family: 'Inter', sans-serif; }
          .empty-hint { color: #bbb; font-style: italic; }
        `}
      </style>
      
      <div className="p-name">{data.name || <span className="empty-hint">Your Name</span>}</div>
      <div className="p-contact">{contact || <span className="empty-hint">phone · email · location</span>}</div>

      {data.summary && (
        <>
          <div className="p-sec">Profile Summary</div>
          <p className="text-[11.5px] leading-[1.65] text-[#222]">{data.summary}</p>
        </>
      )}

      {validEdu.length > 0 && (
        <>
          <div className="p-sec">Education</div>
          {validEdu.map((e: any) => (
            <div className="mb-3" key={e.id}>
              <div className="flex justify-between font-bold text-[12.5px] text-[#111]">
                <span>{e.school}</span>
                <span>{e.location}</span>
              </div>
              <div className="flex justify-between italic text-[11.5px] text-[#444] mt-0.5">
                <span>{e.degree}</span>
                <span>{[e.start, e.end].filter(Boolean).join(" – ")}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {validExp.length > 0 && (
        <>
          <div className="p-sec">Experience</div>
          {validExp.map((e: any) => (
            <div className="mb-3.5" key={e.id}>
              <div className="flex justify-between font-bold text-[12.5px] text-[#111]">
                <span>{e.company}</span>
                <span>{e.location}</span>
              </div>
              <div className="flex justify-between italic text-[11.5px] text-[#444] mt-0.5 mb-1.5">
                <span>{e.role}</span>
                <span>{[e.start, e.end].filter(Boolean).join(" – ")}</span>
              </div>
              {bullets(e.bullets)}
            </div>
          ))}
        </>
      )}

      {validProj.length > 0 && (
        <>
          <div className="p-sec">Projects</div>
          {validProj.map((e: any) => (
            <div className="mb-3.5" key={e.id}>
              <div className="flex justify-between font-bold text-[12.5px] text-[#111] mb-1">
                <span>
                  {e.name}
                  {e.tech && <span className="font-normal italic text-[11px] text-[#555]"> · {e.tech}</span>}
                </span>
                {e.link && <span className="text-[10px] text-blue-600 font-mono font-normal tracking-wide">{e.link}</span>}
              </div>
              {bullets(e.bullets)}
            </div>
          ))}
        </>
      )}

      {validSkills.length > 0 && (
        <>
          <div className="p-sec">Technical Skills</div>
          {validSkills.map((e: any) => (
            <div className="text-[11.5px] text-[#333] mb-1" key={e.id}>
              <b className="text-[#111]">{e.domain}:</b> {e.skills}
            </div>
          ))}
        </>
      )}

      {validCerts.length > 0 && (
        <>
          <div className="p-sec">Certifications</div>
          <ul className="list-disc pl-4">
            {validCerts.map((e: any) => <li className="text-[11.5px] text-[#333] mb-0.5" key={e.id}>{e.text}</li>)}
          </ul>
        </>
      )}

      {validAchs.length > 0 && (
        <>
          <div className="p-sec">Achievements</div>
          <ul className="list-disc pl-4">
            {validAchs.map((e: any) => <li className="text-[11.5px] text-[#333] mb-0.5" key={e.id}>{e.text}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

function AiRefineModal({ args, onClose, token }: any) {
  const [loading, setLoading] = useState(false);
  const [refinedText, setRefinedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (args) {
      setRefinedText("");
      setError("");
      setLoading(true);
      
      fetch(`${API}/api/resume/refine-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: args.text, context: args.context, jobDescription: args.jobDescription })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setRefinedText(data.refinedText);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    }
  }, [args, token]);

  if (!args) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4 text-[#17e85d]">
          <span className="material-symbols-outlined border-2 border-[#17e85d] rounded-full p-1 text-[16px]">auto_awesome</span>
          <h3 className="text-lg font-black text-[#0e1b12] tracking-tight">Refine with AI</h3>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#17e85d] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-500 animate-pulse">Polishing your text...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-4">
            <b>API Error:</b> {error}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Original</label>
              <div className="text-sm text-slate-600 p-3 bg-slate-50 border border-gray-100 rounded-lg whitespace-pre-wrap">{args.text}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#17e85d] uppercase tracking-wider mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> AI Suggestion</label>
              <textarea 
                className="w-full text-sm text-[#0e1b12] p-3 bg-[#f6f8f6] border border-[#17e85d]/40 rounded-lg whitespace-pre-wrap outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d]/50 min-h-[140px] resize-y shadow-sm"
                value={refinedText}
                onChange={(e) => setRefinedText(e.target.value)}
              />
              <p className="text-[10.5px] text-slate-400 mt-1 italic font-medium">You can edit the AI suggestion above before applying.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button 
            disabled={loading || !refinedText} 
            onClick={() => { args.onApply(refinedText); onClose(); }} 
            className="flex-1 py-2.5 bg-[#17e85d] text-[#112116] rounded-lg text-sm font-bold hover:brightness-105 transition-all disabled:opacity-60 shadow-sm"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = ["basics", "experience", "projects", "more"];
const TAB_LABELS: Record<string, string> = { basics: "Basics", experience: "Experience", projects: "Projects", more: "More +" };

export default function ResumeBuilderPage() {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState(initState());
  const [tab, setTab] = useState("basics");
  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(routeId || null);
  const [fileName, setFileName] = useState<string>("");
  const [pendingDownload, setPendingDownload] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [refineModalArgs, setRefineModalArgs] = useState<{ text: string, context: string, jobDescription: string, onApply: (val: string) => void } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (routeId) {
      fetch(`${API}/api/resume/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.resume_data) {
          setData(resData.resume_data);
        } else if (resData.resume_text && resData.file_name) {
          setData(prev => ({ ...prev, name: resData.file_name.replace(".pdf", "") }));
        }
        if (resData.file_name) setFileName(resData.file_name);
      })
      .catch(() => toast({ title: "Failed to load resume", variant: "destructive" }));
    }
  }, [routeId, token]);

  const set = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));

  /** Called when user clicks Save or Save & Download PDF */
  const handleSaveClick = (download: boolean) => {
    if (!resumeId) {
      // First save — ask for a name
      setNameInput(data.name || "");
      setPendingDownload(download);
      setShowNameDialog(true);
    } else {
      doSave(fileName, download);
    }
  };

  /** Confirm name from dialog and save */
  const confirmName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toast({ title: "Please enter a resume name", variant: "destructive" });
      return;
    }
    setFileName(trimmed);
    setShowNameDialog(false);
    doSave(trimmed, pendingDownload);
  };

  const doSave = async (name: string, download: boolean) => {
    try {
      setSaving(true);
      let id = resumeId;

      if (!id) {
        // Build text for backend validation
        const rawTextParts = [
          data.name, data.summary,
          ...data.experience.map((e: any) => `${e.company} ${e.role} ${e.bullets}`),
          ...data.education.map((e: any) => `${e.school} ${e.degree}`),
          ...data.projects.map((p: any) => `${p.name} ${p.tech} ${p.bullets}`),
          ...data.skills.map((s: any) => `${s.domain} ${s.skills}`)
        ].filter(Boolean).join(" \n");

        const paddedText = rawTextParts.length > 50
          ? rawTextParts
          : rawTextParts + "\nUser is building a new resume from scratch. This text satisfies minimum length requirements.";

        const formData = new FormData();
        formData.append("resumeText", paddedText);
        formData.append("jobRole", "General");
        formData.append("fileName", name); // ← set correct name from the start

        const res = await fetch(`${API}/api/resume/analyze`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || "Failed to create");
        id = resData.data._id;
        setResumeId(id);
        // Update the URL so refreshing stays on the same doc
        navigate(`/builder/${id}`, { replace: true });
      }

      await fetch(`${API}/api/resume/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resume_data: data, file_name: name }),
      });

      toast({ title: `✅ "${name}" saved successfully!` });

      if (download && previewRef.current) {
        const opt = {
          margin: 0,
          filename: `${name.replace(/\s+/g, "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        html2pdf().set(opt).from(previewRef.current).save();
      }
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-[Inter,sans-serif] bg-[#f6f8f6] text-[#0e1b12] overflow-hidden antialiased">
      <Navbar />

      {/* Name Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNameDialog(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black mb-1">Name your resume</h3>
            <p className="text-xs text-slate-500 mb-4">This name will appear in your "My Resumes" library.</p>
            <input
              id="resume-name-input"
              autoFocus
              className="w-full bg-[#f6f8f6] border border-[#e7f3eb] rounded-lg text-[#0e1b12] text-sm px-3 py-2.5 outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] mb-4"
              placeholder="e.g. Frontend Developer Resume"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && confirmName()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowNameDialog(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={confirmName} disabled={saving} className="flex-1 py-2.5 bg-[#17e85d] text-[#112116] rounded-lg text-sm font-bold hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <div className="w-3.5 h-3.5 border-2 border-[#112116] border-t-transparent rounded-full animate-spin" />}
                {pendingDownload ? "Save & Download" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AiRefineModal args={refineModalArgs} onClose={() => setRefineModalArgs(null)} token={token} />
      
      {/* Action Bar */}
      <div className="h-14 shrink-0 bg-white border-b border-[#e7f3eb] flex items-center justify-between px-6 shadow-sm z-10 w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#17e85d] text-xl">edit_document</span>
          <span className="font-bold text-sm tracking-tight">Resume Builder</span>
          {fileName && <span className="text-xs text-slate-400 font-normal ml-1">— {fileName}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/resumes")}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-[#0e1b12] transition-colors"
          >
            My Resumes
          </button>
          <button
            onClick={() => handleSaveClick(false)}
            disabled={saving}
            className="px-4 py-2 bg-[#f6f8f6] hover:bg-[#ecf6ef] border border-[#d6eadd] text-[#0e1b12] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-[#0e1b12] border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[16px]">save</span>}
            Save
          </button>
          <button
            onClick={() => handleSaveClick(true)}
            disabled={saving}
            className="px-4 py-2 bg-[#17e85d] hover:brightness-105 text-[#112116] text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Save & Download PDF
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="w-[380px] min-w-[320px] bg-white border-r border-[#e7f3eb] flex flex-col shrink-0">
          <div className="px-6 pt-5 pb-0 border-b border-[#e7f3eb]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#17e85d] text-2xl">edit_document</span>
              <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.01em" }}>Start Building</h2>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x">
              {TABS.map(t => (
                <button 
                  key={t} 
                  className={`px-4 py-2.5 text-[13px] font-bold tracking-wide whitespace-nowrap border-b-2 snap-start transition-colors ${
                    tab === t 
                      ? "border-[#17e85d] text-[#112116]" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`} 
                  onClick={() => setTab(t)}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {tab === "basics" && <BasicsTab data={data} set={set} onRefine={(text: string, context: string, onApply: any) => setRefineModalArgs({ text, context, jobDescription: data.jobDescription, onApply })} />}
            {tab === "experience" && <ExperienceTab data={data} set={set} onRefine={(text: string, context: string, onApply: any) => setRefineModalArgs({ text, context, jobDescription: data.jobDescription, onApply })} />}
            {tab === "projects" && <ProjectsTab data={data} set={set} onRefine={(text: string, context: string, onApply: any) => setRefineModalArgs({ text, context, jobDescription: data.jobDescription, onApply })} />}
            {tab === "more" && <MoreTab data={data} set={set} onRefine={(text: string, context: string, onApply: any) => setRefineModalArgs({ text, context, jobDescription: data.jobDescription, onApply })} />}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex-1 bg-gray-200/60 overflow-y-auto p-12 flex items-start justify-center shadow-inner">
          <Preview data={data} forwardedRef={previewRef} />
        </div>
      </div>
    </div>
  );
}
