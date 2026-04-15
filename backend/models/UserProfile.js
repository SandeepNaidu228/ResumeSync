import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    target_roles: [{ type: String }],
    experience_level: { type: String, default: "" },
    raw_bio: { type: String, default: "" },
    technical_skills: [{ type: String }],
    soft_skills: [{ type: String }],
    projects: [
      {
        name: { type: String },
        tech_stack: { type: String },
        description: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
