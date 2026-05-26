import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import styles from "./Dashboard.module.css";

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

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/api/auth/users/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const totalUsers = users.length;
  const totalPlots = plots.length;
  const occupiedPlots = plots.filter((p) => p.status === "Occupied").length;
  const availablePlots = plots.filter((p) => p.status === "Available").length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Overview of users and plot occupancy.
            </p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <StatCard label="Total Users" value={totalUsers} />
          <StatCard label="Total Plots" value={totalPlots} />
          <StatCard label="Occupied Plots" value={occupiedPlots} />
          <StatCard label="Available Plots" value={availablePlots} />
        </div>

        <DashboardCard title="Plots">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Booked By</th>
                </tr>
              </thead>
              <tbody>
                {plots.map((plot) => (
                  <tr key={plot._id}>
                    <td>{plot.name}</td>
                    <td>{plot.size}</td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${
                          plot.status === "Occupied"
                            ? styles.statusOccupied
                            : plot.status === "Available"
                            ? styles.statusAvailable
                            : styles.statusOther
                        }`}
                      >
                        {plot.status}
                      </span>
                    </td>
                    <td>{plot.bookedBy ? plot.bookedBy.name : "Not booked"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Users">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className={styles.colActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className={styles.colActions}>
                      <button
                        type="button"
                        onClick={() => deleteUser(user._id)}
                        className={styles.dangerButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function DashboardCard({ title, children }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}

export default Dashboard;
