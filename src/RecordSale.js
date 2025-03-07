import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecordSale = ({ user }) => {  
  const [products, setProducts] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [revenue, setRevenue] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDirectSale, setIsDirectSale] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchEvents();
  }, []);

  const fetchProducts = () => {
    axios.get(`https://craftipro.com/get_products.php?UserID=${user.UserID}`)
      .then(response => {
        console.log("Fetched Products:", response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  };

  const fetchEvents = () => {
    if (!user || !user.UserID) {
        console.error("User not found, skipping event fetch.");
        return;
    }

    axios.get(`https://craftipro.com/get_event.php?UserID=${user.UserID}`)
      .then(response => {
        console.log("Fetched Events for Sale Form:", response.data);
        setEvents(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setEvents([]);
      });
  };

  // Auto-calculate revenue when product or quantity changes
  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.ProductsID === parseInt(selectedProduct));
      if (product) {
        const productPrice = parseFloat(product.ProductPrice); // Convert to number
        setRevenue((productPrice * quantity).toFixed(2)); // Automatically calculates revenue
      } else {
        setRevenue('');
      }
    }
  }, [selectedProduct, quantity, products]);

  const handleRecordSale = (e) => {
    e.preventDefault();

    if (!user || !user.UserID) {
      setMessage("User not logged in. Please log in and try again.");
      return;
    }

    const saleData = {
      UserID: user.UserID,
      EventID: isDirectSale ? null : selectedEvent,
      ProductsID: selectedProduct,
      QuantitySold: quantity,
      Revenue: revenue,
      SaleDate: saleDate 
    };

    axios.post("https://craftipro.com/api/add_sale.php", saleData, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      console.log("Sale Recorded:", response.data);
      setMessage("Sale recorded successfully!");
      setSelectedProduct('');
      setQuantity('');
      setRevenue('');
      setSaleDate(new Date().toISOString().split('T')[0]); 
      setIsDirectSale(false);
      setSelectedEvent('');
    })
    .catch(error => console.error("Error recording sale:", error));
  };

  return (
    <div className="container mt-4">
      <h2>💰 Record Sale</h2>

      {/* Sale Type Selection */}
      <div className="mb-3">
        <label className="form-label">Sale Type</label>
        <select className="form-control" value={isDirectSale} onChange={(e) => setIsDirectSale(e.target.value === "true")}>
          <option value="false">Linked to an Event</option>
          <option value="true">Direct Sale (No Event)</option>
        </select>
      </div>

      {/* Event Selection */}
      {!isDirectSale && (
        <div className="mb-3">
          <label className="form-label">Select Event</label>
          <select className="form-control" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required={!isDirectSale}>
            <option value="">Select an Event</option>
            {events.map(event => (
              <option key={event.EventID} value={event.EventID}>
                {event.EventName} - {new Date(event.EventDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Sale Form */}
      <form onSubmit={handleRecordSale} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Product</label>
          <select className="form-control" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
            <option value="">Select a Product</option>
            {products.length > 0 ? (
              products.map(product => (
                <option key={product.ProductsID} value={product.ProductsID}>
                  {product.ProductName} - ${parseFloat(product.ProductPrice).toFixed(2)}
                </option>
              ))
            ) : (
              <option disabled>No products available</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity Sold</label>
          <input 
            type="number" 
            className="form-control" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Revenue ($)</label>
          <input 
            type="number" 
            className="form-control" 
            value={revenue} 
            readOnly 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sale Date</label>
          <input type="date" className="form-control" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-success">Record Sale</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default RecordSale;

