import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import styles from "./PlotBooking.module.css";

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
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Book a plot</h1>
        <p className={styles.subtitle}>Choose an available plot below.</p>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Available plots</h2>
          </div>
          <div className={styles.cardBody}>
            {availablePlots.length === 0 ? (
              <p className={styles.emptyState}>No plots available right now.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Plants</th>
                      <th>Location</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {availablePlots.map((plot) => (
                      <tr key={plot._id}>
                        <td>{plot.name}</td>
                        <td>{plot.size}</td>
                        <td>{plot.plants || "—"}</td>
                        <td>{plot.location || "—"}</td>
                        <td className={styles.actionsCol}>
                          <button
                            type="button"
                            disabled={busyId === plot._id}
                            onClick={() => bookPlot(plot._id)}
                            className={styles.primaryButton}
                          >
                            {busyId === plot._id ? "Booking…" : "Book"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Your bookings</h2>
            <p className={styles.cardHint}>
              Release a plot here if you no longer need it.
            </p>
          </div>
          <div className={styles.cardBody}>
            {myPlots.length === 0 ? (
              <p className={styles.emptyState}>You have no bookings yet.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {myPlots.map((plot) => (
                      <tr key={plot._id}>
                        <td>{plot.name}</td>
                        <td>{plot.size}</td>
                        <td>{plot.status}</td>
                        <td className={styles.actionsCol}>
                          <button
                            type="button"
                            disabled={busyId === plot._id}
                            onClick={() => releasePlot(plot._id)}
                            className={styles.dangerButton}
                          >
                            {busyId === plot._id ? "…" : "Cancel"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PlotBooking;
