import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import Navbar from "../components/Navbar";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Job {
  _id: string;
  company: string;
  role: string;
  hr_email: string;
  job_description: string;
  createdAt?: string;
  status: "Wishlist" | "Applied" | "In Review" | "Interview" | "Rejected" | "Offer";
}

const STATUS_STYLES: Record<Job["status"], string> = {
  Wishlist:    "bg-slate-50 text-slate-700 border-slate-200",
  Applied:     "bg-blue-50 text-blue-700 border-blue-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
  Interview:   "bg-purple-50 text-purple-700 border-purple-200",
  Rejected:    "bg-red-50 text-red-600 border-red-200",
  Offer:       "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const APPLIED_STATUSES: Job["status"][] = ["Applied", "In Review", "Interview", "Rejected", "Offer"];

const MI = ({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>
    {name}
  </span>
);

// ── Render email with highlighted project names ────────────────────────────────
function RenderedEmail({ body }: { body: string }) {
  const parts = body.split(/(<<HIGHLIGHT>>.*?<<END_HIGHLIGHT>>)/g);
  return (
    <p className="text-sm text-[#294238] leading-relaxed whitespace-pre-wrap font-['Inter',sans-serif]">
      {parts.map((part, i) => {
        const match = part.match(/^<<HIGHLIGHT>>(.*?)<<END_HIGHLIGHT>>$/);
        if (match) {
          return (
            <span
              key={i}
              className="bg-[#17e85d]/20 text-[#0a6630] font-bold px-1 rounded border border-[#17e85d]/40"
              title="This project matches the job description!"
            >
              {match[1]}
              <span className="text-[10px] ml-1 opacity-60">✦ relevant</span>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  // Email generation state
  const [emailBody, setEmailBody] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [emailForJob, setEmailForJob] = useState<Job | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Form state
  const [form, setForm] = useState({
    company: "",
    role: "",
    hr_email: "",
    job_description: "",
    status: "Wishlist" as Job["status"],
    applied_status: "Applied" as Job["status"],
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setJobs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ company: "", role: "", hr_email: "", job_description: "", status: "Wishlist", applied_status: "Applied" });
    setFormError("");
  };

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setFormError("Company and Role are required.");
      return;
    }
    const finalStatus = form.status === "Wishlist" ? "Wishlist" : form.applied_status;

    try {
      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, status: finalStatus }),
      });
      if (!res.ok) throw new Error("Failed to add job");
      const newJob = await res.json();
      setJobs((prev) => [newJob, ...prev]);
      resetForm();
      setShowModal(false);
      toast({ title: "Job logged successfully." });
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/api/jobs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setJobs((prev) => prev.filter((j) => j._id !== id));
      if (detailJob?._id === id) setDetailJob(null);
      toast({ title: "Job removed." });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: Job["status"]) => {
    setJobs((prev) => prev.map((j) => (j._id === id ? { ...j, status } : j)));
    if (detailJob?._id === id) setDetailJob((prev) => (prev ? { ...prev, status } : prev));
    try {
      await fetch(`${API}/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  // ── Generate AI email ──────────────────────────────────────────────────────
  const generateEmail = async (job: Job) => {
    setGeneratingEmail(true);
    setEmailBody("");
    setEmailForJob(job);

    try {
      // Fetch the user's profile first
      const profileRes = await fetch(`${API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = profileRes.ok ? await profileRes.json() : {};
      profile.name = localStorage.getItem("user_name") || "";

      const res = await fetch(`${API}/api/resume/generate-outreach-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          jobDescription: job.job_description,
          company: job.company,
          role: job.role,
          profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");
      setEmailBody(data.emailBody || "");
    } catch (err: any) {
      toast({ title: "Email generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingEmail(false);
    }
  };

  // ── Send email via mailto ──────────────────────────────────────────────────
  const sendEmail = (job: Job, body: string) => {
    const cleanBody = body.replace(/<<HIGHLIGHT>>/g, "").replace(/<<END_HIGHLIGHT>>/g, "");
    const subject = encodeURIComponent(`Application for ${job.role} at ${job.company}`);
    const encodedBody = encodeURIComponent(cleanBody);
    window.open(`mailto:${job.hr_email}?subject=${subject}&body=${encodedBody}`, "_blank");
  };

  return (
    <div className="bg-[#f6f8f6] min-h-screen flex flex-col font-[Inter,sans-serif] text-[#0e1b12]">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="border-b border-[#d6eadd] bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Job Tracker</h1>
          <p className="text-sm text-[#497d65] mt-0.5">Track applications and send AI-crafted outreach emails.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 h-10 px-5 bg-[#17e85d] text-[#112116] rounded-xl font-bold text-sm shadow hover:brightness-105 transition-all"
        >
          <MI name="add_circle" className="text-[18px]" />
          Add Job
        </button>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex flex-1 overflow-hidden">
        {/* Job List */}
        <section className="flex-1 overflow-y-auto p-8">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[#ecf6ef] flex items-center justify-center mb-5">
                <MI name="work" className="text-4xl text-[#639d80]" filled />
              </div>
              <h3 className="text-lg font-bold text-[#294238] mb-2">No jobs tracked yet</h3>
              <p className="text-sm text-[#497d65] max-w-xs mb-6 leading-relaxed">
                Log your first application. ResumeSync will help you draft an AI-powered cold email!
              </p>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="px-6 py-3 bg-[#17e85d] text-[#112116] rounded-xl font-bold text-sm shadow hover:brightness-105"
              >
                Log my first application
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {jobs.map((job) => {
                const isOpen = detailJob?._id === job._id;
                const isWishlist = job.status === "Wishlist";

                return (
                  <div
                    key={job._id}
                    className={`bg-white border rounded-2xl shadow-sm transition-all ${
                      isOpen ? "border-[#17e85d] ring-1 ring-[#17e85d]/20" : "border-[#d6eadd] hover:shadow-md"
                    }`}
                  >
                    {/* Card header */}
                    <div
                      className="flex items-start justify-between gap-4 p-5 cursor-pointer"
                      onClick={() => setDetailJob(isOpen ? null : job)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#ecf6ef] border border-[#d6eadd] flex items-center justify-center font-black text-[#294238] text-lg shrink-0">
                          {job.company[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0e1b12] text-base">{job.role}</p>
                          <p className="text-sm text-[#497d65]">{job.company}</p>
                          {job.createdAt && (
                            <p className="text-xs text-[#89bca1] mt-0.5">
                              {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Status selector — always a dropdown so user can change from any status */}
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value as Job["status"])}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#17e85d]/30 ${STATUS_STYLES[job.status]}`}
                        >
                          <option value="Wishlist">Want to Apply</option>
                          {APPLIED_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        {/* Show AI email button only for wishlist jobs with JD */}
                        {isWishlist && job.job_description && (
                          <button
                            onClick={() => generateEmail(job)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17e85d] text-[#112116] text-xs font-bold rounded-lg hover:brightness-105 transition-all shadow-sm"
                            title="Generate AI outreach email"
                          >
                            <MI name="smart_toy" className="text-[15px]" />
                            Draft Email
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(job._id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                        >
                          <MI name="delete" className="text-[16px]" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded: JD + HR Email hint */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[#ecf6ef] pt-4 space-y-3">
                        {job.hr_email && (
                          <p className="text-xs text-[#497d65]">
                            <span className="font-bold">HR Email:</span> {job.hr_email}
                          </p>
                        )}
                        {job.job_description && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#89bca1] mb-1">Job Description</p>
                            <p className="text-sm text-[#497d65] leading-relaxed whitespace-pre-wrap line-clamp-6">
                              {job.job_description}
                            </p>
                          </div>
                        )}
                        {isWishlist && job.job_description && (
                          <button
                            onClick={() => generateEmail(job)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#17e85d]/10 text-[#0a6630] text-xs font-bold rounded-lg border border-[#17e85d]/30 hover:bg-[#17e85d]/20 transition-colors"
                          >
                            <MI name="smart_toy" className="text-[14px]" />
                            Generate AI-crafted cold email using my profile
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Stats sidebar */}
        <aside className="w-64 shrink-0 border-l border-[#d6eadd] bg-white p-6 flex-col gap-6 hidden md:flex">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#89bca1] mb-4">Overview</p>
            <div className="space-y-3">
              <StatRow label="Want to Apply" value={jobs.filter((j) => j.status === "Wishlist").length} color="text-slate-500" />
              <StatRow label="Applied" value={jobs.filter((j) => j.status === "Applied").length} color="text-blue-500" />
              <StatRow label="In Review" value={jobs.filter((j) => j.status === "In Review").length} color="text-amber-500" />
              <StatRow label="Interviews" value={jobs.filter((j) => j.status === "Interview").length} color="text-purple-500" />
              <StatRow label="Offers" value={jobs.filter((j) => j.status === "Offer").length} color="text-emerald-600" />
              <StatRow label="Rejected" value={jobs.filter((j) => j.status === "Rejected").length} color="text-red-400" />
            </div>
          </div>
          <div className="mt-auto p-4 rounded-2xl bg-[#f0fdf4] border border-[#d6eadd]">
            <p className="text-xs font-bold text-[#294238] mb-1">💡 Tip</p>
            <p className="text-[11px] text-[#497d65] leading-relaxed">
              Add jobs you <strong>want to apply</strong> to and click <strong>Draft Email</strong> to get an AI-written cold email tailored to your profile.
            </p>
          </div>
        </aside>
      </main>

      {/* ── ADD JOB MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#d6eadd] w-full max-w-lg p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ecf6ef] flex items-center justify-center">
                  <MI name="work" className="text-[#17e85d]" filled />
                </div>
                <h2 className="text-lg font-black text-[#0e1b12]">Log Application</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#89bca1] hover:text-red-500 transition-colors">
                <MI name="close" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Company *" id="job-company">
                <input id="job-company" type="text" placeholder="e.g. Google" value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} className="input-field" />
              </Field>
              <Field label="Role *" id="job-role">
                <input id="job-role" type="text" placeholder="e.g. Software Engineer" value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="input-field" />
              </Field>
            </div>

            {/* ── Did you apply? toggle ── */}
            <Field label="Did you apply yet?" id="job-status">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: "Wishlist" }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    form.status === "Wishlist"
                      ? "bg-[#17e85d] text-[#112116] border-[#17e85d]"
                      : "bg-white text-[#497d65] border-[#d6eadd] hover:bg-[#f6f8f6]"
                  }`}
                >
                  Want to Apply
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: "Applied" }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    form.status !== "Wishlist"
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-white text-[#497d65] border-[#d6eadd] hover:bg-[#f6f8f6]"
                  }`}
                >
                  Already Applied
                </button>
              </div>
            </Field>

            {/* ── Conditional fields ── */}
            {form.status === "Wishlist" ? (
              // Want to Apply → ask for HR email only
              <Field label="HR Email (to send outreach)" id="job-hr-email">
                <input id="job-hr-email" type="email" placeholder="hr@company.com" value={form.hr_email}
                  onChange={(e) => setForm((p) => ({ ...p, hr_email: e.target.value }))} className="input-field" />
              </Field>
            ) : (
              // Already Applied → ask for current status
              <Field label="Current Application Status" id="job-applied-status">
                <select
                  id="job-applied-status"
                  value={form.applied_status}
                  onChange={(e) => setForm((p) => ({ ...p, applied_status: e.target.value as Job["status"] }))}
                  className="input-field"
                >
                  {APPLIED_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            )}

            <Field label="Job Description (required for AI email)" id="job-jd">
              <textarea id="job-jd" rows={5} placeholder="Paste the full job description here..."
                value={form.job_description}
                onChange={(e) => setForm((p) => ({ ...p, job_description: e.target.value }))}
                className="input-field resize-none" />
            </Field>

            {formError && <p className="text-xs text-red-500 font-medium -mt-2">{formError}</p>}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 border border-[#d6eadd] rounded-xl text-sm font-semibold text-[#497d65] hover:bg-[#f6f8f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 h-11 bg-[#17e85d] text-[#112116] rounded-xl text-sm font-black hover:brightness-105 transition-all shadow"
              >
                Save Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI EMAIL MODAL ── */}
      {(generatingEmail || emailBody) && emailForJob && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setEmailBody(""); setEmailForJob(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#d6eadd] w-full max-w-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecf6ef] flex items-center justify-center">
                  <MI name="smart_toy" className="text-[#17e85d] text-[22px]" filled />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0e1b12]">AI Outreach Email</h2>
                  <p className="text-xs text-[#497d65]">{emailForJob.role} @ {emailForJob.company}</p>
                </div>
              </div>
              <button
                onClick={() => { setEmailBody(""); setEmailForJob(null); }}
                className="text-[#89bca1] hover:text-red-500 transition-colors"
              >
                <MI name="close" />
              </button>
            </div>

            {generatingEmail ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-8 h-8 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#497d65] font-medium">Crafting a personalized email using your profile...</p>
              </div>
            ) : (
              <>
                {/* Legend */}
                <div className="flex items-center gap-2 text-xs bg-[#f0fdf4] border border-[#d6eadd] rounded-lg px-3 py-2">
                  <span className="inline-block w-3 h-3 bg-[#17e85d]/20 border border-[#17e85d]/40 rounded" />
                  <span className="text-[#497d65]">
                    <strong className="text-[#0a6630]">Highlighted</strong> = your project that aligns with this job description
                  </span>
                </div>

                {/* Email Body */}
                <div className="bg-[#f9fdfb] border border-[#d6eadd] rounded-xl p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#89bca1] mb-3">
                    TO: {emailForJob.hr_email || "(no HR email saved)"}
                  </p>
                  <RenderedEmail body={emailBody} />
                </div>

                {/* Edit box */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#497d65] mb-2">Edit before sending</p>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={10}
                    className="w-full text-sm bg-[#f6f8f6] border border-[#d6eadd] rounded-xl px-4 py-3 text-[#0e1b12] outline-none focus:border-[#17e85d] focus:ring-1 focus:ring-[#17e85d] resize-none font-['Inter',sans-serif] leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => generateEmail(emailForJob)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[#d6eadd] text-[#497d65] text-sm font-bold rounded-xl hover:bg-[#f6f8f6] transition-colors"
                  >
                    <MI name="refresh" className="text-[16px]" />
                    Regenerate
                  </button>
                  {emailForJob.hr_email ? (
                    <button
                      onClick={() => {
                        setSendingEmail(true);
                        sendEmail(emailForJob, emailBody);
                        setTimeout(() => setSendingEmail(false), 1500);
                      }}
                      disabled={sendingEmail}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#17e85d] text-[#112116] text-sm font-black rounded-xl hover:brightness-105 transition-all shadow-md disabled:opacity-60"
                    >
                      <MI name="send" className="text-[16px]" />
                      {sendingEmail ? "Opening mail client..." : `Send to ${emailForJob.hr_email}`}
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 text-sm rounded-xl border border-amber-200">
                      <MI name="warning" className="text-[16px]" />
                      Save an HR email to this job to enable one-click send.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.55rem 0.85rem;
          border-radius: 0.6rem;
          border: 1px solid #d6eadd;
          background: #f6f8f6;
          font-size: 0.85rem;
          color: #0e1b12;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: Inter, sans-serif;
        }
        .input-field:focus {
          border-color: #17e85d;
          box-shadow: 0 0 0 3px rgba(23,232,93,0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-[#497d65]">{label}</label>
      {children}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#497d65]">{label}</span>
      <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
  );
}
