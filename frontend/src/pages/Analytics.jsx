import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/transactions/");
        setTransactions(response.data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.date?.startsWith(selectedMonth)
  );

  const expenses = filteredTransactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const income = filteredTransactions.filter(
    (transaction) => transaction.type === "income"
  );

  // Calculate totals
  const totalExpenses = expenses.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const savings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Category-wise expenses
  const categoryData = Object.values(
    expenses.reduce((acc, transaction) => {
      const category = transaction.category || "Other";

      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0,
        };
      }

      acc[category].value += Number(transaction.amount || 0);

      return acc;
    }, {})
  );

  // Monthly comparison
  const monthlyData = [
    {
      month: selectedMonth,
      income: totalIncome,
      expenses: totalExpenses,
    },
  ];

  // Highest expense
  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((max, current) =>
          Number(current.amount) > Number(max.amount)
            ? current
            : max
        )
      : null;

  // Chart colors
  const COLORS = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#64748b",
  ];

  if (loading) {
    return (
      <div className="page">
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  return (
    <div className="page analytics-page">

      {/* Header */}
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Understand your financial habits.</p>
      </div>

      {/* Month Filter */}
      <div className="analytics-filter">
        <label htmlFor="analytics-month">
          Select Month
        </label>

        <input
          id="analytics-month"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">

        <div className="analytics-card income-card">
          <span className="analytics-label">
            Total Income
          </span>

          <h2>
            ₹{totalIncome.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="analytics-card expense-card">
          <span className="analytics-label">
            Total Expenses
          </span>

          <h2>
            ₹{totalExpenses.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="analytics-card average-card">
          <span className="analytics-label">
            Savings
          </span>

          <h2>
            ₹{savings.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="analytics-card category-card">
          <span className="analytics-label">
            Savings Rate
          </span>

          <h2>
            {savingsRate.toFixed(1)}%
          </h2>
        </div>

      </div>

      {/* SIDE-BY-SIDE CHARTS */}
      <div className="analytics-charts-grid">

        {/* Income vs Expenses */}
        <div className="analytics-section">
          <div className="analytics-section-header">
            <h2>Income vs Expenses</h2>
            <p>
              Financial overview for {selectedMonth}
            </p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                />

                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="analytics-section">
          <div className="analytics-section-header">
            <h2>Expense Breakdown</h2>
            <p>Where your money goes</p>
          </div>

          {categoryData.length > 0 ? (
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />

                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              <p>No expenses for this month.</p>
            </div>
          )}
        </div>

      </div>

      {/* Highest Expense */}
      <div className="analytics-section highest-expense-section">
        <h2>Highest Expense</h2>

        {highestExpense ? (
          <div className="highest-expense-card">
            <div>
              <h3>{highestExpense.description}</h3>
              <p>{highestExpense.category}</p>
              <small>{highestExpense.date}</small>
            </div>

            <h2>
              ₹{Number(highestExpense.amount).toLocaleString("en-IN")}
            </h2>
          </div>
        ) : (
          <p>No expenses for this month.</p>
        )}
      </div>

    </div>
  );
}

export default Analytics;