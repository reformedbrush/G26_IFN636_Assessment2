import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import RequestStatusBadge from "../components/RequestStatusBadge";
import styles from "./MyRequests.module.css";

function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${user?.token}` }),
    [user?.token]
  );

  useEffect(() => {
    if (!user?.token) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/requests", {
          headers: authHeaders,
        });
        if (!cancelled) setRequests(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) alert("Could not load your requests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.token, authHeaders]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pending request?")) return;
    try {
      await axiosInstance.delete(`/api/requests/${id}`, {
        headers: authHeaders,
      });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete request.");
    }
  };

  if (loading) return <p>Loading requests…</p>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My requests</h1>
            <p className={styles.subtitle}>
              Track activity requests for your booked plots.
            </p>
          </div>
          <Link to="/create-request" className={styles.primaryLink}>
            + New request
          </Link>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Your requests</h2>
          </div>
          <div className={styles.cardBody}>
            {requests.length === 0 ? (
              <p className={styles.emptyState}>
                No requests yet. Create one to get started.
              </p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Plot</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className={styles.actionsCol} />
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id}>
                        <td>{req.plot?.name || "—"}</td>
                        <td>{req.requestType}</td>
                        <td>{req.description}</td>
                        <td>
                          <RequestStatusBadge status={req.status} />
                        </td>
                        <td>
                          {req.createdAt
                            ? new Date(req.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className={styles.actionsCol}>
                          {req.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleDelete(req._id)}
                              className={styles.dangerButton}
                            >
                              Delete
                            </button>
                          )}
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

export default MyRequests;
