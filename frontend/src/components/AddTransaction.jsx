import { useState } from "react";
import API from "../services/api";

function AddTransaction({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/transactions/", {
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Transaction added successfully!");

      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });

      onTransactionAdded(response.data);

    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Groceries"
            required
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="1"
            required
          />
        </div>

        <div>
          <label>Transaction Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Food, Salary, Shopping"
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
          />
        </div>

        <button type="submit">
          Add Transaction
        </button>

      </form>
    </div>
  );
}

export default AddTransaction;