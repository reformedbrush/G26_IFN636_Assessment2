import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const REQUEST_TYPES = [
  "Watering",
  "Compost",
  "Tool Request",
  "Maintenance",
  "Harvest Assistance",
];

function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPlots, setMyPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plotId, setPlotId] = useState("");
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0]);
  const [description, setDescription] = useState("");

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${user?.token}` }),
    [user?.token]
  );

  const uid = user?.id ?? user?._id;

  useEffect(() => {
    if (!user?.token) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/plots");
        if (cancelled) return;

        const booked = res.data.filter(
          (p) =>
            p.bookedBy &&
            String(p.bookedBy._id || p.bookedBy) === String(uid)
        );
        setMyPlots(booked);
        if (booked.length > 0) setPlotId(booked[0]._id);
      } catch (err) {
        console.error(err);
        if (!cancelled) alert("Could not load your plots.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.token, uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plotId || !description.trim()) {
      alert("Select a plot and enter a description.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post(
        "/api/requests",
        { plot: plotId, requestType, description },
        { headers: authHeaders }
      );
      navigate("/my-requests");
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>Create request</h1>
      <p style={{ color: "#4b5563", marginBottom: "24px" }}>
        Submit a garden activity request for one of your booked plots.
      </p>

      {myPlots.length === 0 ? (
        <div
          style={{
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
          }}
        >
          <p style={{ marginBottom: "12px" }}>
            You need a booked plot before creating a request.
          </p>
          <Link
            to="/user-plots"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            Go to Book Plot →
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
          }}
        >
          <label style={labelStyle}>
            Request type
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              style={inputStyle}
            >
              {REQUEST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Plot
            <select
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
              style={inputStyle}
            >
              {myPlots.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                  {p.location ? ` — ${p.location}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need help with…"
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 16px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
            <Link
              to="/my-requests"
              style={{
                padding: "8px 16px",
                color: "#374151",
                textDecoration: "none",
                border: "1px solid #d1d5db",
                borderRadius: "5px",
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "16px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "6px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontWeight: 400,
};

export default CreateRequest;
