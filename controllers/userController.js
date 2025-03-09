import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerControllers = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ name, email, password: hashedPassword });

        // Generate JWT token after registration
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Remove password from response
        const { password: _, ...userData } = user.toObject();
        return res.status(201).json({ success: true, message: "User registered successfully", token, user: userData });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const loginControllers = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Ensure password exists before comparing
        if (!user.password) {
            return res.status(500).json({ success: false, message: "Internal server error: password not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ success: true, message: `Welcome back, ${user.name}`, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const setAvatarController = async (req, res) => {
    try {
        const userId = req.params.id;
        const imageData = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        }, { new: true });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
