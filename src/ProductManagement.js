import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./ProductManagement.css"; // Import custom styles

const ProductManagement = ({ user }) => {  
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    if (!user) return;

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

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!user) return;

    const newProduct = {
      UserID: user.UserID,
      ProductName: productName,
      ProductQuantity: productQuantity,
      ProductPrice: productPrice
    };

    axios.post("https://craftipro.com/add_product.php", newProduct, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      console.log("Product Added:", response.data);
      fetchProducts();
      setProductName('');
      setProductQuantity('');
      setProductPrice('');
    })
    .catch(error => console.error("Error adding product:", error));
  };

  return (
    <div className="product-container">
      <h2>📦 Product Management</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" className="input-field" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" className="input-field" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" className="input-field" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
        </div>
        <button type="submit" className="custom-btn">Add Product</button>
      </form>

      {/* Product List */}
      <h3>Current Inventory</h3>
      <ul className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <li key={product.ProductsID} className="product-item">
              <strong>{product.ProductName}</strong> - <span className="in-stock">{product.ProductQuantity} in stock</span> - ${product.ProductPrice}
            </li>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductManagement;



