import express from 'express';
import {
    addTransactionController,
    deleteTransactionController,
    getAllTransactionController,
    updateTransactionController
} from '../controllers/transactionController.js';
import { verifyToken } from "../middlewares/authMiddleware.js"; // Middleware for authentication

const router = express.Router();

// Secure all transaction routes
router.route("/addTransaction").post(verifyToken, addTransactionController);
router.route("/getTransaction").get(verifyToken, getAllTransactionController);
router.route("/deleteTransaction/:id").delete(verifyToken, deleteTransactionController);
router.route("/updateTransaction/:id").patch(verifyToken, updateTransactionController);

export default router;
