import fetch from 'node-fetch';

async function test() {
  try {
    // 1. register
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: "Test User", email: "testuser99@example.com", password: "password123" })
    });
    const regData = await regRes.json();
    console.log("Register:", regData);

    // 2. login
    const logRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "testuser99@example.com", password: "password123" })
    });
    const logData = await logRes.json();
    console.log("Login:", logData);

    // 3. post profile
    const token = logData.token;
    const profRes = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ target_roles: ["SWE"], experience_level: "Fresher", raw_bio: "Test bio", technical_skills: ["JS"], soft_skills: ["Comms"], projects: [] })
    });
    const text = await profRes.text();
    console.log("Profile status:", profRes.status, text);

  } catch (err) {
    console.error("Script error:", err);
  }
}
test();
