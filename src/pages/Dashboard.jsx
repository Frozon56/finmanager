import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Table, Form } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../pages/Dashboard.css"; 

const API_URL = "http://localhost:4000/api/v1";

function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [transactionType, setTransactionType] = useState("income");

  // ✅ Fetch Transactions on Load
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/getTransaction`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTransactions(response.data.transactions);

        // ✅ Calculate Total Income & Expenses
        let totalIncome = 0;
        let totalExpenses = 0;
        response.data.transactions.forEach((tx) => {
          if (tx.transactionType === "income") {
            totalIncome += tx.amount;
          } else {
            totalExpenses += Math.abs(tx.amount);
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const balance = income - expenses;

  // ✅ Add Transaction & Update UI
  const addTransaction = async () => {
    if (!newDesc || !newAmount) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/addTransaction`,
        {
          description: newDesc,
          amount: parseFloat(newAmount),
          transactionType,
          date: new Date(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const newTx = response.data.transaction;
        setTransactions([newTx, ...transactions]);

        // ✅ Update Income/Expenses
        if (transactionType === "income") {
          setIncome(income + newTx.amount);
        } else {
          setExpenses(expenses + Math.abs(newTx.amount));
        }

        // ✅ Reset Form
        setNewDesc("");
        setNewAmount("");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // ✅ Delete Transaction & Update UI
  const deleteTransaction = async (id, amount, type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/deleteTransaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTransactions(transactions.filter((tx) => tx._id !== id));

        if (type === "income") {
          setIncome(income - amount);
        } else {
          setExpenses(expenses - Math.abs(amount));
        }
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const data = [
    { name: "Income", value: income, color: "#28a745" },
    { name: "Expenses", value: expenses, color: "#dc3545" },
  ];

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <Card className="dashboard-card income">
          <h4>Total Income</h4>
          <p>${income.toLocaleString()}</p>
        </Card>
        <Card className="dashboard-card expenses">
          <h4>Total Expenses</h4>
          <p>${expenses.toLocaleString()}</p>
        </Card>
        <Card className="dashboard-card balance">
          <h4>Balance</h4>
          <p>${balance.toLocaleString()}</p>
        </Card>
      </div>

      {/* Add Transaction Form */}
      <div className="mt-4">
        <h4>Add Transaction</h4>
        <Form className="add-transaction-form">
          <Form.Control
            type="text"
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <Form.Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Select>
          <Button onClick={addTransaction}>Add</Button>
        </Form>
      </div>

      {/* Recent Transactions Table */}
      <div className="mt-4">
        <h4>Recent Transactions</h4>
        <Table striped bordered hover className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td className={tx.transactionType === "expense" ? "text-danger" : "text-success"}>
                  ${tx.amount.toLocaleString()}
                </td>
                <td>
                  <Button className="delete-btn" onClick={() => deleteTransaction(tx._id, tx.amount, tx.transactionType)}>
                    X
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pie Chart Overview */}
      <div className="chart-container">
        <h4>Finance Overview</h4>
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
