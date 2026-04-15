import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { API } from "@/config";
import Navbar from "../components/Navbar";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function ResumesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/resume/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHistory(data);
    } catch (err: any) {
      toast({ title: "Failed to load", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/api/resume/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Resume deleted" });
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };


  return (
    <div className="bg-[#f6f8f6] font-[Inter,sans-serif] text-[#0e1b12] min-h-screen flex flex-col">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">My Resumes</h1>
            <p className="text-[#4d9966] text-base mt-1">Manage and optimize your resume versions for different roles.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MI name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input className="pl-9 pr-4 py-2 rounded-lg border-none bg-white shadow-sm text-sm focus:ring-1 focus:ring-[#17e85d] w-64 outline-none" placeholder="Search resumes..." />
            </div>
          </div>
        </div>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#17e85d] border-t-transparent rounded-full animate-spin" /></div>
            ) : history.map((item) => (
              <div key={item._id}
                className="group flex flex-col rounded-xl bg-white shadow-sm border border-[#e7f3eb] hover:border-[#17e85d]/40 hover:shadow-md transition-all duration-300 overflow-hidden h-full">

                {/* Thumbnail */}
                <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden border-b border-gray-100">
                  <div className="w-full h-full bg-white p-6 flex flex-col gap-3 transform group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none">
                    <div className="w-1/3 h-2 bg-gray-200 rounded" />
                    <div className="w-1/2 h-4 bg-gray-300 rounded mt-2" />
                    <div className="w-full h-2 bg-gray-100 rounded mt-4" />
                    <div className="w-full h-2 bg-gray-100 rounded" />
                    <div className="w-3/4 h-2 bg-gray-100 rounded" />
                    <div className="w-full h-2 bg-gray-100 rounded mt-4" />
                    <div className="w-full h-2 bg-gray-100 rounded" />
                    <div className="w-5/6 h-2 bg-gray-100 rounded" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold">
                      {item.resume_data ? "BUILDER" : "PDF"}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-[#0e1b12] line-clamp-2 pr-6 leading-tight">{item.file_name || "Resume"}</h3>
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="shrink-0 w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <MI name="delete" className="text-[16px]" />
                    </button>
                  </div>

                  <span className="text-[11px] text-[#4d9966] flex items-center gap-1">
                    <MI name="calendar_today" className="text-[13px]" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  {/* Action buttons */}
                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/builder/${item._id}`)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#17e85d] hover:brightness-105 text-[#112116] text-xs font-bold rounded-lg transition-all"
                    >
                      <MI name="edit" className="text-[15px]" />
                      Edit Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create new */}
            <button onClick={() => navigate("/builder")} className="group flex flex-col items-center justify-center rounded-xl bg-white/50 border-2 border-dashed border-gray-300 hover:border-[#17e85d] hover:bg-green-50/50 transition-all duration-300 min-h-[360px] cursor-pointer">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MI name="add" className="text-3xl text-[#17e85d]" />
              </div>
              <h3 className="text-lg font-bold mb-1">Create New Resume</h3>
              <p className="text-[#4d9966] text-sm text-center px-6">Start building your resume from scratch</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
