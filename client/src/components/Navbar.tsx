import { Link, useLocation, useNavigate } from "react-router-dom";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Resumes", path: "/resumes", match: "/resume" }, // Matches /resumes and /resume/:id
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
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <MI name="smart_toy" className="text-3xl text-[#17e85d]" />
          <h2 className="text-xl font-bold leading-tight tracking-tight text-[#0e1b12]">ResumeSync</h2>
        </div>
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "font-bold text-[#0e1b12] border-b-2 border-[#17e85d] pb-0.5"
                    : "text-[#4d9966] hover:text-[#17e85d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative flex items-center justify-center size-9 rounded-full hover:bg-green-100 text-[#4d9966] transition-colors">
          <MI name="notifications" className="text-[20px]" />
          <span className="absolute top-2 right-2 size-2 bg-[#17e85d] rounded-full" />
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-medium text-[#4d9966] hover:text-red-500 transition-colors"
          title="Sign Out"
        >
          <MI name="logout" className="text-xl" />
        </button>
        <div className="size-9 rounded-full bg-[#17e85d]/30 flex items-center justify-center font-bold text-[#0ea841] text-sm">
          U
        </div>
      </div>
    </header>
  );
}
