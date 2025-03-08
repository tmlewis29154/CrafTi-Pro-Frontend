import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"; // Import new CSS file for styling

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("https://craftipro.com/login.php", { Email: email, Password: password })
      .then(response => {
        if (response.data.message === "Login successful") {
          setUser({
            firstName: response.data.FirstName,
            businessName: response.data.BusinessName || null // Handle case where BusinessName is NULL
          });
          navigate('/dashboard');
        } else {
          setMessage(response.data.error);
        }
      })
      .catch(error => {
        console.error("Error logging in:", error);
        setMessage("Login failed. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <h2>🔑 Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="custom-btn blue">Login</button>
      </form>

      {message && <div className="error-message">{message}</div>}
    </div>
  );
};

export default Login;

