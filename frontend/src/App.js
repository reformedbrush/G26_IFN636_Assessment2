import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Plots from './pages/Plots';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>

        {/* Sidebar */}
        <div style={{ width: "220px", background: "#1f2937", color: "white", padding: "20px" }}>
          <h2><b>Garden Manager</b> </h2>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
  <p style={{ marginTop: "10px" }}>Dashboard</p>
</Link>

<Link to="/plots" style={{ color: "white", textDecoration: "none" }}>
  <p>Manage Plot</p>
</Link>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plots" element={<Plots />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;