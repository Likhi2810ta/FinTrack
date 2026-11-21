import { useEffect, useState } from "react";
import api from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions/");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Summary calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Monthly income vs expenses
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const month = transaction.date?.slice(0, 7);

    if (!month) return;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        income: 0,
        expenses: 0,
      };
    }

    if (transaction.type === "income") {
      monthlyData[month].income += Number(transaction.amount);
    } else {
      monthlyData[month].expenses += Number(transaction.amount);
    }
  });

  const incomeExpenseData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // Category breakdown
  const categoryData = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      const category = transaction.category || "Other";

      categoryData[category] =
        (categoryData[category] || 0) + Number(transaction.amount);
    });

  const expenseCategoryData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">

        <div className="summary-card">
          <p>Total Balance</p>
          <h2>{formatCurrency(balance)}</h2>
          <span className="summary-subtitle">
            Your available balance
          </span>
        </div>

        <div className="summary-card">
          <p>Total Income</p>
          <h2>{formatCurrency(totalIncome)}</h2>
          <span className="income-text">
            ↑ Money received
          </span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>{formatCurrency(totalExpenses)}</h2>
          <span className="expense-text">
            ↓ Money spent
          </span>
        </div>

        <div className="summary-card">
          <p>Transactions</p>
          <h2>{transactions.length}</h2>
          <span className="summary-subtitle">
            Total transactions
          </span>
        </div>

      </div>

      {/* Charts */}
      <div className="dashboard-charts">

        {/* Income vs Expenses */}
        <div className="chart-card income-expense-card">
          <h3>Income vs Expenses</h3>
          <p>Financial overview</p>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeExpenseData}
                barGap={8}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={35}
                />

                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#6366f1"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-dot income-dot"></i>
              Income
            </span>

            <span>
              <i className="legend-dot expense-dot"></i>
              Expenses
            </span>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="chart-card category-card">
          <h3>Expense Categories</h3>
          <p>Where your money goes</p>

          <div className="category-list">
            {expenseCategoryData.length === 0 ? (
              <div className="empty-chart">
                No expenses yet
              </div>
            ) : (
              expenseCategoryData.map((item) => {
                const percentage =
                  totalExpenses > 0
                    ? (item.amount / totalExpenses) * 100
                    : 0;

                return (
                  <div className="category-item" key={item.category}>
                    <div className="category-info">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.amount)}</strong>
                    </div>

                    <div className="category-progress">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions-card">
        <div className="section-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Your latest financial activity</p>
          </div>
        </div>

        <div className="recent-transactions-list">
          {recentTransactions.length === 0 ? (
            <p className="empty-transactions">
              No transactions yet.
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                className="recent-transaction-item"
                key={transaction._id}
              >
                <div className="transaction-details">
                  <div className="transaction-icon">
                    {transaction.type === "income" ? "↗" : "↘"}
                  </div>

                  <div>
                    <strong>{transaction.description}</strong>
                    <span>
                      {transaction.category} · {transaction.date}
                    </span>
                  </div>
                </div>

                <strong
                  className={
                    transaction.type === "income"
                      ? "income-amount"
                      : "expense-amount"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;