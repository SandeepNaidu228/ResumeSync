import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import Navbar from "../components/Navbar";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/resume/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHistory(data);
    } catch (err: any) {
      toast({ title: "Failed to load resumes", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
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
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="bg-[#f6f8f6] text-[#0e1b12] antialiased min-h-screen flex flex-col font-[Inter,sans-serif]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#0e1b12]">Dashboard</h1>
            <p className="text-sm text-[#4d9966] mt-1">Select a resume to edit or view its analysis.</p>
          </div>
          <button
            onClick={() => navigate("/builder")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#17e85d] hover:brightness-105 text-[#112116] text-sm font-bold rounded-xl shadow-sm transition-all"
          >
            <MI name="add" className="text-[18px]" />
            New Resume
          </button>
        </div>

        {/* Resume Library */}
        <section className="bg-white rounded-2xl border border-[#e7f3eb] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e7f3eb] bg-[#f6f8f6]">
            <div className="w-9 h-9 rounded-full bg-[#ecf6ef] flex items-center justify-center">
              <MI name="folder_open" className="text-[#4d9966] text-[20px]" />
            </div>
            <div>
              <h2 className="font-bold text-[#0e1b12]">My Resume Library</h2>
              <p className="text-xs text-[#4d9966]">Click Edit to open the builder, or Analysis to view ATS scores.</p>
            </div>
          </div>

          <div className="divide-y divide-[#f0f7f3]">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-7 h-7 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MI name="description" className="text-5xl text-[#d6eadd] mb-4" />
                <p className="text-[#4d9966] font-medium">No resumes yet</p>
                <p className="text-sm text-[#89bca1] mt-1 mb-5">Create your first resume to get started.</p>
                <button
                  onClick={() => navigate("/builder")}
                  className="px-5 py-2.5 bg-[#17e85d] text-[#112116] text-sm font-bold rounded-xl hover:brightness-105 transition-all"
                >
                  + Create Resume
                </button>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#f6f8f6] transition-colors group"
                >
                  {/* Left: icon + name + date */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#ecf6ef] border border-[#d6eadd] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MI name="description" className="text-[#4d9966] text-[22px]" filled />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0e1b12] truncate max-w-[260px]">
                        {item.file_name || "Untitled Resume"}
                      </p>
                      <p className="text-[11px] text-[#4d9966] mt-0.5 flex items-center gap-1">
                        <MI name="calendar_today" className="text-[12px]" />
                        {new Date(item.createdAt).toLocaleDateString()}
                        {item.resume_data && (
                          <span className="ml-2 bg-[#ecf6ef] text-[#4d9966] text-[10px] px-2 py-0.5 rounded-full font-medium">BUILDER</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => navigate(`/builder/${item._id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#17e85d] hover:brightness-105 text-[#112116] text-xs font-bold rounded-lg transition-all"
                    >
                      <MI name="edit" className="text-[15px]" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <MI name="delete" className="text-[16px]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "library_books", label: "My Resumes", sub: "Full resume gallery", path: "/resumes", color: "bg-[#ecf6ef] text-[#4d9966]" },
            { icon: "work", label: "Job Tracker", sub: "Track applications", path: "/job-tracker", color: "bg-blue-50 text-blue-600" },
            { icon: "verified", label: "ATS Checker", sub: "Upload & analyse", path: "/ats", color: "bg-amber-50 text-amber-600" },
          ].map(({ icon, label, sub, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#e7f3eb] hover:border-[#17e85d]/40 hover:shadow-md transition-all text-left group"
            >
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <MI name={icon} className="text-[22px]" />
              </div>
              <div>
                <p className="font-bold text-[#0e1b12] text-sm">{label}</p>
                <p className="text-xs text-[#4d9966]">{sub}</p>
              </div>
              <MI name="arrow_forward" className="text-[#d6eadd] ml-auto group-hover:text-[#17e85d] transition-colors" />
            </button>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#17e85d]/20 to-transparent pointer-events-none" />
    </div>
  );
}