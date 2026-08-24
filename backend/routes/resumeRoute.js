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

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter((k) => k && k.trim() !== "");

    if (keys.length === 0) {
      return res.json({ tailoredText: `${originalText} (optimized for the role with relevant keywords)` });
    }

    const prompt = `You are an expert resume writer. Rewrite the following resume text to be more tailored, impactful, and optimized for the job description provided. Keep it concise (same length or shorter), professional, and ATS-friendly. Use strong action verbs and quantify where possible.

Resume Text:
"${originalText}"

Job Description:
"${jobDescription}"

Return ONLY the rewritten text, no explanations, no quotes around it.`;

    let lastError = null;
    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyToUse = keys[currentGroqKeyIndex];
      try {
        const client = new OpenAI({ apiKey: keyToUse, baseURL: "https://api.groq.com/openai/v1" });
        const response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          max_tokens: 500,
        });
        const tailoredText = response.choices[0]?.message?.content?.trim();
        if (!tailoredText) throw new Error("AI returned no text");
        return res.json({ tailoredText });
      } catch (err) {
        lastError = err.message || JSON.stringify(err);
        console.warn(`Groq key index ${currentGroqKeyIndex} failed (tailor): ${lastError}. Trying next...`);
        currentGroqKeyIndex = (currentGroqKeyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: `All Groq keys failed: ${lastError}` });
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

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter((k) => k && k.trim() !== "");

    if (keys.length === 0) {
      return res.json({ resume_html: `<div class="p-8 text-black">Mock Compiled HTML layout since no API key is provided. <br/><br/> ${resumeText}</div>` });
    }

    const prompt = `You are an expert web developer and UI designer. Take the following raw resume text and compile it into a fully structured, elegant, semantic HTML representation.
Wrap it in a single <div> container. Use Tailwind CSS classes for beautiful, professional styling: e.g. text-3xl font-bold for the name, flexbox with justify-between for dates, subtle borders for section dividers, and clean lists for bullet points.
Make it look exactly like a premium, printed A4 PDF resume.
DO NOT USE MARKDOWN BLOCK QUOTES (no \`\`\`html). Return ONLY the raw HTML code string.

Resume Text:
"${resumeText}"`;

    let lastError = null;
    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyToUse = keys[currentGroqKeyIndex];
      try {
        const client = new OpenAI({ apiKey: keyToUse, baseURL: "https://api.groq.com/openai/v1" });
        const response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 2048,
        });
        let compiledHtml = response.choices[0]?.message?.content?.trim();
        if (!compiledHtml) throw new Error("AI returned no HTML");
        compiledHtml = compiledHtml.replace(/```html|```/g, "").trim();
        return res.json({ resume_html: compiledHtml });
      } catch (err) {
        lastError = err.message || JSON.stringify(err);
        console.warn(`Groq key index ${currentGroqKeyIndex} failed (compile-html): ${lastError}. Trying next...`);
        currentGroqKeyIndex = (currentGroqKeyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: `All Groq keys failed: ${lastError}` });
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

