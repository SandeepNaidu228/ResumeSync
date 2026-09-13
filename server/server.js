const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ResumeSync API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.listen(PORT, () => {
  console.log(
    `ResumeSync server running on http://localhost:${PORT}`
  );
});