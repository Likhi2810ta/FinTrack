
import { useEffect, useState } from "react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
  });

  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other",
  ];

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions/");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Open add modal
  const handleAddClick = () => {
    setEditingTransaction(null);

    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
    });

    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      description: transaction.description || "",
      amount: transaction.amount || "",
      category: transaction.category || "",
      type: transaction.type || "expense",
      date: transaction.date || new Date().toISOString().slice(0, 10),
    });

    setShowModal(true);
  };

  // Form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Extract readable backend errors
  const getErrorMessage = (error) => {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          const field = item.loc?.slice(1).join(".");
          const message = item.msg || "Invalid value";

          return field
            ? `${field}: ${message}`
            : message;
        })
        .join("\n");
    }

    if (detail && typeof detail === "object") {
      return JSON.stringify(detail, null, 2);
    }

    return error.message || "Something went wrong.";
  };

  // Add or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const transactionData = {
  title: formData.description.trim(),
  description: formData.description.trim(),
  amount: Number(formData.amount),
  category: formData.category,
  type: formData.type,
  date: formData.date,
};

      console.log("Sending transaction:", transactionData);

      if (editingTransaction) {
        const id =
          editingTransaction._id || editingTransaction.id;

        await api.put(
          `/transactions/${id}`,
          transactionData
        );
      } else {
        await api.post(
          "/transactions/",
          transactionData
        );
      }

      setShowModal(false);
      setEditingTransaction(null);

      setFormData({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
      });

      await fetchTransactions();
    } catch (error) {
      console.error("Transaction save error:", error);

      alert(getErrorMessage(error));
    }
  };

  // Delete transaction
  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      const id = transaction._id || transaction.id;

      await api.delete(`/transactions/${id}`);

      await fetchTransactions();
    } catch (error) {
      console.error("Delete error:", error);

      alert(getErrorMessage(error));
    }
  };

  // Filter transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.category
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" ||
        transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        transaction.category === categoryFilter;

      const matchesMonth =
        !monthFilter ||
        transaction.date?.startsWith(monthFilter);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesMonth
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortOrder === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortOrder === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      return 0;
    });

  // Unique categories
  const categories = [
    ...new Set(
      transactions.map((t) => t.category).filter(Boolean)
    ),
  ];

  if (loading) {
    return (
      <div className="page">
        <h2>Loading transactions...</h2>
      </div>
    );
  }

  return (
    <div className="page transactions-page">
      {/* Header */}
      <div className="page-header transactions-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage all your transactions.</p>
        </div>

        <button
          className="add-transaction-btn"
          onClick={handleAddClick}
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction._id || transaction.id}>
                  <td>{transaction.description}</td>

                  <td>{transaction.category}</td>

                  <td>{transaction.date}</td>

                  <td>
                    <span
                      className={`transaction-type ${
                        transaction.type === "income"
                          ? "income"
                          : "expense"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={
                      transaction.type === "income"
                        ? "income-amount"
                        : "expense-amount"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    ₹
                    {Number(
                      transaction.amount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <div className="transaction-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(transaction)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-transactions">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="transaction-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="transaction-modal-header">
              <h2>
                {editingTransaction
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>

              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Type */}
              <div className="form-group">
                <label>Transaction Type</label>

                <div className="transaction-type-selector">
                  <button
                    type="button"
                    className={
                      formData.type === "expense"
                        ? "type-option active expense-option"
                        : "type-option"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: "expense",
                        category: "",
                      })
                    }
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    className={
                      formData.type === "income"
                        ? "type-option active income-option"
                        : "type-option"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: "income",
                        category: "",
                      })
                    }
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount (₹)</label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  name="description"
                  placeholder="What was this transaction for?"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>

                  {(formData.type === "expense"
                    ? expenseCategories
                    : incomeCategories
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="transaction-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-transaction-btn"
                >
                  {editingTransaction
                    ? "Update Transaction"
                    : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
