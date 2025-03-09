import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/Database.js";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config();

// Initialize Express App
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debugging: Log when auth routes are hit
app.use("/api/auth", (req, res, next) => {
    console.log("Auth routes hit:", req.path);
    next();
});

// Define Routes
app.use("/api/auth", userRoutes);
app.use("/api/v1", transactionRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.send("FinManager Server is working");
});

// Start Server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
