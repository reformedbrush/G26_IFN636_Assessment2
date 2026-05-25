import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import RequestStatusBadge from "../components/RequestStatusBadge";

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
    <div style={{ maxWidth: "960px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>My requests</h1>
          <p style={{ color: "#4b5563" }}>
            Track activity requests for your booked plots.
          </p>
        </div>
        <Link
          to="/create-request"
          style={{
            padding: "8px 16px",
            backgroundColor: "#16a34a",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: 600,
          }}
        >
          + New request
        </Link>
      </div>

      {requests.length === 0 ? (
        <p>No requests yet. Create one to get started.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Plot</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle} />
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
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
                  {req.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => handleDelete(req._id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyRequests;
