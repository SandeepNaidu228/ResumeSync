import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import JobApplication from "../models/JobApplication.js";

const router = express.Router();

// GET all jobs for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new job application
router.post("/", protect, async (req, res) => {
  try {
    const { company, role, hr_email, job_description, status } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: "Company and Role are required." });
    }
    const job = await JobApplication.create({
      user_id: req.user.id,
      company,
      role,
      hr_email: hr_email || "",
      job_description: job_description || "",
      status: status || "Applied",
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update status (or any field) of a job
router.put("/:id", protect, async (req, res) => {
  try {
    const allowed = ["company", "role", "hr_email", "job_description", "status"];
    const update = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });

    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      update,
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a job application
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
