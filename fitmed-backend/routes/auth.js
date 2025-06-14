// routes/auth.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Token from "../models/PasswordResetToken.js";

const router = Router();

// Validation Schemas
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = registerSchema.validate({ firstName, lastName, email, password });
    if (error) return res.status(400).json({ msg: `❌ ${error.details[0].message}` });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "❌ Email already registered!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "✅ User registered successfully!" });
  } catch (err) {
    console.error("🔥 Registration Error:", err);
    res.status(500).json({ msg: "❌ Internal Server Error!" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password });
    if (error) return res.status(400).json({ msg: `❌ ${error.details[0].message}` });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "❌ Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "❌ Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "✅ Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 Login Error:", err);
    res.status(500).json({ msg: "❌ Internal Server Error!" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "❌ User not found with this email." });

    const tokenString = crypto.randomBytes(32).toString("hex");
    const token = new Token({
      userId: user._id,
      token: tokenString,
      createdAt: Date.now()
    });
    await token.save();

    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password.html?token=${tokenString}&id=${user._id}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"FitMed Guide" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<h3>Reset Your Password</h3><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ msg: "✅ Password reset link sent to email." });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ msg: "❌ Internal Server Error!" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { id, password } = req.body;
    const tokenRecord = await Token.findOne({ userId: id, token });

    if (!tokenRecord) return res.status(400).json({ msg: "❌ Invalid or expired token." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    await Token.deleteOne({ _id: tokenRecord._id });

    res.json({ msg: "✅ Password has been reset successfully!" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ msg: "❌ Internal Server Error!" });
  }
});

export default router;
