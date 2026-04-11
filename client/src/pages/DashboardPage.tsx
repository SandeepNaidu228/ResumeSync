import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import Navbar from "../components/Navbar";
import html2pdf from "html2pdf.js";
import ResumeTemplate, {
  defaultResumeData,
  serializeResumeToText,
  type ResumeData,
} from "../components/ResumeTemplate";

const MI = ({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);

  const [activeResume, setActiveResume] = useState<any>(null);
  /** Structured resume data for the editable template */
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isCompiling, setIsCompiling] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);


  // Job description (for right sidebar reference)
  const [jd, setJd] = useState("");

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchHistory();
    // Reload last active resume so it persists across navigation
    const lastId = localStorage.getItem("lastActiveResumeId");
    if (lastId) loadResume(lastId);
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`${API}/api/resume/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHistory(data);
    } catch (err: any) {
      toast({
        title: "Failed to load history",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadResume = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActiveResume(data);

      // If the backend has structured resume_data, use it; otherwise fall back to default
      if (data.resume_data) {
        setResumeData(data.resume_data);
      } else {
        setResumeData(defaultResumeData);
      }

      setShowLibrary(false);
      localStorage.setItem("lastActiveResumeId", id);
    } catch (err: any) {
      toast({
        title: "Failed to load resume",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/api/resume/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Resume deleted" });
      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (activeResume && activeResume._id === id) {
        setActiveResume(null);
        setResumeData(defaultResumeData);
        localStorage.removeItem("lastActiveResumeId");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  /** Start a new blank resume using the template (no PDF upload needed) */
  const handleNewTemplateResume = async () => {
    try {
      setIsCompiling(true);
      const freshData = defaultResumeData;
      const resumeText = serializeResumeToText(freshData);

      const formData = new FormData();
      formData.append("resumeText", resumeText);
      formData.append("jobRole", "General");

      const res2 = await fetch(`${API}/api/resume/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res2.json();
      if (!res2.ok) throw new Error(data.error || "Failed to create resume");

      // Save the structured data
      await fetch(`${API}/api/resume/${data.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume_text: resumeText,
          resume_data: freshData,
        }),
      });

      toast({ title: "✅ New resume created!" });
      setResumeData(freshData);
      await fetchHistory();
      loadResume(data.data._id);
    } catch (err: any) {
      toast({ title: "Failed to create resume", description: err.message, variant: "destructive" });
    } finally {
      setIsCompiling(false);
    }
  };

  /** Auto-save resume data after edits with debounce */
  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);

    // Debounced auto-save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      if (!activeResume) return;
      try {
        setIsSaving(true);
        const resumeText = serializeResumeToText(newData);
        await fetch(`${API}/api/resume/${activeResume._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            resume_text: resumeText,
            resume_data: newData,
          }),
        });
      } catch {
        // silent fail on auto-save
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  };



  const handleDownload = () => {
    if (resumeRef.current) {
      const opt = {
        margin: 0.5,
        filename: `${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
      };
      html2pdf().set(opt).from(resumeRef.current).save();
    }
  };

  return (
    <div className="bg-[#f6f8f6] text-[#294238] antialiased min-h-screen flex flex-col font-[Inter,sans-serif]">
      <Navbar />

      {!activeResume ? (
        /* ── NO RESUME SELECTED / EMPTY STATE ── */
        <main className="pt-6 pb-12 px-6 md:px-8 max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
          <div
            className="flex flex-col md:flex-row gap-8"
            style={{ minHeight: "calc(100vh - 130px)" }}
          >
            <section className="flex-[2] flex flex-col w-full h-full min-w-0">
              {!showLibrary && (
                <div className="bg-white rounded-xl shadow-sm border border-[#d6eadd] flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                  <div className="w-20 h-20 bg-[#ecf6ef] rounded-full flex items-center justify-center mb-6">
                    <MI name="description" className="text-4xl text-[#639d80]" filled />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Resume Selected</h3>
                  <p className="text-[#497d65] max-w-xs mb-8 text-sm leading-relaxed">
                    Start with your personal resume template or load one from your library.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                      onClick={handleNewTemplateResume}
                      disabled={isCompiling}
                      className="flex-1 bg-[#17e85d] text-[#112116] px-6 py-3 rounded-lg font-bold shadow hover:brightness-105 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {isCompiling ? (
                        <div className="w-4 h-4 border-2 border-[#112116] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MI name="edit_document" className="text-[18px]" />
                      )}
                      Use My Template
                    </button>
                    <button
                      onClick={() => setShowLibrary(true)}
                      className="flex-1 bg-[#d6eadd] text-[#294238] px-6 py-3 rounded-lg font-bold hover:bg-[#b3d6c1] transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <MI name="folder_open" className="text-[18px]" />
                      Select from Library
                    </button>
                  </div>
                </div>
              )}

              {showLibrary && (
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#d6eadd] flex flex-col overflow-hidden h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[#d6eadd]">
                    <h3 className="font-bold">Select a Resume</h3>
                    <button
                      onClick={() => setShowLibrary(false)}
                      className="text-[#497d65] hover:text-red-500"
                    >
                      <MI name="close" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingHistory ? (
                      <div className="flex justify-center py-8">
                        <div className="w-7 h-7 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : history.length === 0 ? (
                      <div className="text-center py-8 text-[#497d65] text-sm">
                        No resumes yet. Use "Use My Template" to create one.
                      </div>
                    ) : (
                      history.map((item) => (
                        <button
                          key={item._id}
                          onClick={() => loadResume(item._id)}
                          className="w-full flex items-center justify-between p-4 rounded-lg bg-[#f6f8f6] hover:bg-[#ecf6ef] border border-[#d6eadd] transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#ecf6ef] flex items-center justify-center">
                              <MI name="description" className="text-[#639d80]" filled />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#0e1b12]">
                                {item.file_name || "Resume"}
                              </p>
                              <p className="text-xs text-[#497d65]">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-sm font-bold ${
                                item.overall_score >= 75
                                  ? "text-green-600"
                                  : item.overall_score >= 50
                                  ? "text-yellow-600"
                                  : "text-red-500"
                              }`}
                            >
                              {item.overall_score || 0}/100
                            </span>
                            <button
                              onClick={(e) => handleDelete(e, item._id)}
                              className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                              title="Delete Resume"
                            >
                              <MI name="delete" className="text-[18px]" />
                            </button>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        /* ── ACTIVE RESUME: 3-PANE WORKSPACE ── */
        <main
          className="flex flex-1 overflow-hidden"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* ── LEFT PANE: Editable Resume Template (60%) ── */}
          <section className="flex-[3] flex flex-col min-w-0 overflow-hidden bg-[#ecf6ef]">
            {/* Toolbar */}
            <header className="h-12 border-b border-[#c6ddd0] bg-white flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[#497d65] font-bold truncate max-w-[200px]">
                  {activeResume?.file_name || resumeData.name || "Resume"}
                </span>
                {isSaving && (
                  <span className="text-[10px] text-[#89bca1] flex items-center gap-1">
                    <div className="w-2.5 h-2.5 border border-[#89bca1] border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveResume(null);
                    setResumeData(defaultResumeData);
                    localStorage.removeItem("lastActiveResumeId");
                  }}
                  className="text-xs text-[#89bca1] hover:text-[#294238] font-medium mx-2 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-1.5 bg-[#17e85d] text-[#112116] h-7 px-3 rounded text-xs font-black uppercase hover:brightness-110 active:scale-95 transition-all"
                >
                  <MI name="download" className="text-sm" />
                  Export PDF
                </button>
              </div>
            </header>

            {/* Resume Canvas */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center">
              <div
                ref={resumeRef}
                className="w-full max-w-[820px] shadow-xl border border-[#d8d4cc] rounded-sm"
                style={{ background: "#fffefb" }}
              >
                <ResumeTemplate
                  data={resumeData}
                  onChange={handleResumeDataChange}
                />
              </div>
            </div>
          </section>

          {/* ── RIGHT PANE: Sidebar ── */}
          <section className="w-[260px] shrink-0 bg-white border-l border-[#d6eadd] flex flex-col p-5 gap-5 overflow-y-auto">
            {/* Edit hint */}
            <div className="bg-[#f0fdf4] border border-[#d6eadd] rounded-xl p-4 text-[11px] text-[#497d65] leading-relaxed">
              <p className="font-black text-[#294238] text-xs mb-1">✏️ Inline Editing</p>
              Click any field in the resume to edit it directly. All changes are auto-saved.
            </div>

            {/* Job Description textarea */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#294238]">
                Job Description
              </h3>
              <p className="text-[11px] text-[#89bca1] -mt-1">
                Paste a JD here for reference while editing your resume.
              </p>
              <textarea
                className="w-full h-52 bg-[#f6f8f6] border border-[#d6eadd] rounded-xl p-3 text-[11px] text-[#497d65] focus:outline-none focus:ring-1 focus:ring-[#17e85d] focus:border-[#17e85d] transition-all resize-none leading-relaxed"
                placeholder="Paste the target job description here…"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <div className="bg-[#fffbeb] border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed">
              <p className="font-black text-amber-900 text-xs mb-1">➕ Add / Remove</p>
              Use the <span className="font-bold text-green-700">+</span> and <span className="font-bold text-red-600">×</span> buttons to add or remove bullets, skills, and sections.
            </div>

            <div className="mt-auto pt-4 border-t border-[#d6eadd]">
              <p className="text-[10px] text-[#89bca1] text-center leading-relaxed">
                Track your applications in<br/>
                <span className="font-bold text-[#497d65]">Job Tracker →</span>
              </p>
            </div>
          </section>
        </main>
      )}

      {/* Bottom accent line */}
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#17e85d]/20 to-transparent pointer-events-none" />
    </div>
  );
}