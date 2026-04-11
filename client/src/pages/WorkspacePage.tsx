import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import Navbar from "../components/Navbar";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // AI text replacement
  const [selectedText, setSelectedText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [resumeHtml, setResumeHtml] = useState("");
  const textRef = useRef<HTMLDivElement>(null);
  const [jdForTailor, setJdForTailor] = useState("");
  const [tailoredText, setTailoredText] = useState("");
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [view, setView] = useState<"original" | "enhanced">("enhanced");

  const resumeRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAnalysis(data);
        setResumeContent(data.resume_text || "");
        setOriginalText(data.resume_text || "");
        setResumeHtml(data.resume_html || "");
      } catch (err: any) {
        toast({ title: "Failed to load", description: err.message, variant: "destructive" });
        navigate("/resumes");
      } finally { setLoading(false); }
    })();
  }, [id]);

  const handleSelection = () => {
    const sel = window.getSelection()?.toString().trim();
    if (sel && sel.length > 10) {
      setSelectedText(sel);
    } else {
      setSelectedText("");
    }
  };

  const handleTailorClick = () => {
    if (!selectedText) {
      toast({ title: "Select text first", description: "Highlight text in the resume to tailor it.", variant: "destructive" });
      return;
    }
    setShowTailorModal(true);
    setTailoredText("");
  };

  const runTailor = async () => {
    if (!jdForTailor.trim()) {
      toast({ title: "Add a job description", description: "Paste a job description to tailor the text.", variant: "destructive" });
      return;
    }
    try {
      setTailoring(true);
      const res = await fetch(`${API}/api/resume/tailor-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ originalText: selectedText, jobDescription: jdForTailor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTailoredText(data.tailoredText);
    } catch (err: any) {
      toast({ title: "Failed to tailor", description: err.message, variant: "destructive" });
    } finally { setTailoring(false); }
  };

  const acceptTailored = async () => {
    if (!analysis) return;
    
    // In HTML mode, doing a pure string replace on innerHTML is safer
    let newText = resumeContent;
    let newHtml = resumeHtml;
    
    if (textRef.current) {
      // First update the text node visually via textRef replacement
      const tempHTML = textRef.current.innerHTML;
      if (tempHTML.includes(selectedText)) {
        newHtml = tempHTML.replace(selectedText, tailoredText);
        textRef.current.innerHTML = newHtml;
      }
      newText = textRef.current.innerText || resumeContent.replace(selectedText, tailoredText);
    } else {
      newText = resumeContent.replace(selectedText, tailoredText);
      newHtml = resumeHtml.replace(selectedText, tailoredText);
    }
    
    setResumeContent(newText);
    setResumeHtml(newHtml);
    setOriginalText(newText);
    setShowTailorModal(false);
    setSelectedText("");
    setTailoredText("");
    setJdForTailor("");
    
    // Save to backend automatically
    try {
      await fetch(`${API}/api/resume/${analysis._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resume_text: newText, resume_html: newHtml })
      });
      toast({ title: "✅ Text replaced and saved successfully!" });
    } catch (err: any) {
      toast({ title: "Failed to save edits", description: err.message, variant: "destructive" });
    }
  };

  const scorePercent = analysis?.overall_score || 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f8f6]">
      <div className="w-10 h-10 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="font-[Inter,sans-serif] text-slate-900 flex flex-col h-screen overflow-hidden bg-[#f6f8f6]">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <Navbar />

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-[2] flex flex-col min-w-0 border-r border-[#e7f3eb] bg-[#f6f8f6] relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-[#e7f3eb]">
            <h3 className="font-bold text-[#0e1b12]">Resume Content</h3>
            <div className="flex items-center bg-[#ecf6ef] rounded-lg p-2 shadow-sm text-xs text-[#294238]">
              <MI name="auto_awesome" className="text-sm mr-1 text-[#17e85d]" />
              <span>Highlight text to tailor with AI</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="w-8 h-8 border-4 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 relative bg-gray-200 overflow-y-auto p-4 flex items-start justify-center shadow-inner">
              <div className="relative w-full max-w-[850px] min-h-[1056px] bg-white shadow-2xl p-12 lg:p-16 my-8">
                
                {/* Highlight action button */}
                {selectedText && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={handleTailorClick} className="flex items-center gap-2 bg-[#17e85d] text-[#112116] px-5 py-2.5 rounded-full shadow-xl hover:scale-105 transition-transform cursor-pointer text-sm font-bold border border-[#14cc52]">
                      <MI name="auto_awesome" /> Tailor Selection
                    </button>
                  </div>
                )}
                
                <div
                  ref={textRef}
                  onMouseUp={handleSelection}
                  onKeyUp={handleSelection}
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: resumeHtml || `<div class="whitespace-pre-wrap">${originalText}</div>` }}
                  className="min-h-full outline-none text-[14.5px] leading-relaxed text-black font-[Inter,sans-serif] selection:bg-[#17e85d]/30 selection:text-[#0e1b12]"
                />
              </div>
            </div>
          )}
        </section>

        {/* Analysis Panel */}
        <div className="w-[400px] shrink-0 bg-white border-l border-[#e7f3eb] flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-[#e7f3eb]">
            <h3 className="font-bold text-lg mb-4">Match Analysis</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#e7f3eb]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-[#17e85d]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${scorePercent}, 100`} strokeLinecap="round" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{scorePercent}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-slate-500">Match Potential</p>
                <span className="text-green-600 font-bold text-sm">ATS Score: {analysis?.ats_score || 0}%</span>
              </div>
            </div>

            {/* Missing keywords */}
            {analysis?.missing_skills?.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Missing Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills.map((s: string) => (
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-semibold">
                      <span className="size-1.5 rounded-full bg-red-500" />{s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="flex-1 overflow-y-auto bg-[#f6f8f6]/50 p-4 space-y-4">
            <div className="flex justify-between items-end mb-2 px-1">
              <h4 className="text-sm font-bold">Optimization Checklist</h4>
              <span className="text-xs text-slate-500">{analysis?.suggestions?.length || 0} items</span>
            </div>
            {analysis?.strengths?.map((s: string, i: number) => (
              <div key={i} className="bg-white border border-[#e7f3eb] rounded-xl p-4 shadow-sm opacity-70">
                <div className="flex items-center gap-2 mb-1">
                  <MI name="check_circle" className="text-green-500 text-lg" />
                  <span className="font-bold text-sm">Strength</span>
                </div>
                <p className="text-sm text-slate-600 leading-snug">{s}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Already strong ✓</p>
              </div>
            ))}
            {analysis?.suggestions?.map((s: string, i: number) => (
              <div key={i} className="group bg-white border border-[#e7f3eb] hover:border-[#17e85d]/50 rounded-xl p-4 shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <MI name="insights" className="text-blue-500 text-lg" />
                  <span className="font-bold text-sm">Suggestion</span>
                </div>
                <p className="text-sm text-slate-600 leading-snug mb-3">{s}</p>
                <button className="w-full py-2 px-3 bg-[#17e85d]/10 hover:bg-[#17e85d]/20 text-[#17e85d] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                  <MI name="auto_fix" className="text-sm" />Apply Suggestion
                </button>
              </div>
            ))}
            {analysis?.weaknesses?.map((w: string, i: number) => (
              <div key={i} className="bg-white border border-[#e7f3eb] hover:border-orange-300 rounded-xl p-4 shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <MI name="warning" className="text-orange-500 text-lg" />
                  <span className="font-bold text-sm">Improvement Area</span>
                </div>
                <p className="text-sm text-slate-600 leading-snug">{w}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#e7f3eb] bg-white">
            <button onClick={handleTailorClick} className="w-full flex items-center justify-center gap-2 h-12 bg-[#17e85d] text-slate-900 rounded-lg font-bold text-base shadow-lg hover:bg-[#0ea841] transition-all hover:-translate-y-0.5">
              <MI name="auto_fix_high" />
              {selectedText ? "Tailor Selected Text with AI" : "Select Text to Tailor"}
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">Highlight any text in resume then click to tailor</p>
          </div>
        </div>
      </main>

      {/* Tailor Modal */}
      {showTailorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTailorModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <MI name="auto_awesome" className="text-[#17e85d] text-2xl" />
              <h3 className="text-xl font-bold">Tailor with AI</h3>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Text</label>
              <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-slate-700 line-clamp-3">{selectedText}</div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
              <textarea
                className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#17e85d]"
                rows={4}
                placeholder="Paste the job description here to tailor the text to this role..."
                value={jdForTailor}
                onChange={e => setJdForTailor(e.target.value)}
              />
            </div>

            {tailoredText && (
              <div className="mb-4">
                <label className="text-xs font-bold text-green-600 uppercase tracking-wider">AI Suggestion</label>
                <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-slate-700">{tailoredText}</div>
              </div>
            )}

            <div className="flex gap-3">
              {!tailoredText ? (
                <>
                  <button onClick={() => setShowTailorModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={runTailor} disabled={tailoring} className="flex-1 py-2.5 bg-[#17e85d] text-black rounded-lg text-sm font-bold hover:bg-[#0ea841] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {tailoring ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Tailoring...</> : <><MI name="auto_awesome" className="text-sm" />Generate Suggestion</>}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setTailoredText("")} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Try Again</button>
                  <button onClick={acceptTailored} className="flex-1 py-2.5 bg-[#17e85d] text-black rounded-lg text-sm font-bold hover:bg-[#0ea841] transition-colors">
                    ✓ Accept & Replace
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
