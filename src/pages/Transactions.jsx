import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getTransactions();
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>Your Transactions</h2>
            <ul>
                {transactions.map((txn) => (
                    <li key={txn._id}>{txn.title} - ₹{txn.amount} ({txn.transactionType})</li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;
