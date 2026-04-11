import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: { type: String, required: true },
    role: { type: String, required: true },
    hr_email: { type: String, default: "" },
    job_description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "In Review", "Interview", "Rejected", "Offer"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
