import express from "express";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// GET /api/profile
// Get the user's master profile
router.get("/", protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/profile
// Create or update the user's master profile
router.post("/", protect, async (req, res) => {
  try {
    const { target_roles, experience_level, raw_bio, technical_skills, soft_skills, projects } = req.body;
    import("fs").then(fs => fs.writeFileSync("debug.txt", JSON.stringify(req.user)));

    let profile = await UserProfile.findOne({ user_id: req.user.id });

    if (profile) {
      profile.target_roles = target_roles || profile.target_roles;
      profile.experience_level = experience_level || profile.experience_level;
      profile.raw_bio = raw_bio || profile.raw_bio;
      profile.technical_skills = technical_skills || profile.technical_skills;
      profile.soft_skills = soft_skills || profile.soft_skills;
      profile.projects = projects || profile.projects;
      await profile.save();
    } else {
      profile = await UserProfile.create({
        user_id: req.user.id || req.user._id,
        target_roles,
        experience_level,
        raw_bio,
        technical_skills,
        soft_skills,
        projects
      });
    }

    // Mark the user's profile as completed
    await User.findByIdAndUpdate(req.user.id, { profile_completed: true });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message, debug_req_user: req.user });
  }
});

export default router;
