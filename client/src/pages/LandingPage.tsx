import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-green-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hero-glow { background: radial-gradient(circle at 50% 50%, rgba(23,232,93,0.08) 0%, rgba(255,255,255,0) 70%); }
        .glass-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border: 1px solid rgba(226,232,240,1); }
        @keyframes pulse-bar { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .animate-pulse-bar { animation: pulse-bar 2s ease-in-out infinite; }
      `}</style>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#17e85d] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">ResumeSync</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a className="hover:text-[#17e85d] transition-colors" href="#features">Features</a>
            <a className="hover:text-[#17e85d] transition-colors" href="#how-it-works">How it Works</a>
            <a className="hover:text-[#17e85d] transition-colors" href="#cta">Pricing</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link className="text-sm font-bold text-slate-900 hover:text-[#17e85d] transition-colors" to="/login">Login</Link>
            <Link className="bg-[#17e85d] hover:bg-[#14cc52] text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold transition-all" to="/signup">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* ── HERO ── */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-white hero-glow">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[10px] font-black text-[#14cc52] uppercase tracking-widest">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                New: ATS 2.0 Engine
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
                Finding a job is{" "}
                <span className="text-[#17e85d]">Hard.</span>
                {/* <br /> */}
                We make it{" "}
                <span className="text-[#17e85d]">Easier.</span>
              </h1>

              <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                Our AI-powered platform optimizes your resume to beat ATS scanners and aligns your skills with top-tier opportunities automatically.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/signup"
                  className="bg-[#17e85d] hover:bg-[#14cc52] text-slate-900 px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-green-200 transition-all flex items-center gap-2"
                >
                  Get Started for Free <span>→</span>
                </Link>
                <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {["hsl(140,60%,70%)", "hsl(180,60%,70%)", "hsl(220,60%,70%)"].map((bg, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: bg }} />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400">Trusted by many job seekers</p>
              </div>
            </div>

            {/* Right — Score Card */}
            <div className="relative">
              <div className="bg-green-100 absolute inset-0 blur-[100px] rounded-full scale-110 opacity-60" />
              <div className="glass-card p-10 rounded-[40px] shadow-2xl relative z-10">
                <div className="flex gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-[#17e85d]" />
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-[#17e85d]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Optimization Score</h3>
                </div>

                <div className="space-y-10">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>Original Resume</span><span>35/100</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-900 uppercase tracking-wider">
                      <span>After "ResumeSync" AI</span>
                      <span className="text-[#14cc52]">92/100</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="h-full bg-[#17e85d] rounded-full" style={{ width: "92%" }} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-bar" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#14cc52] uppercase">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                      ATS Keywords Matched: 98%
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    {[
                      { label: "Readable", active: false, icon: <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /> },
                      { label: "Keywords", active: true, icon: <path d="M5 13l4 4L19 7" /> },
                      { label: "Format", active: false, icon: <path d="M4 6h16M4 12h16M4 18h7" /> },
                    ].map(({ label, active, icon }) => (
                      <div key={label} className={`flex flex-col items-center gap-2 ${!active ? "opacity-30 grayscale" : ""}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? "bg-green-50 ring-2 ring-green-200 text-[#14cc52]" : "bg-slate-50 text-slate-400"}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${active ? "text-[#14cc52]" : ""}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-6 -right-10 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-[#17e85d]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resumes Optimized Today</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">1,248</span>
                    <span className="text-[#14cc52] font-bold text-xs pb-1">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ── */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                Finding a job is <span className="text-slate-300">Hard.</span><br />
                We make it <span className="text-[#17e85d]">easier.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">Traditional job searching is broken. We fixed the process so you can focus on the interview.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "The Manual Edit Loop", desc: "Waste hours shuffling bullet points for every single application only to see the job posting expire before you hit send." },
                { num: "02", title: "The Silent Rejection", desc: "One tiny formatting glitch or missing keyword guarantees the trash pile. You will never even know why you didn't get a call." },
                { num: "03", title: "The ATS Black Hole", desc: "Blindly guessing keywords against an algorithm that is literally programmed to find reasons to reject you." },
              ].map(({ num, title, desc }) => (
                <div key={num} className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-xl rounded-2xl mb-8">{num}</div>
                  <h3 className="text-xl font-black mb-4 text-slate-900 tracking-tight">{title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVOLUTION SECTION ── */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                  From Manual To<br />
                  <span className="text-[#17e85d]">Seamless Automation</span>
                </h2>
                <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                  Stop the guesswork. ResumeSync acts as your personal recruitment agent, ensuring every word you submit is perfectly tuned.
                </p>
                <ul className="space-y-5">
                  {["Instant ATS Match Analysis", "AI-Generated Skill Alignment", "Professional PDF/DocX Export"].map(item => (
                    <li key={item} className="flex items-center gap-4 text-slate-900 font-bold">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[#17e85d]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 shadow-inner">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Before</div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 opacity-50 grayscale shadow-sm">
                      <div className="h-2.5 w-3/4 bg-slate-200 rounded mb-4" />
                      <div className="h-2 w-full bg-slate-100 rounded mb-2.5" />
                      <div className="h-2 w-5/6 bg-slate-100 rounded mb-2.5" />
                      <div className="h-2 w-full bg-slate-100 rounded mb-2.5" />
                      <div className="mt-6 flex justify-between items-center">
                        <div className="h-4 w-10 bg-red-50 rounded" />
                        <span className="text-[9px] text-red-500 font-black italic uppercase">Missing Skills</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase text-[#17e85d] tracking-widest">After</div>
                    <div className="bg-white p-6 rounded-3xl border-2 border-[#17e85d] shadow-2xl shadow-green-100">
                      <div className="h-2.5 w-3/4 bg-slate-900 rounded mb-4" />
                      <div className="h-2 w-full bg-slate-100 rounded mb-2.5" />
                      <div className="h-2 w-5/6 bg-green-200 rounded mb-2.5" />
                      <div className="h-2 w-full bg-slate-100 rounded mb-2.5" />
                      <div className="mt-6 flex justify-between items-center">
                        <div className="h-4 w-10 bg-green-100 rounded" />
                        <span className="text-[9px] text-[#17e85d] font-black uppercase">Optimized ✨</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 bg-white p-5 rounded-2xl flex items-center justify-between border border-slate-200 shadow-sm">
                  <span className="text-sm font-black text-slate-900">Sync complete</span>
                  <span className="text-sm font-black text-[#14cc52]">+42% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black mb-6 tracking-tight">Core Features</h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-medium">Everything you need to navigate the modern job market with confidence and precision.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-[32px] overflow-hidden">
              {[
                {
                  title: "AI-Powered Analysis",
                  desc: "We find the fine print requirements you missed while scanning, ensuring your application is always relevant.",
                  icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
                },
                {
                  title: "Keyword Wizardry",
                  desc: "We identify the exact technical terms the algorithm wants. Feed the bot what it needs to stay at the top.",
                  icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
                },
                {
                  title: "Score Everything",
                  desc: "Our scoring engine doesn't lie. If your match rate is low, we tell you exactly how to fix it before you hit send.",
                  icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />,
                },
                {
                  title: "Open Source, Baby",
                  desc: "Transparent, collaborative, and free for individual use. We're building the future of hiring together.",
                  icon: <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
                },
              ].map(({ title, desc, icon }) => (
                <div key={title} className="bg-slate-900 p-12 hover:bg-slate-800/50 transition-colors">
                  <div className="text-[#17e85d] mb-8">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section id="cta" className="py-32 bg-[#17e85d] text-slate-900">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter">Ready to sync?</h2>
            <p className="text-xl font-bold mb-12 opacity-70 max-w-2xl mx-auto">
              Join 10,000+ job seekers already using ResumeSync to beat the odds and land the offer.
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link
                to="/signup"
                className="bg-slate-900 text-white px-12 py-6 rounded-2xl text-2xl font-black shadow-2xl hover:scale-105 transition-all"
              >
                Get Started For Free
              </Link>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">No credit card required</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-1 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#17e85d] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight">ResumeSync</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                The modern standard for resume optimization and job tracking. Open source and built for seekers.
              </p>
            </div>

            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><Link className="hover:text-[#17e85d]" to="/dashboard">Dashboard</Link></li>
                <li><Link className="hover:text-[#17e85d]" to="/resumes">ATS Simulator</Link></li>
                <li><Link className="hover:text-[#17e85d]" to="/job-tracker">Job Tracker</Link></li>
                <li><a className="hover:text-[#17e85d]" href="#cta">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><a className="hover:text-[#17e85d]" href="#">Documentation</a></li>
                <li><a className="hover:text-[#17e85d]" href="https://github.com/SandeepNaidu228/ResumeSync" target="_blank" rel="noreferrer">GitHub Repository</a></li>
                <li><a className="hover:text-[#17e85d]" href="#">Community Forum</a></li>
                <li><a className="hover:text-[#17e85d]" href="#">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-bold">
                <li><a className="hover:text-[#17e85d]" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-[#17e85d]" href="#">Terms of Service</a></li>
                <li><a className="hover:text-[#17e85d]" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <p>© 2026 ResumeSync. Built for candidates everywhere.</p>
            <div className="flex items-center gap-8">
              <a className="hover:text-slate-900 transition-colors" href="#">LinkedIn</a>
              <a className="hover:text-slate-900 transition-colors" href="#">Twitter</a>
              <a className="hover:text-slate-900 transition-colors" href="https://github.com/SandeepNaidu228/ResumeSync" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
