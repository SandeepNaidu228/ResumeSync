import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);