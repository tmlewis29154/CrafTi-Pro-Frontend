import React from 'react';
import { Link } from 'react-router-dom';
import "./ManageBusiness.css"; // Import custom styles

const ManageBusiness = () => {
  return (
    <div className="manage-business-container">
      <h2>⚙️ Manage Your Business</h2>
      <p>Select a section to manage:</p>

      <div className="business-links">
        <Link to="/manage-business/products" className="business-link">
          📦 Product Management
        </Link>
        <Link to="/manage-business/events" className="business-link">
          📅 Event Management
        </Link>
      </div>
    </div>
  );
};

export default ManageBusiness;

