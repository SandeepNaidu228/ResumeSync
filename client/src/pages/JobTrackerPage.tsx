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
  Wishlist:  "bg-slate-50 text-slate-700 border-slate-200",
  Applied:   "bg-blue-50 text-blue-700 border-blue-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
  Interview: "bg-purple-50 text-purple-700 border-purple-200",
  Rejected:  "bg-red-50 text-red-600 border-red-200",
  Offer:     "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUSES: Job["status"][] = ["Wishlist", "Applied", "In Review", "Interview", "Rejected", "Offer"];

// ── Helper: open mailto pre-filled ────────────────────────────────────────────
function mailHR(job: Job) {
  const subject = encodeURIComponent(`Application for ${job.role}`);
  const body = encodeURIComponent(
    `Hi,\n\nI'm writing to express my interest in the ${job.role} position at ${job.company}.\n\nJob Description Reference:\n${job.job_description}\n\nPlease find my resume attached.\n\nBest regards`
  );
  window.open(`mailto:${job.hr_email}?subject=${subject}&body=${body}`, "_blank");
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  // Form state
  const [form, setForm] = useState({
    company: "",
    role: "",
    hr_email: "",
    job_description: "",
    status: "Applied" as Job["status"],
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ company: "", role: "", hr_email: "", job_description: "", status: "Applied" });
    setFormError("");
  };

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setFormError("Company and Role are required.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
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
      await fetch(`${API}/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs((prev) => prev.filter((j) => j._id !== id));
      if (detailJob?._id === id) setDetailJob(null);
      toast({ title: "Job removed." });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: Job["status"]) => {
    // Optimistic update
    setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status } : j));
    if (detailJob?._id === id) setDetailJob((prev) => prev ? { ...prev, status } : prev);
    
    // Backend update
    try {
      await fetch(`${API}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="bg-[#f6f8f6] min-h-screen flex flex-col font-[Inter,sans-serif] text-[#0e1b12]">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="border-b border-[#d6eadd] bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0e1b12]">Jobs Applied</h1>
          <p className="text-sm text-[#497d65] mt-0.5">
            Track your applications and mail HRs directly.
          </p>
        </div>
        <button
          id="add-job-btn"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 h-10 px-5 bg-[#17e85d] text-[#112116] rounded-xl font-bold text-sm shadow hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Add Job
        </button>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex flex-1 overflow-hidden">
        {/* Job List */}
        <section className="flex-1 overflow-y-auto p-8">
          {jobs.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[#ecf6ef] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-4xl text-[#639d80]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              </div>
              <h3 className="text-lg font-bold text-[#294238] mb-2">No jobs tracked yet</h3>
              <p className="text-sm text-[#497d65] max-w-xs mb-6 leading-relaxed">
                Click <strong>Add Job</strong> to log your first application. You can also mail the HR directly from here.
              </p>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="px-6 py-3 bg-[#17e85d] text-[#112116] rounded-xl font-bold text-sm shadow hover:brightness-105 transition-all"
              >
                Log my first application
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                    detailJob?._id === job._id ? "border-[#17e85d] ring-1 ring-[#17e85d]/20" : "border-[#d6eadd]"
                  }`}
                  onClick={() => setDetailJob(detailJob?._id === job._id ? null : job)}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Company avatar + info */}
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#ecf6ef] border border-[#d6eadd] flex items-center justify-center font-black text-[#294238] text-lg shrink-0">
                        {job.company[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#0e1b12] text-base group-hover:text-[#17e85d] transition-colors">
                          {job.role}
                        </p>
                        <p className="text-sm text-[#497d65]">{job.company}</p>
                        <p className="text-xs text-[#89bca1] mt-0.5">
                           {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric"}) : ""}
                        </p>
                      </div>
                    </div>

                    {/* Right side: status + actions */}
                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value as Job["status"])}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#17e85d]/30 ${STATUS_STYLES[job.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s === "Wishlist" ? "Want to apply" : s}</option>
                        ))}
                      </select>

                      {job.hr_email && (
                        <button
                          onClick={() => mailHR(job)}
                          title={`Mail ${job.hr_email}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecf6ef] text-[#294238] text-xs font-bold rounded-lg border border-[#d6eadd] hover:bg-[#17e85d] hover:text-[#112116] hover:border-[#17e85d] transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">mail</span>
                          Mail HR
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(job._id)}
                        title="Remove"
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {detailJob?._id === job._id && job.job_description && (
                    <div className="mt-4 pt-4 border-t border-[#ecf6ef]">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#89bca1] mb-2">Job Description</p>
                      <p className="text-sm text-[#497d65] leading-relaxed whitespace-pre-wrap line-clamp-6">
                        {job.job_description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats sidebar */}
        <aside className="w-64 shrink-0 border-l border-[#d6eadd] bg-white p-6 flex flex-col gap-6 hidden md:flex">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#89bca1] mb-4">Overview</p>
            <div className="space-y-3">
              <StatRow label="Wishlist" value={jobs.filter(j => j.status === "Wishlist").length} color="text-slate-500" />
              <StatRow label="Applied" value={jobs.filter(j => j.status === "Applied").length} color="text-blue-500" />
              <StatRow label="In Review" value={jobs.filter(j => j.status === "In Review").length} color="text-amber-500" />
              <StatRow label="Interviews" value={jobs.filter(j => j.status === "Interview").length} color="text-purple-500" />
              <StatRow label="Offers" value={jobs.filter(j => j.status === "Offer").length} color="text-emerald-600" />
              <StatRow label="Rejected" value={jobs.filter(j => j.status === "Rejected").length} color="text-red-400" />
            </div>
          </div>

          <div className="mt-auto p-4 rounded-2xl bg-[#f0fdf4] border border-[#d6eadd]">
            <p className="text-xs font-bold text-[#294238] mb-1">💡 Tip</p>
            <p className="text-[11px] text-[#497d65] leading-relaxed">
              Add the HR's email and job description so you can mail them directly with one click.
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ecf6ef] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#17e85d]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                </div>
                <h2 className="text-lg font-black text-[#0e1b12]">Log Application</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#89bca1] hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company *" id="job-company">
                <input
                  id="job-company"
                  type="text"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  className="input-field"
                />
              </Field>
              <Field label="Role *" id="job-role">
                <input
                  id="job-role"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="input-field"
                />
              </Field>
            </div>

            <Field label="HR Email" id="job-hr-email">
              <input
                id="job-hr-email"
                type="email"
                placeholder="hr@company.com"
                value={form.hr_email}
                onChange={(e) => setForm((p) => ({ ...p, hr_email: e.target.value }))}
                className="input-field"
              />
            </Field>

            <Field label="Did you apply yet?" id="job-status">
              <div className="flex gap-3">
                 <button 
                  type="button" 
                  onClick={() => setForm((p) => ({...p, status: "Wishlist"}))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    form.status === "Wishlist" ? "bg-[#17e85d] text-[#112116] border-[#17e85d]" : "bg-white text-[#497d65] border-[#d6eadd] hover:bg-[#f6f8f6]"
                  }`}
                 >
                   Want to apply
                 </button>
                 <button 
                  type="button" 
                  onClick={() => setForm((p) => ({...p, status: "Applied"}))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    form.status === "Applied" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-white text-[#497d65] border-[#d6eadd] hover:bg-[#f6f8f6]"
                  }`}
                 >
                   Already applied
                 </button>
              </div>
            </Field>

            <Field label="Job Description" id="job-jd">
              <textarea
                id="job-jd"
                rows={5}
                placeholder="Paste the full job description here. It will be included when you mail the HR."
                value={form.job_description}
                onChange={(e) => setForm((p) => ({ ...p, job_description: e.target.value }))}
                className="input-field resize-none"
              />
            </Field>

            {formError && (
              <p className="text-xs text-red-500 font-medium -mt-2">{formError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 border border-[#d6eadd] rounded-xl text-sm font-semibold text-[#497d65] hover:bg-[#f6f8f6] transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-job-btn"
                onClick={handleAdd}
                className="flex-1 h-11 bg-[#17e85d] text-[#112116] rounded-xl text-sm font-black hover:brightness-105 transition-all shadow"
              >
                Save Application
              </button>
            </div>
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
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-[#497d65]">
        {label}
      </label>
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
