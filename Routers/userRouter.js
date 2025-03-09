import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ SIGNUP (REGISTER) ROUTE
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("📝 Signup request received:", { name, email });

        // 🔍 Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 🔐 Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 📌 Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // 🎟 Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ success: true, message: "User registered successfully", token, user: newUser });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔹 Login request received:", { email });

        // 🔍 Find user by email & include password field explicitly
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        console.log("✅ User found:", user);

        // 🔐 Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });
        }

        // 🎟 Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful", token, user });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

export default router;
