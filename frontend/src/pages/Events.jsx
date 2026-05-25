import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  backgroundColor: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  textDecoration: "none",
  color: "inherit",
  display: "block",
};

function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(true);

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
        const res = await axiosInstance.get("/api/events", {
          headers: authHeaders,
          params: {
            upcoming: upcomingOnly ? "true" : undefined,
            search: search.trim() || undefined,
          },
        });
        if (!cancelled) setEvents(res.data);
      } catch (err) {
        if (!cancelled) alert("Could not load events.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.token, authHeaders, search, upcomingOnly]);

  const slotsLeft = (event) =>
    event.maxParticipants - (event.participants?.length ?? 0);

  if (loading) return <p>Loading events…</p>;

  return (
    <div style={{ maxWidth: "960px" }}>
      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>Community events</h1>
      <p style={{ color: "#4b5563", marginBottom: "20px" }}>
        Discover upcoming gardening workshops and community activities.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <input
          type="search"
          placeholder="Search by title, location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 220px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            minWidth: "200px",
          }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#374151",
          }}
        >
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
          />
          Upcoming only
        </label>
      </div>

      {events.length === 0 ? (
        <p>No events match your search.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {events.map((event) => {
            const left = slotsLeft(event);
            return (
              <Link key={event._id} to={`/events/${event._id}`} style={cardStyle}>
                <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{event.title}</h2>
                <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px" }}>
                  {new Date(event.eventDate).toLocaleString()}
                </p>
                <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                  {event.location}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: left > 0 ? "#166534" : "#991b1b",
                  }}
                >
                  {left > 0 ? `${left} spots available` : "Event full"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
