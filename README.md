# 🚀 ResumeSync — AI Resume Analyzer

An AI-powered Resume Analyzer web application that evaluates resumes using **Groq AI** and provides ATS scores, strengths, weaknesses, skill gap analysis, and improvement suggestions.

This project is built using the MERN stack and demonstrates full-stack development, secure authentication, file upload handling, and AI integration.

---

## 🔥 Features

- 🔐 JWT Authentication (Login / Register)
- 📄 Resume Upload (PDF / Text)
- 🧠 AI-powered Resume Analysis (Groq — LLaMA 3.3 70B)
- 📊 ATS Score Breakdown
- 💪 Strength & Weakness Detection
- 📈 Skill Match & Gap Analysis
- ✍️ AI Resume Builder with Live HTML Preview
- 🎯 AI Text Refinement & Tailoring
- 📬 AI Cold Outreach Email Generator
- 💼 Job Application Tracker
- 🗂 Resume History for Each User
- 🛡 Secure API Key Handling with Multi-Key Rotation

---

## 🛠 Tech Stack

### 🎨 Frontend
- React (Vite + TypeScript)
- Tailwind CSS
- shadcn/ui
- Axios / Fetch API

### ⚙ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)
- pdfjs-dist (PDF Text Extraction)
- **Groq AI API** (via OpenAI-compatible SDK)

---

## 🧠 How It Works

1. User registers or logs in.
2. Uploads a resume (PDF or paste text).
3. Backend extracts text from the uploaded resume.
4. Extracted text is sent to **Groq AI (LLaMA 3.3 70B)** for analysis.
5. AI returns a structured JSON response including:
   - Overall, ATS, Skills, Experience & Education Scores
   - Strengths & Weaknesses
   - Improvement Suggestions
   - Skills Found & Missing Skills
   - A beautifully formatted HTML version of the resume
6. Analysis is stored in MongoDB.
7. User can view resume analysis history and edit resumes anytime.

---

## ⚙ Setup

### Backend
```bash
cd backend
npm install
node server.js
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Groq API Keys (supports up to 5 keys with automatic rotation)
GROQ_API_KEY_1=your_groq_api_key_1
GROQ_API_KEY_2=your_groq_api_key_2
GROQ_API_KEY_3=your_groq_api_key_3
GROQ_API_KEY_4=your_groq_api_key_4
GROQ_API_KEY_5=your_groq_api_key_5
```

> 💡 Get your free Groq API key at [https://console.groq.com](https://console.groq.com)

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Groq API Key Rotation

The backend uses an automatic **key rotation** mechanism across up to 5 Groq API keys. If one key hits a rate limit or fails, the next key is used automatically — ensuring high availability and uninterrupted AI responses.

---

## 👨‍💻 Author

M V N Sandeep Naidu

⭐ If you like this project, consider giving it a star!