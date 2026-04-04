import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const thStyle = {
  backgroundColor: "#f3f4f6",
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

function PlotBooking() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/plots");
        if (!cancelled) setPlots(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) alert("Could not load plots. Try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const uid = user?.id ?? user?._id;

  const availablePlots = useMemo(() => {
    return plots.filter(
      (p) => p.status === "Available" && !p.bookedBy
    );
  }, [plots]);

  const myPlots = useMemo(() => {
    if (uid == null) return [];
    return plots.filter(
      (p) =>
        p.bookedBy &&
        String(p.bookedBy._id || p.bookedBy) === String(uid)
    );
  }, [plots, uid]);

  const bookPlot = async (plotId) => {
    if (!user?.id && !user?._id) return;
    setBusyId(plotId);
    try {
      const res = await axiosInstance.put(`/api/plots/${plotId}`, {
        bookedBy: user.id ?? user._id,
        status: "Occupied",
      });
      setPlots((prev) => prev.map((p) => (p._id === plotId ? res.data : p)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Could not book this plot.");
    } finally {
      setBusyId(null);
    }
  };

  const releasePlot = async (plotId) => {
    setBusyId(plotId);
    try {
      const res = await axiosInstance.put(`/api/plots/${plotId}`, {
        bookedBy: null,
        status: "Available",
      });
      setPlots((prev) => prev.map((p) => (p._id === plotId ? res.data : p)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Could not cancel this booking.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading plots…</p>;
  }

  return (
    <div style={{ maxWidth: "960px" }}>
      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>Book a plot</h1>
      <p style={{ color: "#4b5563", marginBottom: "24px" }}>
        Choose an available plot below.
      </p>

      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Available plots</h2>
      {availablePlots.length === 0 ? (
        <p style={{ marginBottom: "28px" }}>No plots available right now.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            marginBottom: "36px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Plants</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle} />
            </tr>
          </thead>
          <tbody>
            {availablePlots.map((plot) => (
              <tr key={plot._id}>
                <td style={tdStyle}>{plot.name}</td>
                <td style={tdStyle}>{plot.size}</td>
                <td style={tdStyle}>{plot.plants || "—"}</td>
                <td style={tdStyle}>{plot.location || "—"}</td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    disabled={busyId === plot._id}
                    onClick={() => bookPlot(plot._id)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: busyId === plot._id ? "wait" : "pointer",
                      opacity: busyId === plot._id ? 0.7 : 1,
                    }}
                  >
                    {busyId === plot._id ? "Booking…" : "Book"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ fontSize: "18px", marginBottom: "12px", marginTop: "8px" }}>
        Your bookings
      </h2>
      <p style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}>
        Release a plot here if you no longer need it. 
      </p>
      {myPlots.length === 0 ? (
        <p style={{ marginBottom: "16px" }}>You have no bookings yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            marginBottom: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle} />
            </tr>
          </thead>
          <tbody>
            {myPlots.map((plot) => (
              <tr key={plot._id}>
                <td style={tdStyle}>{plot.name}</td>
                <td style={tdStyle}>{plot.size}</td>
                <td style={tdStyle}>{plot.status}</td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    disabled={busyId === plot._id}
                    onClick={() => releasePlot(plot._id)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: busyId === plot._id ? "wait" : "pointer",
                      opacity: busyId === plot._id ? 0.7 : 1,
                    }}
                  >
                    {busyId === plot._id ? "…" : "Cancel"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlotBooking;
