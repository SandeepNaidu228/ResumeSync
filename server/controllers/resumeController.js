const Resume = require("../models/Resume");

const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      userId: req.userId,
      title: req.body.title || "Untitled Resume",
    });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resume.",
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.userId,
    }).sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resume.",
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
};