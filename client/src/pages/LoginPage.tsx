import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/config";
import { GoogleLogin } from "@react-oauth/google";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_name", data.fullName || "");
      localStorage.setItem("user_email", data.email || "");
      localStorage.setItem("profile_completed", String(data.profile_completed || false));
      localStorage.setItem("user", JSON.stringify(data));
      toast({ title: "Login successful 🎉" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google Auth failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_name", data.fullName || "");
      localStorage.setItem("user_email", data.email || "");
      localStorage.setItem("profile_completed", String(data.profile_completed || false));
      localStorage.setItem("user", JSON.stringify(data));
      
      toast({ title: "Securely logged in via Google 🎉" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Google Sign-In failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6f8f6] font-[Inter,sans-serif] text-[#0e1b12]">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="p-1.5 rounded-lg bg-[#17e85d]/20">
          <MI name="smart_toy" className="text-[#17e85d]" />
        </div>
        <span className="text-xl font-bold">ResumeSync</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7f3eb] p-8 relative z-10 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className="text-sm text-[#4d9966]">Sign in to continue analyzing your resumes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Email</label>
            <div className="relative">
              <MI name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
              <input
                type="email"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-[#e7f3eb] focus:outline-none focus:ring-2 focus:ring-[#17e85d]/50 text-sm"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <MI name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
              <input
                type={showPw ? "text" : "password"}
                required
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-[#e7f3eb] focus:outline-none focus:ring-2 focus:ring-[#17e85d]/50 text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPw(!showPw)}
              >
                <MI name={showPw ? "visibility_off" : "visibility"} className="text-[20px]" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-[#17e85d] hover:bg-[#0ea841] text-[#0e1b12] font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="w-5 h-5 border-2 border-[#0e1b12] border-t-transparent rounded-full animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">or login with</span>
          <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast({ title: "Google Login Failed", description: "Could not connect to Google", variant: "destructive" });
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            type="standard"
            text="continue_with"
          />
        </div>

        <p className="text-center text-sm text-[#4d9966] mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#17e85d] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}