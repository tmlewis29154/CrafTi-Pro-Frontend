import { Route, Routes, Link, useNavigate } from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import ManageBusiness from './ManageBusiness';
import ProductManagement from './ProductManagement';
import EventManagement from './EventManagement';
import RecordSale from './RecordSale';
import AddExpense from './AddExpense';
import ExpenseTracking from './ExpenseTracking';
import CalendarPage from './CalendarPage';
import Dashboard from './Dashboard';
import Reports from './Reports';
import LoginRegister from './LoginRegister'; 
import EditEvent from "./EditEvent";


function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const navigate = useNavigate();

  // ✅ Store user in local storage on login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Remove user from local storage on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <>
      {user && ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">CrafTi Pro</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto">
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/manage-business">Manage Business</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
              </ul>

              {/* ✅ Updated User Display with Logout Button */}
              <div className="navbar-text ms-auto d-flex align-items-center">
                <span className="me-3">
                  Welcome, {user?.firstName}{user?.businessName ? ` | ${user.businessName}` : ""}
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="container mt-4">
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

      {/* ✅ Footer is always visible */}
      <footer className="bg-primary text-white text-center py-3 mt-4">
        <div className="container">
          © 2025 CrafTi Pro | Built for small business owners
        </div>
      </footer>
    </>
  );
}

export default App;

