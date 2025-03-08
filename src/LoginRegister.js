import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./LoginRegister.css"; // Import custom styling

const LoginRegister = ({ setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "register.php" : "login.php";
    const userData = {
      Email: email,
      Password: password,
      ...(isRegister && { FirstName: firstName, LastName: lastName, BusinessName: businessName })
    };

    axios.post(`https://craftipro.com/${endpoint}`, userData)
      .then(response => {
        console.log("Login/Register Response:", response.data);

        if (response.data.message.includes("successful")) {
          const loggedInUser = {
            UserID: response.data.UserID,
            firstName: response.data.FirstName,
            lastName: response.data.LastName,
            businessName: response.data.BusinessName || null,
          };

          setUser(loggedInUser);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          navigate('/dashboard');
        } else {
          setMessage(response.data.error);
        }
      })
      .catch(error => {
        console.error("Login/Register Error:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? "Create an Account" : "Welcome to CrafTi Pro"}</h2>
      <p>{isRegister ? "Register to start managing your business." : "Log in to access your dashboard."}</p>
      
      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input type="text" className="input-field" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type="text" className="input-field" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input type="text" className="input-field" placeholder="Business Name (Optional)" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </>
          )}
          <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="input-field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn">{isRegister ? "Register" : "Login"}</button>
        </form>
        
        {message && <div className="error-message">{message}</div>}

        <p className="switch-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}  
          <button className="switch-btn" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;



