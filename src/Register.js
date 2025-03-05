import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container mt-4">
      <h2>📝 Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" className="form-control mb-2" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" className="form-control mb-2" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" className="form-control mb-2" placeholder="Business Name (Optional)" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {message && <div className="alert alert-danger mt-2">{message}</div>}
    </div>
  );
};

export default Register;
