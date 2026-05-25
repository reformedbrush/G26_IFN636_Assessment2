import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import RequestStatusBadge from "../components/RequestStatusBadge";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected", "Completed"];

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
    <div style={{ padding: "20px", maxWidth: "1100px" }}>
      <h1 style={{ paddingBottom: "8px" }}>
        <b>Manage requests</b>
      </h1>
      <p style={{ color: "#4b5563", marginBottom: "20px" }}>
        Review and update garden activity requests from all users.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: 600 }}>Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {requests.length === 0 ? (
        <p>No requests match this filter.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Plot</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td style={tdStyle}>
                  {req.user?.name || "—"}
                  <br />
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {req.user?.email}
                  </span>
                </td>
                <td style={tdStyle}>{req.plot?.name || "—"}</td>
                <td style={tdStyle}>{req.requestType}</td>
                <td style={tdStyle}>{req.description}</td>
                <td style={tdStyle}>
                  <RequestStatusBadge status={req.status} />
                </td>
                <td style={tdStyle}>
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleString()
                    : "—"}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {req.status === "Pending" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === req._id}
                          onClick={() => updateStatus(req._id, "approve")}
                          style={actionBtn("#16a34a")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === req._id}
                          onClick={() => updateStatus(req._id, "reject")}
                          style={actionBtn("#dc2626")}
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
                        style={actionBtn("#2563eb")}
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
      )}
    </div>
  );
}

function actionBtn(bg) {
  return {
    padding: "6px 10px",
    backgroundColor: bg,
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  };
}

export default AdminRequests;
