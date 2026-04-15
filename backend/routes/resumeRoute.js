import express from "express";
import multer from "multer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import OpenAI from "openai";

import { analyzeResume } from "../controllers/resumecontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import ResumeAnalysis from "../models/Resumeanalysis.js";

const router = express.Router();

// ✅ Multer (memory storage)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post(
  "/analyze",
  protect,
  upload.single("resumeFile"),
  async (req, res) => {
    try {
      let resumeText = req.body.resumeText;
      const jobRole = req.body.jobRole;
      const fileName = req.file?.originalname || req.body.fileName || "pasted-resume.txt";

      // ✅ If PDF uploaded → extract text properly
      if (req.file) {
        // 🔥 Convert Buffer → Uint8Array (IMPORTANT FIX)
        const uint8Array = new Uint8Array(req.file.buffer);

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();

          const pageText = content.items
            .map((item) => item.str)
            .join(" ");

          extractedText += pageText + " ";
        }

        resumeText = extractedText;
      }

      // ✅ Validation
      if (!resumeText || resumeText.trim().length < 50) {
        return res.status(400).json({
          error: "Resume text not readable or too short",
        });
      }

      // ✅ Send to controller with optional pdf_data
      const analysis = await analyzeResume(
        resumeText,
        jobRole,
        req.user.id,
        fileName
      );

      // ✅ Store PDF buffer
      if (req.file && analysis && analysis._id) {
        await ResumeAnalysis.findByIdAndUpdate(analysis._id, {
          pdf_data: req.file.buffer
        });
      }

      res.status(200).json({ success: true, data: analysis });

    } catch (error) {
      console.log("ANALYZE ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ History
router.get("/history", protect, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({
      user_id: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get specific resume by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    // Omit pdf_data from this regular JSON response to save bandwidth
    const resumeObj = resume.toObject();
    delete resumeObj.pdf_data;
    
    res.json(resumeObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get PDF data by Resume ID
router.get("/pdf/:id", protect, async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!resume || !resume.pdf_data) {
      return res.status(404).json({ error: "PDF not found" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.send(resume.pdf_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Resume by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Resume text manually
router.put("/:id", protect, async (req, res) => {
  try {
    const updateData = {};
    if (req.body.resume_text !== undefined) updateData.resume_text = req.body.resume_text;
    if (req.body.resume_html !== undefined) updateData.resume_html = req.body.resume_html;
    if (req.body.resume_data !== undefined) updateData.resume_data = req.body.resume_data;
    if (req.body.file_name !== undefined) updateData.file_name = req.body.file_name;

    const updated = await ResumeAnalysis.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      updateData,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json({ success: true, message: "Resume updated", resume: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Tailor text with AI
router.post("/tailor-text", protect, async (req, res) => {
  try {
    const { originalText, jobDescription } = req.body;
    if (!originalText || !jobDescription) {
      return res.status(400).json({ error: "originalText and jobDescription are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      // fallback mock
      return res.json({ tailoredText: `${originalText} (optimized for the role with relevant keywords)` });
    }

    const prompt = `You are an expert resume writer. Rewrite the following resume text to be more tailored, impactful, and optimized for the job description provided. Keep it concise (same length or shorter), professional, and ATS-friendly. Use strong action verbs and quantify where possible.

Resume Text:
"${originalText}"

Job Description:
"${jobDescription}"

Return ONLY the rewritten text, no explanations, no quotes around it.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );

    const data = await response.json();
    const tailoredText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!tailoredText) throw new Error("AI returned no text");

    res.json({ tailoredText });
  } catch (error) {
    console.error("TAILOR ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Compile HTML from raw text
router.post("/compile-html", protect, async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return res.json({ resume_html: `<div class="p-8 text-black">Mock Compiled HTML layout since no API key is provided. <br/><br/> ${resumeText}</div>` });
    }

    const prompt = `You are an expert web developer and UI designer. Take the following raw resume text and compile it into a fully structured, elegant, semantic HTML representation. 
Wrap it in a single <div> container. Use Tailwind CSS classes for beautiful, professional styling: e.g. text-3xl font-bold for the name, flexbox with justify-between for dates, subtle borders for section dividers, and clean lists for bullet points.
Make it look exactly like a premium, printed A4 PDF resume. 
DO NOT USE MARKDOWN BLOCK QUOTES (no \`\`\`html). Return ONLY the raw HTML code string.

Resume Text:
"${resumeText}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 },
        }),
      }
    );

    const data = await response.json();
    let compiledHtml = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!compiledHtml) throw new Error("AI returned no HTML");

    // Clean up markdown markers just in case
    compiledHtml = compiledHtml.replace(/```html|```/g, "").trim();

    res.json({ resume_html: compiledHtml });
  } catch (error) {
    console.error("COMPILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Recommend projects based on Job Description
router.post("/recommend-projects", protect, async (req, res) => {
  try {
    const { jobDescription, masterProjects } = req.body;
    
    if (!jobDescription || !masterProjects || masterProjects.length === 0) {
      return res.status(400).json({ error: "Job description and a non-empty master projects list are required" });
    }

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5
    ].filter(k => k && k.trim() !== "");

    if (keys.length === 0) {
      // Mock if no keys are found
      return res.json({ recommendedProjects: masterProjects.slice(0, 2) });
    }

    const prompt = `You are an expert technical recruiter and resume tailorer. 
I have a list of software projects I have built, and a Target Job Description I want to apply for.

TARGET JOB DESCRIPTION:
"""${jobDescription}"""

MY MASTER PROJECTS REPOSITORY:
${masterProjects.map((p, index) => `[ID: ${index}] Name: ${p.name || "N/A"}\nTech Stack: ${p.tech_stack || "N/A"}\nDescription: ${p.description || "N/A"}\n---`).join("\n")}

Your task is to analyze the Job Description to identify technical requirements, domain relevance, and required skills. Then, scan my Master Projects Repository and select the top 2 to 3 most relevant projects that I should include on my resume for this specific job.

Return ONLY a valid JSON array of the IDs you chose. DO NOT ADD ANY MARKDOWN OR TEXT outside the JSON array.
Example Response:
[0, 2, 5]
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
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1, // low temp for deterministic JSON
          max_tokens: 50, // we only need a tiny array
        });

        let aiText = response.choices[0]?.message?.content?.trim() || "[]";
        
        // Clean up markdown block if the AI ignored instructions
        aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

        let selectedIds = JSON.parse(aiText);
        if (!Array.isArray(selectedIds)) {
            selectedIds = [];
        }

        const recommendedProjects = selectedIds
            .map(id => masterProjects[parseInt(id)])
            .filter(Boolean); // remove any undefined

        return res.json({ recommendedProjects });

      } catch (err) {
        lastError = err.message || JSON.stringify(err);
        console.warn(`Groq key index ${currentGroqKeyIndex} failed: ${lastError}. Trying next...`);
        // Move to next key
        currentGroqKeyIndex = (currentGroqKeyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: "Failed to fetch recommendations from AI", details: lastError });
  } catch (error) {
    console.error("RECOMMEND PROJECTS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Refine Text with Groq AI (with Fallback Rotation)
let currentGroqKeyIndex = 0;

router.post("/refine-text", protect, async (req, res) => {
  try {
    const { text, context, jobDescription, profileContext } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text to refine is required" });
    }

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5
    ].filter(k => k && k.trim() !== "");

    if (keys.length === 0) {
      return res.json({ refinedText: `${text} (Polished by AI)` });
    }

    const promptContext = context  
      ? `This text is for the "${context}" section of a resume.` 
      : `This text is for a professional resume.`;

    const jobDescInstruction = jobDescription && jobDescription.trim().length > 5 
      ? `\nTarget Job Description:\n"${jobDescription}"\n\nYou MUST deeply tailor and optimize the refined text to highlight relevance to this specific job description, focusing on matching required skills, tone, and objectives.`
      : "";

    const userProfileInstruction = profileContext
      ? `\nHere is my background/profile for context:\n${JSON.stringify(profileContext)}\nDO NOT hallucinate skills I do not have in this profile.`
      : "";

    const prompt = `You are an expert resume writer. Refine and professionally rewrite the following text to make it more impactful, concise, and ATS-friendly. ${promptContext}${jobDescInstruction}${userProfileInstruction}
    
    If it is a summary, keep it to 3-4 sentences.
    If it is a bullet point, start with a strong action verb and keep it to 1-2 lines.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT include ANY conversational filler (e.g., "Here is a detailed description", "Or you can use this", "Sure", etc.).
    - DO NOT add bullet points, hyphens (-), or asterisks (*) at the beginning of lines. The UI handles bullet formatting automatically.
    - Return STRICTLY the refined text and nothing else.
    
    Text to refine: 
    "${text}"`;

    let lastError = null;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyToUse = keys[currentGroqKeyIndex];
      try {
        const client = new OpenAI({
          apiKey: keyToUse,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 300,
        });

        let refinedText = response.choices[0]?.message?.content?.trim();
        
        if (refinedText) {
          // Remove wrapping quotes if AI adds them
          if (refinedText.startsWith('"') && refinedText.endsWith('"')) {
            refinedText = refinedText.slice(1, -1).trim();
          }
          return res.json({ refinedText });
        } else {
          throw new Error("AI returned empty response");
        }
      } catch (err) {
        lastError = err.message || JSON.stringify(err);
        console.warn(`Groq key index ${currentGroqKeyIndex} failed: ${lastError}. Trying next...`);
        // Move to next key
        currentGroqKeyIndex = (currentGroqKeyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: `Groq AI Error: ${lastError}`, details: lastError });

  } catch (error) {
    console.error("REFINE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;