import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Plots from './pages/Plots';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import PlotBooking from './pages/PlotBooking';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';

function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      
      {!hideSidebar && (
        <div style={{ width: "220px", background: "#1f2937", color: "white", padding: "20px", display: "flex", flexDirection: "column" }}>
          <h2><b>Garden Manager</b> </h2>

          <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
            <p style={{ marginTop: "10px" }}>Dashboard</p>
          </Link>
          {user && (
  <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
    <p>Profile</p>
  </Link>
)}

          {user?.role === "user" && (
            <Link to="/user-plots" style={{ color: "white", textDecoration: "none" }}>
              <p>Book Plot</p>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/plots" style={{ color: "white", textDecoration: "none" }}>
              <p>Manage Plot</p>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              marginTop: "auto",
              padding: "8px 12px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route 
  path="/dashboard" 
  element={
    user?.role === "admin"
      ? <Dashboard />
      : <UserDashboard />
  } 
/>    
<Route 
  path="/profile" 
  element={
    user 
      ? <Profile /> 
      : <Navigate to="/login" />
  } 
/>   
<Route path="/plots" 
  element={
    user?.role === "admin"
      ? <Plots />
      : <Navigate to="/login" />
  } 
/>
          <Route
            path="/user-plots"
            element={
              user?.role === "user" ? (
                <PlotBooking />
              ) : user?.role === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;