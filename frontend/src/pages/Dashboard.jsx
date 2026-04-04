import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

function Dashboard() {
  const [plots, setPlots] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const plotsRes = await axiosInstance.get("/api/plots");
      const usersRes = await axiosInstance.get("/api/auth/users");

      setPlots(plotsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Dashboard</h1>

      {/* Plots Table */}
      <h2>Plots</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Size</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Booked By</th>
          </tr>
        </thead>
        <tbody>
          {plots.map((plot) => (
            <tr key={plot._id}>
              <td style={tdStyle}>{plot.name}</td>
              <td style={tdStyle}>{plot.size}</td>
              <td style={tdStyle}>{plot.status}</td>
              <td style={tdStyle}>
                {plot.bookedBy ? plot.bookedBy.name : "Not booked"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Users Table */}
      <h2>Users</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

export default Dashboard;