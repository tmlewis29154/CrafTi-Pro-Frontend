import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ManageBusiness from "./ManageBusiness";
import ProductManagement from "./ProductManagement";
import EventManagement from "./EventManagement";
import RecordSale from "./RecordSale";
import AddExpense from "./AddExpense";
import ExpenseTracking from "./ExpenseTracking";
import CalendarPage from "./CalendarPage";
import Dashboard from "./Dashboard";
import Reports from "./Reports";
import LoginRegister from "./LoginRegister";
import EditEvent from "./EditEvent";
import "./App.css"; // Import custom styles

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const navigate = useNavigate();

  // Store user in local storage on login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Remove user from local storage on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Responsive Navbar */}
      {user && (
        <nav className="custom-navbar">
          <div className="navbar-content">
            <Link className="custom-brand" to="/">
              CrafTi Pro
            </Link>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/calendar">Calendar</Link>
              <Link to="/manage-business">Manage Business</Link>
              <Link to="/reports">Reports</Link>
            </div>
            <div className="user-info">
              <span>Welcome, {user?.firstName}{user?.businessName ? ` | ${user.businessName}` : ""}</span>
              <button className="custom-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="main-container">
        <Routes>
          <Route path="/" element={<LoginRegister setUser={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/calendar" element={user ? <CalendarPage user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business" element={user ? <ManageBusiness user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/products" element={user ? <ProductManagement user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/events" element={user ? <EventManagement user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/events/:eventId/record-sale" element={user ? <RecordSale user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/events/:eventId/add-expense" element={user ? <AddExpense user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/events/:eventId/edit" element={user ? <EditEvent user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/expenses" element={user ? <ExpenseTracking user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/manage-business/record-sale" element={user ? <RecordSale user={user} /> : <LoginRegister setUser={handleLogin} />} />
          <Route path="/reports" element={user ? <Reports user={user} /> : <LoginRegister setUser={handleLogin} />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="custom-footer">
        <p>© 2025 CrafTi Pro | Built for small business owners</p>
      </footer>
    </>
  );
}

export default App;
