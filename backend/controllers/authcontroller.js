import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    full_name: fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.full_name,
    email: user.email,
    profile_completed: user.profile_completed || false,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  res.json({
    _id: user._id,
    fullName: user.full_name,
    email: user.email,
    profile_completed: user.profile_completed || false,
    token: generateToken(user._id),
  });
};

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client("795757389813-1i302cqmb2rs9q5c3vjubvo6r04f9kob.apps.googleusercontent.com");

export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Google credential missing" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: "795757389813-1i302cqmb2rs9q5c3vjubvo6r04f9kob.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      // Create user with a secure random password since they logged in via Google
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        full_name: name,
        email,
        password: hashedPassword,
      });
    }

    res.json({
      _id: user._id,
      fullName: user.full_name,
      email: user.email,
      profile_completed: user.profile_completed || false,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ error: "Invalid Google Token" });
  }
};