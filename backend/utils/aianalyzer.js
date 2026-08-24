import OpenAI from "openai";

// ─── Groq Key Rotation ────────────────────────────────────────────────────────
let currentGroqKeyIndex = 0;

function getGroqKeys() {
  return [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter((k) => k && k.trim() !== "");
}

export const analyzeResumeWithAI = async (resumeText, jobRole) => {
  const keys = getGroqKeys();

  if (keys.length === 0) {
    console.log("⚠️ No Groq API keys found. Returning mock data.");
    return {
      overall_score: 75,
      ats_score: 70,
      skills_score: 80,
      experience_score: 65,
      education_score: 85,
      strengths: ["Good technical foundation"],
      weaknesses: ["Needs more measurable achievements"],
      suggestions: [
        "Add quantified results",
        "Improve formatting consistency",
        "Include more relevant keywords",
      ],
      skills_found: ["React", "Node.js"],
      missing_skills: ["Docker", "CI/CD"],
      resume_html: `<div class="p-8"><h1 class="text-3xl font-bold mb-4">Sample Resume</h1><p>Mock data generated because no API key was found.</p></div>`,
    };
  }

  const currentYear = new Date().getFullYear();

  const prompt = `
You are an expert ATS resume analyzer for fresher-level candidates.

Assume the current year is ${currentYear}.
Do NOT treat dates up to ${currentYear} as future dates.
If a date represents expected graduation or ongoing education, do not flag it as an error.
Only flag years beyond ${currentYear} as future dates.

Resume Text:
${resumeText}

Return ONLY valid JSON in this format:

{
  "overall_score": number,
  "ats_score": number,
  "skills_score": number,
  "experience_score": number,
  "education_score": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "skills_found": [],
  "missing_skills": [],
  "converted_latex": "string (The resume text cleanly converted into a professional LaTeX document structure using standard \\\\documentclass{article}, \\\\begin{document}, \\\\section{}, etc. Make it fully structured. Escape backslashes properly for JSON string.)",
  "resume_html": "string (A fully structured, elegant, semantic HTML representation of the resume. Wrap it in a div. Use Tailwind CSS classes for beautiful, professional styling: e.g. text-3xl font-bold for name, flexbox for dates aligned right, borders for section dividers, lists for bullet points. Make it look like a real printed PDF resume inside a web page. DO NOT USE MARKDOWN. Just return the raw escaped HTML string inside the JSON.)"
}
`;

  let lastError = null;

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const keyToUse = keys[currentGroqKeyIndex];
    try {
      const client = new OpenAI({
        apiKey: keyToUse,
        baseURL: "https://api.groq.com/openai/v1",
      });

      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });

      const text = response.choices[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("Groq returned empty response");
      }

      const clean = text.replace(/```json|```/g, "").trim();

      try {
        return JSON.parse(clean);
      } catch (err) {
        console.error("JSON Parse Error:", clean);
        throw new Error("AI returned invalid JSON format");
      }
    } catch (err) {
      lastError = err.message || JSON.stringify(err);
      console.warn(
        `Groq key index ${currentGroqKeyIndex} failed: ${lastError}. Trying next...`
      );
      currentGroqKeyIndex = (currentGroqKeyIndex + 1) % keys.length;
    }
  }

  throw new Error(`All Groq keys failed: ${lastError}`);
};