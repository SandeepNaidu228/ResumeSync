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
      <div className="relative">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full hover:bg-[#e7f3eb] transition-colors"
          title="Go to Master Profile"
        >
          {/* Avatar circle */}
          <div className="w-9 h-9 rounded-full bg-[#17e85d] flex items-center justify-center font-bold text-[#112116] text-sm shrink-0">
            {initials || <MI name="person" className="text-[18px]" />}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-[#0e1b12] max-w-[120px] truncate">{userName}</span>
            <span className="text-[10px] text-[#4d9966] max-w-[120px] truncate">Master Profile Settings</span>
          </div>
        </button>
      </div>
    </header>
  );
}
