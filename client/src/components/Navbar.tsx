import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem("user_name") || "User";
  const userEmail = localStorage.getItem("user_email") || "";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Resumes", path: "/resumes", match: "/resume" },
    { label: "Job Tracker", path: "/job-tracker" },
    { label: "ATS Simulation", path: "/ats" },
  ];

  const isActive = (link: { path: string; match?: string }) => {
    if (location.pathname === link.path) return true;
    if (link.match && location.pathname.startsWith(link.match)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-green-100 bg-[#f6f8f6]/95 backdrop-blur px-6 md:px-10 py-3 shrink-0 w-full">
      {/* Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <MI name="smart_toy" className="text-3xl text-[#17e85d]" />
          <h2 className="text-xl font-bold tracking-tight text-[#0e1b12]">ResumeSync</h2>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "font-bold text-[#0e1b12] border-b-2 border-[#17e85d] pb-0.5"
                    : "text-[#4d9966] hover:text-[#0e1b12]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Avatar */}
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-green-100 transition-colors"
        >
          {/* Avatar circle */}
          <div className="w-9 h-9 rounded-full bg-[#17e85d] flex items-center justify-center font-bold text-[#112116] text-sm shrink-0">
            {initials || <MI name="person" className="text-[18px]" />}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-[#0e1b12] max-w-[120px] truncate">{userName}</span>
            <span className="text-[10px] text-[#4d9966] max-w-[120px] truncate">{userEmail}</span>
          </div>
          <MI name="expand_more" className={`text-[18px] text-[#4d9966] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e7f3eb] overflow-hidden z-50">
            {/* Profile card */}
            <div className="px-4 py-4 bg-gradient-to-br from-[#f0fdf4] to-[#f6f8f6] border-b border-[#e7f3eb]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#17e85d] flex items-center justify-center font-bold text-[#112116] text-lg shrink-0">
                  {initials || "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#0e1b12] truncate">{userName}</p>
                  <p className="text-xs text-[#4d9966] truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="py-1">
              {[
                { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
                { icon: "library_books", label: "My Resumes", path: "/resumes" },
                { icon: "work", label: "Job Tracker", path: "/job-tracker" },
                { icon: "add_circle", label: "Create Resume", path: "/builder" },
              ].map(({ icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => { setOpen(false); navigate(path); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0e1b12] hover:bg-[#f0fdf4] transition-colors text-left"
                >
                  <MI name={icon} className="text-[#4d9966] text-[18px]" />
                  {label}
                </button>
              ))}
            </div>

            {/* Sign out */}
            <div className="border-t border-[#e7f3eb] py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <MI name="logout" className="text-[18px]" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
