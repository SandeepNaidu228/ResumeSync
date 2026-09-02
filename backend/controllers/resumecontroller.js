import Resume from "../models/Resume.js";
import ResumeAnalysis from "../models/Resumeanalysis.js";
import { analyzeResumeWithAI } from "../utils/aianalyzer.js";


// ============================================================
// EXISTING RESUME ANALYSIS
// ============================================================

export const analyzeResume = async (
  resumeText,
  jobRole,
  userId,
  fileName
) => {
  const analysis = await analyzeResumeWithAI(resumeText, jobRole);

  const saved = await ResumeAnalysis.create({
    user_id: userId,
    file_name: fileName,
    job_role: jobRole,
    ...analysis,
    resume_text: analysis.converted_latex || resumeText,
  });

  return saved;
};


// ============================================================
// CREATE NEW RESUME
// ============================================================

export const createResume = async (req, res) => {
  try {
    const {
      name,
      content,
      design,
      builderConfig,
    } = req.body;

    const resume = await Resume.create({
      userId: req.user.id,

      name: name || "Untitled Resume",

      content: content || {},

      design: design || {},

      builderConfig: builderConfig || {
        sections: [],
      },

      version: 1,
    });

    return res.status(201).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("CREATE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// GET ALL USER RESUMES
// ============================================================

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.id,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {
    console.error("GET RESUMES ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// GET SINGLE BUILDER RESUME
// ============================================================

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("GET RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// UPDATE BUILDER RESUME
// ============================================================

export const updateResume = async (req, res) => {
  try {
    const {
      name,
      content,
      design,
      builderConfig,
    } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }

    if (name !== undefined) {
      resume.name = name;
    }

    if (content !== undefined) {
      resume.content = content;
    }

    if (design !== undefined) {
      resume.design = design;
    }

    if (builderConfig !== undefined) {
      resume.builderConfig = builderConfig;
    }

    await resume.save();

    return res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("UPDATE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// DELETE BUILDER RESUME
// ============================================================

export const deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// ============================================================
// DUPLICATE BUILDER RESUME
// ============================================================

export const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }

    const duplicatedResume = await Resume.create({
      userId: req.user.id,

      name: `${originalResume.name} Copy`,

      content: originalResume.content,

      design: originalResume.design,

      builderConfig: originalResume.builderConfig,

      version: 1,
    });

    return res.status(201).json({
      success: true,
      resume: duplicatedResume,
    });

  } catch (error) {
    console.error("DUPLICATE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};