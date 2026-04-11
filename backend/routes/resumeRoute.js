import express from "express";
import multer from "multer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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
      const fileName = req.file?.originalname || "pasted-resume.txt";

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

export default router;