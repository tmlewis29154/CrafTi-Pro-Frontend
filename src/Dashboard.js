import React, { useEffect, useState } from "react";
import axios from "axios";
import WeekAtaGlance from "./WeekAtaGlance";
import "./Dashboard.css"; // Import custom styles

const Dashboard = ({ user }) => {
  const [salesTotal, setSalesTotal] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("User not logged in. Cannot fetch analytics.");
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = () => {
    axios
      .get(`https://craftipro.com/analytics.php?UserID=${user.UserID}&timeframe=current_month`)
      .then((response) => {
        console.log("Fetched Dashboard Data:", response.data);

        if (!response.data || typeof response.data !== "object") {
          console.error("Invalid Analytics Response:", response.data);
          return;
        }

        const sales = parseFloat(response.data.total_sales ?? 0);
        const expenses = parseFloat(response.data.total_expenses ?? 0);
        const netProfit = parseFloat(response.data.profit ?? 0);

        console.log("📊 Parsed Data - Sales:", sales, "Expenses:", expenses, "Profit:", netProfit);

        setSalesTotal(sales);
        setExpensesTotal(expenses);
        setProfit(netProfit);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error.message);
        setSalesTotal(0);
        setExpensesTotal(0);
        setProfit(0);
      });
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header with Action Buttons */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span role="img" aria-label="chart">📊</span> Business Dashboard
        </h2>
        <div className="dashboard-buttons">
          <a href="/manage-business/events" className="custom-btn blue">➕ Add Event</a>
          <a href="/manage-business/products" className="custom-btn info">🏷️ Add Product</a>
          <a href="/manage-business/record-sale" className="custom-btn green">💰 Add Sale</a>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card blue">
          <h6>Total Sales</h6>
          <p className="amount">${salesTotal.toFixed(2)}</p>
        </div>
        <div className="dashboard-card red">
          <h6>Total Expenses</h6>
          <p className="amount">-${expensesTotal.toFixed(2)}</p>
        </div>
        <div className={`dashboard-card ${profit >= 0 ? "green" : "red"}`}>
          <h6>Net Profit</h6>
          <p className="amount">${profit.toFixed(2)}</p>
        </div>
      </div>

      {/* Week at a Glance Section */}
      <div className="week-glance">
        <WeekAtaGlance user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
