import Navbar from "../components/Navbar";

export default function AtsPage() {
  return (
    <div className="bg-[#f6f8f6] font-[Inter,sans-serif] text-[#0e1b12] antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#ecf6ef] border border-[#d6eadd] flex items-center justify-center mb-7">
          <span
            className="material-symbols-outlined text-4xl text-[#17e85d]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            fact_check
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black tracking-tight text-[#0e1b12] mb-3">
          ATS Reality Check
        </h1>
        <p className="text-[#497d65] text-sm max-w-sm leading-relaxed mb-10">
          See exactly how recruiting software scans your resume. Identify parsing
          errors and keyword gaps before they reject you.
        </p>

        {/* CTA */}
        <button
          id="check-ats-btn"
          className="flex items-center gap-2.5 h-12 px-8 bg-[#17e85d] text-[#112116] rounded-xl font-black text-sm shadow-lg hover:brightness-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">terminal</span>
          Check ATS
        </button>

        <p className="mt-5 text-[11px] text-[#89bca1]">Coming soon — connect a resume to run a full scan.</p>
      </main>
    </div>
  );
}
