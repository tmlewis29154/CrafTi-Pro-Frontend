import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesTracking.css';

const SalesTracking = ({ user }) => { 
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("User not logged in. Cannot fetch sales.");
      return;
    }

    axios
      .get(`https://craftipro.com/get_sales.php?UserID=${user.UserID}`)
      .then((response) => {
        console.log("Fetched Sales Data:", response.data);
        setSales(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
        setSales([]);
      });
  }, [user]);

  return (
    <div className="sales-container">
      <h2 className="sales-title">📊 Sales Tracking</h2>

      {sales.length > 0 ? (
        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Sale Date</th>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.SalesID}>
                  <td>{sale.SalesID}</td>
                  <td>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                  <td>{sale.ProductName || "Unknown Product"}</td>
                  <td>{sale.QuantitySold}</td>
                  <td>${parseFloat(sale.Revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-text">No sales data available.</p>
      )}
    </div>
  );
};

export default SalesTracking;




