import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesTracking = ({ user }) => { // ✅ Accept `user` as a prop
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!user || !user.UserID) {
      console.error("User not logged in. Cannot fetch sales.");
      return;
    }

    axios
      .get(`https://craftipro.com/get_sales.php?UserID=${user.UserID}`)
      .then((response) => {
        console.log("Fetched Sales Data:", response.data); // ✅ Debugging
        setSales(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
        setSales([]); // ✅ Set empty array on error
      });
  }, [user]);

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h2>📊 Sales Tracking</h2>
      </div>
      <div className="card-body">
        {sales.length > 0 ? (
          <table className="table table-striped">
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
        ) : (
          <p className="text-muted">No sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default SalesTracking;