// ✅ Generate AI Cold Outreach Email
router.post("/generate-outreach-email", protect, async (req, res) => {
  try {
    const { jobDescription, company, role, profile } = req.body;
    if (!jobDescription || !company || !role) {
      return res.status(400).json({ error: "Job description, company, and role are required." });
    }

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5
    ].filter(k => k && k.trim() !== "");

    if (keys.length === 0) {
      return res.status(500).json({ error: "No Groq API keys configured." });
    }

    const userName = profile?.name || "the candidate";
    const techSkills = (profile?.technical_skills || []).filter(Boolean).join(", ");
    const softSkills = (profile?.soft_skills || []).filter(Boolean).join(", ");
    const bio = profile?.raw_bio || "";
    const projects = (profile?.projects || [])
      .filter(p => p.name)
      .map((p, i) => `[PROJECT_${i}:${p.name}] Tech: ${p.tech_stack || "N/A"} — ${p.description || ""}`)
      .join("\n");

    const prompt = `You are an expert technical career coach helping a candidate write a professional cold outreach email to an HR or hiring manager.

CANDIDATE PROFILE:
Name: ${userName}
Bio: ${bio}
Technical Skills: ${techSkills}
Soft Skills: ${softSkills}
Projects:
${projects || "No projects listed."}

TARGET JOB:
Company: ${company}
Role: ${role}
Job Description:
"""${jobDescription}"""

TASK:
Write a professional, concise cold outreach email for this candidate.
- Mention 1-2 of their technical skills that directly match the job description.
- If any project is HIGHLY relevant to the job description, mention it naturally and wrap its name in the tag <<HIGHLIGHT>> like this: <<HIGHLIGHT>>ProjectName<<END_HIGHLIGHT>>. Only highlight if genuinely relevant.
- Keep the email under 200 words.
- Do NOT include a subject line — just the email body starting with "Dear Hiring Team," or similar.
- Use the actual candidate name provided.
- Return ONLY the email body. No preamble. Just the email text itself.`;

    let lastError = null;
    let keyIndex = currentGroqKeyIndex;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyToUse = keys[keyIndex];
      try {
        const client = new OpenAI({
          apiKey: keyToUse,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.65,
          max_tokens: 600,
        });

        const emailBody = response.choices[0]?.message?.content?.trim();
        if (!emailBody) throw new Error("AI returned empty response");

        // Parse highlighted projects
        const highlightedProjects = [];
        const regex = /<<HIGHLIGHT>>(.*?)<<END_HIGHLIGHT>>/g;
        let match;
        while ((match = regex.exec(emailBody)) !== null) {
          highlightedProjects.push(match[1].trim());
        }

        return res.json({ emailBody, highlightedProjects });

      } catch (err) {
        lastError = err.message || JSON.stringify(err);
        console.warn(`Groq key ${keyIndex} failed: ${lastError}. Rotating...`);
        keyIndex = (keyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: `All Groq keys failed: ${lastError}` });

  } catch (error) {
    console.error("EMAIL GEN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Skill Gap Analysis — compare user skills vs applied job requirements
router.post("/skill-gap-analysis", protect, async (req, res) => {
  try {
    const { userSkills, appliedJobs } = req.body;

    if (!appliedJobs || appliedJobs.length === 0) {
      return res.status(400).json({ error: "No applied jobs provided." });
    }

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter(k => k && k.trim() !== "");

    if (keys.length === 0) {
      return res.status(500).json({ error: "No Groq API keys configured." });
    }

    const jobsSummary = appliedJobs
      .map((j, i) => `Job ${i + 1}: ${j.role} at ${j.company}\nDescription: ${j.job_description || "N/A"}`)
      .join("\n\n---\n\n");

    const prompt = `You are a career development expert and technical skills advisor.

USER'S CURRENT SKILLS:
${(userSkills || []).filter(Boolean).join(", ") || "None listed"}

JOBS THE USER HAS APPLIED TO:
${jobsSummary}

TASK:
1. Analyze the job descriptions to identify all required/desired technical skills mentioned.
2. Compare against the user's current skills.
3. List the MISSING skills that appear in the job descriptions but NOT in the user's skill set.
4. For each missing skill, decide if it's on roadmap.sh. Roadmap.sh has these topics: javascript, typescript, react, vue, angular, nodejs, python, java, golang, rust, devops, docker, kubernetes, aws, mongodb, postgresql-dba, sql, git-github, linux, backend, frontend, full-stack, system-design, datastructures-and-algorithms, django, spring-boot, flutter, react-native, ai-data-scientist, data-science-and-analytics, cyber-security, blockchain, redis, graphql, terraform, prompt-engineering.
5. Return a JSON array of missing skills sorted by priority (most commonly required first).

Each item in the array must have:
- "skill": exact skill name (e.g. "Kubernetes")
- "priority": "High", "Medium", or "Low"  
- "reason": one sentence why it's needed (reference the specific job)
- "roadmap_slug": the roadmap.sh slug if available, else null (e.g. "kubernetes" or null)
- "alt_resource": if no roadmap.sh slug, provide a direct URL to the best free resource (Coursera, freeCodeCamp, MDN, official docs)
- "alt_resource_name": human-readable name of alt resource

Return ONLY a valid JSON array. No markdown, no explanation. Example:
[{"skill":"Kubernetes","priority":"High","reason":"Required in 2 out of 3 job postings","roadmap_slug":"kubernetes","alt_resource":null,"alt_resource_name":null}]`;

    let lastError = null;
    let keyIndex = currentGroqKeyIndex;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyToUse = keys[keyIndex];
      try {
        const client = new OpenAI({ apiKey: keyToUse, baseURL: "https://api.groq.com/openai/v1" });
        const response = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 1000,
        });

        let raw = response.choices[0]?.message?.content?.trim();
        if (!raw) throw new Error("Empty AI response");

        // Strip markdown code fences if present
        raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

        const skills = JSON.parse(raw);
        return res.json({ missingSkills: skills });

      } catch (err) {
        lastError = err.message;
        keyIndex = (keyIndex + 1) % keys.length;
      }
    }

    return res.status(500).json({ error: `All Groq keys failed: ${lastError}` });
  } catch (error) {
    console.error("SKILL GAP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;