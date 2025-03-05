import React from 'react';
import { Link } from 'react-router-dom';

const ManageBusiness = () => {
  return (
    <div className="container mt-4">
      <h2>⚙️ Manage Your Business</h2>
      <p>Select a section to manage:</p>
      <div className="list-group">
        <Link to="/manage-business/products" className="list-group-item list-group-item-action">
          📦 Product Management
        </Link>
        <Link to="/manage-business/events" className="list-group-item list-group-item-action">
          📅 Event Management
        </Link>
      </div>
    </div>
  );
};

export default ManageBusiness;
