import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./RecordSale.css"; // Import custom styles

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

  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.ProductsID === parseInt(selectedProduct));
      if (product) {
        const productPrice = parseFloat(product.ProductPrice);
        setRevenue((productPrice * quantity).toFixed(2));
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
    <div className="record-sale-container">
      <h2>💰 Record Sale</h2>

      {/* Sale Type Selection */}
      <div className="form-group">
        <label>Sale Type</label>
        <select className="input-field" value={isDirectSale} onChange={(e) => setIsDirectSale(e.target.value === "true")}>
          <option value="false">Linked to an Event</option>
          <option value="true">Direct Sale (No Event)</option>
        </select>
      </div>

      {/* Event Selection */}
      {!isDirectSale && (
        <div className="form-group">
          <label>Select Event</label>
          <select className="input-field" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required={!isDirectSale}>
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
      <form onSubmit={handleRecordSale} className="record-sale-form">
        <div className="form-group">
          <label>Product</label>
          <select className="input-field" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
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

        <div className="form-group">
          <label>Quantity Sold</label>
          <input 
            type="number" 
            className="input-field" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Total Revenue ($)</label>
          <input 
            type="number" 
            className="input-field" 
            value={revenue} 
            readOnly 
            required 
          />
        </div>

        <div className="form-group">
          <label>Sale Date</label>
          <input type="date" className="input-field" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
        </div>

        <button type="submit" className="custom-btn">Record Sale</button>
      </form>

      {message && <div className="info-message">{message}</div>}
    </div>
  );
};

export default RecordSale;


