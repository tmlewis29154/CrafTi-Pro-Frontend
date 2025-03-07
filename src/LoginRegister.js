import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          // Store complete user data including UserID
          const loggedInUser = {
            UserID: response.data.UserID,  // Ensure UserID is stored
            firstName: response.data.FirstName,
            lastName: response.data.LastName,
            businessName: response.data.BusinessName || null,
          };

          // Update global state
          setUser(loggedInUser);
          
          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(loggedInUser)); 

          // Redirect to dashboard
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
    <div className="container mt-5 text-center">
      <h2>{isRegister ? "Create an Account" : "Welcome to CrafTi Pro"}</h2>
      <p>{isRegister ? "Register to start managing your business." : "Log in to access your dashboard."}</p>
      
      <div className="card mx-auto p-4" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input type="text" className="form-control mb-2" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type="text" className="form-control mb-2" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input type="text" className="form-control mb-2" placeholder="Business Name (Optional)" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </>
          )}
          <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary w-100">{isRegister ? "Register" : "Login"}</button>
        </form>
        
        {message && <div className="alert alert-danger mt-2">{message}</div>}

        <p className="mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}  
          <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;


