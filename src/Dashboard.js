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
    <div className="container-fluid mt-4">
      {/* Dashboard Header with Action Buttons */}
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-6">
          <h2 className="mb-0 text-primary fw-bold">
            <span role="img" aria-label="chart">📊</span> Business Dashboard
          </h2>
        </div>

        {/* Buttons - Stack on Small Screens, Inline on Larger Screens */}
        <div className="col-12 col-md-6 d-flex flex-wrap justify-content-md-end mt-2 mt-md-0">
          <a href="/manage-business/events" className="btn btn-primary btn-sm me-2 mb-2">➕ Add Event</a>
          <a href="/manage-business/products" className="btn btn-info btn-sm me-2 mb-2">🏷️ Add Product</a>
          <a href="/manage-business/record-sale" className="btn btn-success btn-sm mb-2">💰 Add Sale</a>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="row g-3 text-center">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card shadow-sm rounded text-white bg-primary">
            <div className="card-body">
              <h6 className="fw-bold">Total Sales</h6>
              <p className="display-6 fw-bold">${salesTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card shadow-sm rounded text-white bg-danger">
            <div className="card-body">
              <h6 className="fw-bold">Total Expenses</h6>
              <p className="display-6 fw-bold">-${expensesTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12 col-sm-12">
          <div className={`card shadow-sm rounded text-white ${profit >= 0 ? "bg-success" : "bg-danger"}`}>
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