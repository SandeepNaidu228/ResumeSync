import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fcf9] text-[#0e1b12] font-[Inter,sans-serif] antialiased selection:bg-[#17e85d] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e7f3eb] bg-[#f8fcf9]/80 backdrop-blur-md">
        <div className="px-6 md:px-10 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[#17e85d] text-3xl">smart_toy</span>
            <h2 className="text-xl font-bold leading-tight tracking-tight">ResumeSync</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-[#17e85d] transition-colors" href="#">Features</a>
            <a className="text-sm font-medium hover:text-[#17e85d] transition-colors" href="#">How it Works</a>
            <a className="text-sm font-medium hover:text-[#17e85d] transition-colors" href="#">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium hover:text-[#17e85d] transition-colors">Login</Link>
            <Link to="/signup" className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#17e85d] hover:bg-[#0ea841] transition-colors text-black text-sm font-bold shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero */}
        <section className="w-full px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17e85d]/10 border border-[#17e85d]/20 w-fit">
                <span className="material-symbols-outlined text-[#17e85d] text-sm">bolt</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#0ea841]">New: ATS 2.0 Engine</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Sync Your Skills to Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17e85d] to-green-600">Dream Job</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Our AI-powered platform optimizes your resume to beat ATS scanners and aligns your skills with top-tier opportunities automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link to="/signup" className="h-12 px-8 rounded-lg bg-[#17e85d] hover:bg-[#0ea841] transition-all text-black text-base font-bold shadow-lg shadow-[#17e85d]/20 hover:shadow-[#17e85d]/40 flex items-center justify-center gap-2">
                  <span>Get Started for Free</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button className="h-12 px-8 rounded-lg border border-gray-200 hover:border-[#17e85d]/50 bg-white hover:bg-gray-50 transition-all text-[#0e1b12] text-base font-medium flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-gray-500">play_circle</span>
                  <span>Watch Demo</span>
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" style={{background: `hsl(${i*40+100},60%,70%)`}} />
                  ))}
                </div>
                <p>Trusted by 10,000+ job seekers</p>
              </div>
            </div>

            {/* Score Card */}
            <div className="relative w-full aspect-[4/3] lg:aspect-square bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-[#17e85d]/20 p-4 md:p-8 flex flex-col justify-center shadow-2xl">
              <div className="absolute -top-6 -right-6 md:top-8 md:-right-8 bg-white p-5 rounded-xl shadow-xl border border-gray-100 z-20" style={{animation:"bounce 3s infinite"}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-100">
                    <span className="material-symbols-outlined text-[#17e85d] text-xl">check_circle</span>
                  </div>
                  <p className="text-xs font-semibold uppercase text-gray-500">Resumes Optimized Today</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">1,248</span>
                  <span className="text-sm font-medium text-[#17e85d] mb-1 flex items-center">
                    <span className="material-symbols-outlined text-sm">trending_up</span>+12%
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="border-b border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs font-mono text-gray-400">resume_analysis_v4.pdf</div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#17e85d]">analytics</span>
                      Optimization Score
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Original Resume</span>
                          <span className="font-bold text-gray-400">35/100</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 w-[35%] rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-900 font-medium">After "ResumeSync" AI</span>
                          <span className="font-bold text-[#17e85d]">92/100</span>
                        </div>
                        <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-[#17e85d] w-[92%] rounded-full shadow-[0_0_15px_rgba(23,232,93,0.5)]" />
                        </div>
                        <p className="text-xs text-[#17e85d] mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">auto_awesome</span>
                          ATS Keywords Matched: 98%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                      <span className="material-symbols-outlined text-gray-400 mb-1">visibility_off</span>
                      <p className="text-[10px] uppercase font-bold text-gray-500">Readable</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center border border-[#17e85d]/20">
                      <span className="material-symbols-outlined text-[#17e85d] mb-1">check_circle</span>
                      <p className="text-[10px] uppercase font-bold text-[#17e85d]">Keywords</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center border border-[#17e85d]/20">
                      <span className="material-symbols-outlined text-[#17e85d] mb-1">format_align_left</span>
                      <p className="text-[10px] uppercase font-bold text-[#17e85d]">Format</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-20 px-6 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to get hired</h2>
              <p className="text-gray-500">Stop guessing what recruiters want. Our AI suite provides the intelligence you need to stand out.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon:"psychology", color:"blue", bg:"bg-blue-100", iconColor:"text-blue-600", title:"Semantic Analysis", desc:"Our AI understands context, not just keywords. We ensure your experience translates perfectly to job descriptions." },
                { icon:"policy", color:"green", bg:"bg-[#17e85d]/20", iconColor:"text-[#0ea841]", title:"ATS Ghost Scanner", desc:"See your resume exactly how an ATS sees it. Identify parsing errors before you hit send." },
                { icon:"map", color:"purple", bg:"bg-purple-100", iconColor:"text-purple-600", title:"Learning Roadmaps", desc:"Missing a skill? We generate a custom learning path to bridge the gap between your current resume and your dream role." },
              ].map(f => (
                <div key={f.title} className="group p-8 rounded-2xl bg-[#f8fcf9] border border-transparent hover:border-[#17e85d]/30 hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined ${f.iconColor} text-3xl`}>{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="w-full py-12 border-b border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Works with all major platforms</p>
          </div>
          <div className="relative flex w-full overflow-hidden">
            <div className="flex whitespace-nowrap gap-16 items-center" style={{animation:"marquee 20s linear infinite"}}>
              {["LinkedIn","Indeed","Glassdoor","Monster","ZipRecruiter","LinkedIn","Indeed","Glassdoor","Monster","ZipRecruiter"].map((s,i)=>(
                <span key={i} className="text-2xl font-bold text-gray-300 flex items-center gap-2">
                  <span className="material-symbols-outlined">work</span> {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 px-6">
          <div className="max-w-4xl mx-auto bg-[#1a2e20] rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(#17e85d 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
            <div className="relative z-10 px-8 py-16 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to land the offer?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">Join thousands of professionals who have already optimized their career path with ResumeSync.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#17e85d] hover:bg-white hover:text-black transition-all text-black text-lg font-bold shadow-lg">
                  Get Started for Free
                </Link>
                <span className="text-gray-400 text-sm">No credit card required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-6 border-t border-gray-200 bg-[#f8fcf9]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#17e85d]">smart_toy</span>
            <span className="font-bold text-lg">ResumeSync</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a className="hover:text-[#17e85d] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#17e85d] transition-colors" href="#">Terms</a>
            <a className="hover:text-[#17e85d] transition-colors" href="#">Contact</a>
          </div>
          <div className="text-sm text-gray-400">© 2026 ResumeSync Inc.</div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes bounce { 0%,100%{transform:translateY(-5%)} 50%{transform:translateY(0)} }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; }
      `}</style>
    </div>
  );
}
