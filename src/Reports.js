import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register required Chart.js components
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

    let analyticsUrl = `https://craftipro.com/analytics.php?UserID=${user.UserID}&timeframe=${timeframe}`;
    let topProductsUrl = `https://craftipro.com/get_top_selling_products.php?UserID=${user.UserID}`;

    if (timeframe === "custom" && customStartDate && customEndDate) {
      analyticsUrl += `&startDate=${customStartDate}&endDate=${customEndDate}`;
    }

    console.log("🔍 Fetching Reports with URL:", analyticsUrl);
    console.log("🔍 Fetching Top-Selling Products with URL:", topProductsUrl);

    // Fetch Analytics Data
    axios.get(analyticsUrl)
      .then(response => {
        console.log("Reports API Full Response:", response.data);
        setSalesData(Array.isArray(response.data.sales) ? response.data.sales : []);
        setExpensesData(Array.isArray(response.data.expenses) ? response.data.expenses : []);
        setProfitData(Array.isArray(response.data.profit_over_time) ? response.data.profit_over_time : []);
        setEventProfits(Array.isArray(response.data.most_profitable_events) ? response.data.most_profitable_events : []);
      })
      .catch(error => {
        console.error("Error fetching analytics:", error);
        setSalesData([]);
        setExpensesData([]);
        setProfitData([]);
        setEventProfits([]);
      });

    // Fetch Top-Selling Products Data
    axios.get(topProductsUrl)
      .then(response => {
        console.log("🔥 Top-Selling Products Response:", response.data);
        setTopProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error fetching top-selling products:", error);
        setTopProducts([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">📊 Business Reports</h2>

      {/* Timeframe Selection */}
      <div className="form-group">
        <label>Select Timeframe:</label>
        <select
          className="dropdown-select"
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

      {/* Custom Date Range Inputs */}
      {timeframe === "custom" && (
        <div className="date-range">
          <input
            type="date"
            className="input-field"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <input
            type="date"
            className="input-field"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}

      {/* Show Loading Indicator */}
      {loading && <p className="loading-text">Loading data...</p>}

      {/* 📈 Sales, Expenses, & Net Profit Over Time */}
      <div className="reports-card">
        <h5 className="reports-card-title">📈 Sales, Expenses, & Net Profit Over Time</h5>
        {salesData.length > 0 || expensesData.length > 0 || profitData.length > 0 ? (
          <div className="chart-container">
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
                    data: profitData.map(entry => Number(entry.total) || 0),
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
          <p className="no-data-text">No data available.</p>
        )}
      </div>

      {/* 🔥 Top-Selling Products */}
      <div className="reports-card">
        <h5 className="reports-card-title">🔥 Top-Selling Products</h5>
        {topProducts.length > 0 ? (
          <ul className="list">
            {topProducts.map((product, index) => (
              <li key={index} className="list-item">
                <strong>{product.name}</strong>
                <span className="badge">{Number(product.total_sold) || 0} units</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data-text">No sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;

