import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManagement = ({ user }) => {  
  const [products, setProducts] = useState([]);  // ✅ Ensure products is an array
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
        console.log("Fetched Products:", response.data); // ✅ Debugging log
        setProducts(Array.isArray(response.data) ? response.data : []); // ✅ Ensure it's an array
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setProducts([]); // ✅ Set as empty array on error
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
      fetchProducts();  // ✅ Refresh products to show updated stock
      setProductName('');
      setProductQuantity('');
      setProductPrice('');
    })
    .catch(error => console.error("Error adding product:", error));
  };

  return (
    <div className="container mt-4">
      <h2>📦 Product Management</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" className="form-control" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input type="number" className="form-control" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>

      {/* Product List */}
      <h3>Current Inventory</h3>
      <ul className="list-group">
        {products.length > 0 ? (
          products.map(product => (
            <li key={product.ProductsID} className="list-group-item">
              <strong>{product.ProductName}</strong> - <span className="text-success fw-bold">{product.ProductQuantity} in stock</span> - ${product.ProductPrice}
            </li>
          ))
        ) : (
          <p className="text-muted">No products found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductManagement;


