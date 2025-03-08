import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Register.css"; // Import custom styles

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post("https://craftipro.com/register.php", {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: password,
      BusinessName: businessName || null
    })
    .then(response => {
      if (response.data.message === "Registration successful") {
        navigate('/login');
      } else {
        setMessage(response.data.error);
      }
    })
    .catch(error => console.error("Error registering:", error));
  };

  return (
    <div className="register-container">
      <h2>📝 Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input 
          type="text" 
          className="input-field" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          className="input-field" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          className="input-field" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Business Name (Optional)" 
          value={businessName} 
          onChange={(e) => setBusinessName(e.target.value)} 
        />
        <button type="submit" className="custom-btn">Register</button>
      </form>
      {message && <div className="info-message">{message}</div>}
    </div>
  );
};

export default Register;

