import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/config";
import { GoogleLogin } from "@react-oauth/google";

const MI = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      toast({ title: "Account created! 🎉", description: "You can now login with your credentials." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
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
      if (!res.ok) throw new Error(data.error || "Google Signup failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_name", data.fullName || "");
      localStorage.setItem("user_email", data.email || "");
      localStorage.setItem("profile_completed", String(data.profile_completed || false));
      localStorage.setItem("user", JSON.stringify(data));
      
      toast({ title: "Account successfully created via Google 🎉" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Google Auth failed", description: err.message, variant: "destructive" });
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7f3eb] p-8 relative z-10 my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-sm text-[#4d9966]">Start optimizing your resume with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <MI name="person" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
              <input
                type="text"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-[#e7f3eb] focus:outline-none focus:ring-2 focus:ring-[#17e85d]/50 text-sm"
                placeholder="John Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
          </div>

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
                minLength={6}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-[#e7f3eb] focus:outline-none focus:ring-2 focus:ring-[#17e85d]/50 text-sm"
                placeholder="Min 6 characters"
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

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Confirm Password</label>
            <div className="relative">
              <MI name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
              <input
                type="password"
                required
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-[#e7f3eb] focus:outline-none focus:ring-2 focus:ring-[#17e85d]/50 text-sm"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-6 bg-[#17e85d] hover:bg-[#0ea841] text-[#0e1b12] font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="w-5 h-5 border-2 border-[#0e1b12] border-t-transparent rounded-full animate-spin" /> Creating Account...</> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">or signup with</span>
          <span className="w-1/5 border-b border-gray-200 lg:w-1/4"></span>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast({ title: "Google Signup Failed", description: "Could not connect to Google", variant: "destructive" });
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            type="standard"
            text="signup_with"
          />
        </div>

        <p className="text-center text-sm text-[#4d9966] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#17e85d] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}