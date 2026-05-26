import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Plots from './pages/Plots';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import PlotBooking from './pages/PlotBooking';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import AdminRequests from './pages/AdminRequests';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AdminEvents from './pages/AdminEvents';

function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e5e7eb" }}>
      {!hideSidebar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "220px",
            background: "#111827",
            color: "white",
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "4px 0 12px rgba(15,23,42,0.45)",
            zIndex: 40,
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              <b>Garden Manager</b>
            </h2>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
              <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Dashboard</p>
            </Link>
            {user && (
              <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
                <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Profile</p>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
            <p style={{ marginTop: "10px" }}>Dashboard</p>
          </Link>
          {user && (
  <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
    <p>Profile</p>
  </Link>
)}

          {user && (
            <Link to="/events" style={{ color: "white", textDecoration: "none" }}>
              <p>Events</p>
            </Link>
          )}

          {user?.role === "user" && (
            <>
              <Link to="/user-plots" style={{ color: "white", textDecoration: "none" }}>
                <p>Book Plot</p>
              </Link>
              <Link to="/my-requests" style={{ color: "white", textDecoration: "none" }}>
                <p>My Requests</p>
              </Link>
            )}

            {user && (
              <Link to="/events" style={{ color: "white", textDecoration: "none" }}>
                <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Events</p>
              </Link>
            )}

            {user?.role === "user" && (
              <>
                <Link to="/user-plots" style={{ color: "white", textDecoration: "none" }}>
                  <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Book Plot</p>
                </Link>
                <Link to="/my-requests" style={{ color: "white", textDecoration: "none" }}>
                  <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>My Requests</p>
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link to="/plots" style={{ color: "white", textDecoration: "none" }}>
                  <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Manage Plot</p>
                </Link>
                <Link to="/admin/requests" style={{ color: "white", textDecoration: "none" }}>
                  <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Manage Requests</p>
                </Link>
                <Link to="/admin/events" style={{ color: "white", textDecoration: "none" }}>
                  <p style={{ margin: 0, padding: "8px 10px", borderRadius: "6px" }}>Manage Events</p>
                </Link>
              </>
            )}
          </nav>
              <Link to="/admin/events" style={{ color: "white", textDecoration: "none" }}>
                <p>Manage Events</p>
              </Link>
            </>
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
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          marginLeft: hideSidebar ? 0 : "220px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main style={{ flex: 1, padding: "0" }}>
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
          <Route
            path="/create-request"
            element={
              user?.role === "user" ? (
                <CreateRequest />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/my-requests"
            element={
              user?.role === "user" ? (
                <MyRequests />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/requests"
            element={
              user?.role === "admin" ? (
                <AdminRequests />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/events"
            element={user ? <Events /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/events/:id"
            element={user ? <EventDetails /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin/events"
            element={
              user?.role === "admin" ? (
                <AdminEvents />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        </main>
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
