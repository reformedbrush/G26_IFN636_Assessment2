import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import RequestStatusBadge from "../components/RequestStatusBadge";
import styles from "./AdminRequests.module.css";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected", "Completed"];

function AdminRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [busyId, setBusyId] = useState(null);

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
        const params =
          statusFilter !== "All" ? { status: statusFilter } : undefined;
        const res = await axiosInstance.get("/api/requests", {
          headers: authHeaders,
          params,
        });
        if (!cancelled) setRequests(res.data);
      } catch (err) {
        if (!cancelled) alert("Could not load requests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.token, authHeaders, statusFilter]);

  const updateStatus = async (id, action) => {
    setBusyId(id);
    try {
      const res = await axiosInstance.put(
        `/api/requests/${id}/${action}`,
        {},
        { headers: authHeaders }
      );
      setRequests((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      alert(err.response?.data?.message || `Could not ${action} request.`);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p>Loading requests…</p>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage requests</h1>
        <p className={styles.subtitle}>
          Review and update garden activity requests from all users.
        </p>

        <div className={styles.toolbar}>
          <div className={styles.filterGroup}>
            <span className={styles.label}>Filter by status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Requests</h2>
          </div>
          <div className={styles.cardBody}>
            {requests.length === 0 ? (
              <p style={{ padding: "12px 18px" }}>
                No requests match this filter.
              </p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Plot</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className={styles.actionsCol}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id}>
                        <td>
                          {req.user?.name || "—"}
                          <br />
                          <span className={styles.muted}>
                            {req.user?.email}
                          </span>
                        </td>
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
                          <div className={styles.actionRow}>
                            {req.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  disabled={busyId === req._id}
                                  onClick={() => updateStatus(req._id, "approve")}
                                  className={`${styles.button} ${styles.btnApprove}`}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  disabled={busyId === req._id}
                                  onClick={() => updateStatus(req._id, "reject")}
                                  className={`${styles.button} ${styles.btnReject}`}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {req.status === "Approved" && (
                              <button
                                type="button"
                                disabled={busyId === req._id}
                                onClick={() => updateStatus(req._id, "complete")}
                                className={`${styles.button} ${styles.btnComplete}`}
                              >
                                Complete
                              </button>
                            )}
                          </div>
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

export default AdminRequests;
