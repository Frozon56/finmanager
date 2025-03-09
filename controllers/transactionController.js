import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
    try {
        const { title, amount, description, date, category, transactionType } = req.body;
        const userId = req.user.id; // Assuming authentication middleware sets req.user

        if (!title || !amount || !description || !date || !category || !transactionType) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newTransaction = await Transaction.create({
            title,
            amount,
            category,
            description,
            date,
            user: userId,
            transactionType,
        });

        user.transactions.push(newTransaction._id);
        await user.save();

        return res.status(201).json({ success: true, message: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllTransactionController = async (req, res) => {
    try {
        const { type, frequency, startDate, endDate } = req.query;
        const userId = req.user.id;

        const query = { user: userId };
        if (type && type !== 'all') query.transactionType = type;

        if (frequency && frequency !== 'custom') {
            query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
        } else if (startDate && endDate) {
            query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        return res.status(200).json({ success: true, transactions });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTransactionController = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.user.id;

        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { transactions: transactionId } });
        return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const updateTransactionController = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.user.id;
        const updateData = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, user: userId },
            updateData,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        return res.status(200).json({ success: true, message: "Transaction updated successfully", transaction });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
