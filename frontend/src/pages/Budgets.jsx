import { useEffect, useState } from "react";
import api from "../services/api";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  const fetchData = async () => {
    try {
      const budgetResponse = await api.get("/budgets/");
      const transactionResponse = await api.get("/transactions/");

      setBudgets(budgetResponse.data);
      setTransactions(transactionResponse.data);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/budgets/", {
        category,
        amount: Number(amount),
        month: currentMonth,
      });

      setAmount("");
      fetchData();
    } catch (error) {
      alert("Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      await api.delete(`/budgets/${id}`);
      fetchData();
    } catch (error) {
      alert("Failed to delete budget");
    }
  };

  const getSpent = (categoryName) => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === categoryName &&
          transaction.date?.startsWith(currentMonth)
      )
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  };

  const currentBudgets = budgets.filter(
    (budget) => budget.month === currentMonth
  );

  if (loading) {
    return <div className="page"><h2>Loading budgets...</h2></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Monthly Budgets</h1>
        <p>Track your spending against your monthly limits.</p>
      </div>

      <form className="budget-form" onSubmit={handleSubmit}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />

        <button type="submit">Set Budget</button>
      </form>

      <div className="budget-grid">
        {currentBudgets.map((budget) => {
          const spent = getSpent(budget.category);
          const remaining = budget.amount - spent;
          const percentage = Math.min(
            (spent / budget.amount) * 100,
            100
          );

          return (
            <div className="budget-card" key={budget._id}>
              <div className="budget-card-header">
                <h3>{budget.category}</h3>
                <button
                  className="delete-budget"
                  onClick={() => handleDelete(budget._id)}
                >
                  ✕
                </button>
              </div>

              <p className="budget-spent">
                ₹{spent.toLocaleString("en-IN")} spent
              </p>

              <div className="budget-progress">
                <div
                  className={`budget-progress-fill ${
                    percentage >= 100
                      ? "over-budget"
                      : percentage >= 80
                      ? "warning"
                      : ""
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="budget-details">
                <span>Budget: ₹{budget.amount.toLocaleString("en-IN")}</span>
                <span>
                  {remaining >= 0
                    ? `₹${remaining.toLocaleString("en-IN")} left`
                    : `₹${Math.abs(remaining).toLocaleString("en-IN")} over`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {currentBudgets.length === 0 && (
        <div className="empty-transactions">
          <p>No budgets set for this month yet.</p>
        </div>
      )}
    </div>
  );
}

export default Budgets;