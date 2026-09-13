const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

router.use(protect);

router.post("/", createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;