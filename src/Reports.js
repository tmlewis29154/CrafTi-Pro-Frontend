import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// ✅ Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = ({ user }) => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [eventProfits, setEventProfits] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("current_month"); // Default: Current Month
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, customStartDate, customEndDate]);

  const fetchAnalytics = () => {
    setLoading(true);
    let url = `https://craftipro.com/analytics.php?UserID=${user.UserID}&timeframe=${timeframe}`;
    
    if (timeframe === "custom" && customStartDate && customEndDate) {
      url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
    }

    console.log("🔍 Fetching Reports with URL:", url);

    axios.get(url)
      .then(response => {
        console.log("✅ Reports API Full Response:", response.data);

        // ✅ Correct API response mapping
        setSalesData(Array.isArray(response.data.sales) ? response.data.sales : []);
        setExpensesData(Array.isArray(response.data.expenses) ? response.data.expenses : []);
        setProfitData(Array.isArray(response.data.profit) ? response.data.profit : []);
        setEventProfits(Array.isArray(response.data.most_profitable_events) ? response.data.most_profitable_events : []);
        setTopProducts(Array.isArray(response.data.top_selling_products) ? response.data.top_selling_products : []);
      })
      .catch(error => {
        console.error("❌ Error fetching analytics:", error);

        // ✅ Prevents app crash due to undefined values
        setSalesData([]);
        setExpensesData([]);
        setProfitData([]);
        setEventProfits([]);
        setTopProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log("📊 Updated State - Sales Data:", salesData);
    console.log("📊 Updated State - Expenses Data:", expensesData);
    console.log("📊 Updated State - Profit Data:", profitData);
  }, [salesData, expensesData, profitData]);

  return (
    <div className="container mt-4">
      <h2 className="text-primary fw-bold">📊 Business Reports</h2>

      {/* ✅ Timeframe Selection */}
      <div className="mb-3">
        <label className="fw-bold">Select Timeframe:</label>
        <select 
          className="form-select"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="current_month">📅 Current Month</option>
          <option value="previous_month">📅 Previous Month</option>
          <option value="last_90_days">📅 Last 90 Days</option>
          <option value="year_to_date">📅 Year to Date</option>
          <option value="custom">📅 Custom Date Range</option>
        </select>
      </div>

      {/* ✅ Custom Date Range Inputs */}
      {timeframe === "custom" && (
        <div className="d-flex gap-3">
          <input 
            type="date" 
            className="form-control"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <input 
            type="date" 
            className="form-control"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}

      {/* ✅ Show Loading Indicator */}
      {loading && <p className="text-center text-muted">Loading data...</p>}

      {/* 📈 Sales, Expenses, & Net Profit Over Time */}
      <div className="card shadow-lg rounded mb-4">
        <div className="card-body">
          <h5 className="card-title text-center">📈 Sales, Expenses, & Net Profit Over Time</h5>
          {salesData.length > 0 || expensesData.length > 0 || profitData.length > 0 ? (
            <div style={{ height: "400px" }}> {/* ✅ Fix chart height */}
              <Line
                data={{
                  labels: [...new Set([...salesData.map(entry => entry.date), ...expensesData.map(entry => entry.date), ...profitData.map(entry => entry.date)])].sort(),
                  datasets: [
                    {
                      label: "Total Sales",
                      data: salesData.map(entry => Number(entry.total) || 0),
                      borderColor: "blue",
                      backgroundColor: "rgba(0, 0, 255, 0.2)",
                      fill: true,
                    },
                    {
                      label: "Total Expenses",
                      data: expensesData.map(entry => Number(entry.total) || 0),
                      borderColor: "red",
                      backgroundColor: "rgba(255, 0, 0, 0.2)",
                      fill: true,
                    },
                    {
                      label: "Net Profit",
                      data: profitData.map(entry => Number(entry.total) || 0), // ✅ Ensure negatives are included
                      borderColor: "green",
                      backgroundColor: "rgba(0, 255, 0, 0.2)",
                      fill: true,
                  }
                  ],
                }}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    x: { type: 'category' },
                    y: { beginAtZero: false }
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-muted text-center">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;






