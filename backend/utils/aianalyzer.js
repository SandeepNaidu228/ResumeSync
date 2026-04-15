import fetch from "node-fetch";

export const analyzeResumeWithAI = async (resumeText, jobRole) => {

  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️ No AI API key found. Returning mock data.");
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
        "Include more relevant keywords"
      ],
      skills_found: ["React", "Node.js"],
      missing_skills: ["Docker", "CI/CD"],
      resume_html: `<div class="p-8"><h1 class="text-3xl font-bold mb-4">Sample Resume</h1><p>Mock data generated because no API key was found.</p></div>`
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

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini Error:", data);
    throw new Error("Gemini API Error");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Invalid Gemini response:", data);
    throw new Error("Invalid Gemini response");
  }

  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Error:", clean);
    throw new Error("AI returned invalid JSON format");
  }
};