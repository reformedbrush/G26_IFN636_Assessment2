import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${user?.token}` }),
    [user?.token]
  );

  const uid = String(user?.id ?? user?._id ?? "");

  useEffect(() => {
    if (!user?.token || !id) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/events/${id}`, {
          headers: authHeaders,
        });
        if (!cancelled) setEvent(res.data);
      } catch (err) {
        if (!cancelled) alert("Event not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.token, authHeaders, id]);

  const isRegistered = event?.participants?.some(
    (p) => String(p._id || p) === uid
  );

  const spotsLeft =
    event != null
      ? event.maxParticipants - (event.participants?.length ?? 0)
      : 0;

  const register = async () => {
    setBusy(true);
    try {
      const res = await axiosInstance.post(
        `/api/events/${id}/register`,
        {},
        { headers: authHeaders }
      );
      setEvent(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      const res = await axiosInstance.delete(`/api/events/${id}/cancel`, {
        headers: authHeaders,
      });
      setEvent(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel registration.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p>Loading event…</p>;
  if (!event) {
    return (
      <div>
        <p>Event not found.</p>
        <Link to="/events" style={{ color: "#2563eb" }}>
          ← Back to events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <Link
        to="/events"
        style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}
      >
        ← Back to events
      </Link>

      <h1 style={{ fontSize: "28px", margin: "16px 0 12px" }}>{event.title}</h1>

      <div
        style={{
          padding: "20px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          <strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Location:</strong> {event.location}
        </p>
        <p style={{ marginBottom: "16px" }}>
          <strong>Participants:</strong> {event.participants?.length ?? 0} /{" "}
          {event.maxParticipants}
          <span style={{ marginLeft: "12px", color: spotsLeft > 0 ? "#166534" : "#991b1b" }}>
            ({spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"})
          </span>
        </p>
        <p style={{ lineHeight: 1.6, color: "#374151", marginBottom: "24px" }}>
          {event.description}
        </p>

        {user?.role === "user" && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {isRegistered ? (
              <button
                type="button"
                disabled={busy}
                onClick={cancel}
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: busy ? "wait" : "pointer",
                }}
              >
                {busy ? "…" : "Cancel registration"}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy || spotsLeft <= 0}
                onClick={register}
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: busy || spotsLeft <= 0 ? "not-allowed" : "pointer",
                  opacity: spotsLeft <= 0 ? 0.6 : 1,
                }}
              >
                {busy ? "…" : spotsLeft <= 0 ? "Event full" : "Register"}
              </button>
            )}
          </div>
        )}

        {user?.role === "admin" && (
          <Link
            to="/admin/events"
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "8px 14px",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Manage in admin panel
          </Link>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
