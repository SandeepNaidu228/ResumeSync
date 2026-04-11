import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file_name: String,
    job_role: String,
    resume_text: { type: String, required: true },
    resume_html: { type: String, default: "" }, // stores semantic HTML generated from the text
    pdf_data: { type: Buffer, default: null }, // stores raw PDF bytes
    resume_data: { type: mongoose.Schema.Types.Mixed, default: null }, // stores structured JSON for the ResumeTemplate component


    overall_score: Number,
    ats_score: Number,
    skills_score: Number,
    experience_score: Number,
    education_score: Number,

    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    skills_found: [String],
    missing_skills: [String],

    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeSchema);