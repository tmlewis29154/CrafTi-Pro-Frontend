import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeekAtaGlance from './WeekAtaGlance';

const Dashboard = ({ user }) => {
  const [salesTotal, setSalesTotal] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("❌ User not logged in. Cannot fetch analytics.");
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = () => {
    axios.get(`https://craftipro.com/analytics.php?UserID=${user.UserID}&timeframe=current_month`)
      .then(response => {
        console.log("✅ Fetched Dashboard Data:", response.data);
  
        if (!response.data || typeof response.data !== "object") {
          console.error("❌ Invalid Analytics Response:", response.data);
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
      .catch(error => {
        console.error("❌ Error fetching analytics:", error.message);
        setSalesTotal(0);
        setExpensesTotal(0);
        setProfit(0);
      });
  };
  return (
    <div className="container mt-4">
      {/* Dashboard Header with Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-primary fw-bold">
          <span role="img" aria-label="chart">📊</span> Business Dashboard
        </h2>
        <div>
          <a href="/manage-business/events" className="btn btn-primary me-2">➕ Add Event</a>
          <a href="/manage-business/products" className="btn btn-info me-2">🏷️ Add Product</a>
          <a href="/manage-business/record-sale" className="btn btn-success">💰 Add Sale</a>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="row g-3 justify-content-center text-center">
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded text-white bg-primary text-center">
            <div className="card-body">
              <h6 className="fw-bold">Total Sales</h6>
              <p className="display-6 fw-bold">${salesTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-sm rounded text-white bg-danger text-center">
            <div className="card-body">
              <h6 className="fw-bold">Total Expenses</h6>
              <p className="display-6 fw-bold">-${expensesTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className={`card shadow-sm rounded text-white text-center ${profit >= 0 ? "bg-success" : "bg-danger"}`}>
            <div className="card-body">
              <h6 className="fw-bold">Net Profit</h6>
              <p className="display-6 fw-bold">${profit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week at a Glance Section */}
      <div className="mt-4">
      <WeekAtaGlance user={user} />
      </div>
    </div>
  );
};

export default Dashboard;


