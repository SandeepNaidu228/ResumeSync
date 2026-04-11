import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const email = "test@test.com";
const password = "test1234";
const full_name = "Test User";

const existing = await User.findOne({ email });
if (existing) {
  console.log("User already exists:", email);
} else {
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ full_name, email, password: hashedPassword });
  console.log("✅ Test user created:", email, "/ password:", password);
}

await mongoose.disconnect();
