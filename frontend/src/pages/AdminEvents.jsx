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

function AdminEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [participantsView, setParticipantsView] = useState(null);

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
  }, [user?.token, authHeaders]);

  const createEvent = async () => {
    if (!title || !description || !location || !eventDate) {
      alert("Fill in all required fields.");
      return;
    }
    try {
      const res = await axiosInstance.post(
        "/api/events",
        {
          title,
          description,
          location,
          eventDate,
          maxParticipants: Number(maxParticipants),
        },
        { headers: authHeaders }
      );
      setEvents((prev) =>
        [...prev, res.data].sort(
          (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
        )
      );
      setTitle("");
      setDescription("");
      setLocation("");
      setEventDate("");
      setMaxParticipants(20);
    } catch (err) {
      alert(err.response?.data?.message || "Could not create event.");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axiosInstance.delete(`/api/events/${id}`, { headers: authHeaders });
      setEvents((prev) => prev.filter((e) => e._id !== id));
      if (participantsView?.eventId === id) setParticipantsView(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete event.");
    }
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    const d = new Date(event.eventDate);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEditData({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: local,
      maxParticipants: event.maxParticipants,
    });
  };

  const saveEdit = async () => {
    try {
      const res = await axiosInstance.put(`/api/events/${editingId}`, editData, {
        headers: authHeaders,
      });
      setEvents((prev) => prev.map((e) => (e._id === editingId ? res.data : e)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update event.");
    }
  };

  const viewParticipants = async (eventId) => {
    try {
      const res = await axiosInstance.get(`/api/events/${eventId}/participants`, {
        headers: authHeaders,
      });
      setParticipantsView(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Could not load participants.");
    }
  };

  if (loading) return <p>Loading events…</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px" }}>
      <h1 style={{ paddingBottom: "24px" }}>
        <b>Manage events</b>
      </h1>

      <div
        style={{
          marginBottom: "24px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <input
          value={location}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min={1}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          style={{ ...inputStyle, width: "90px" }}
        />
        <input
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, flex: "1 1 200px" }}
        />
        <button type="button" onClick={createEvent} style={greenBtn}>
          + Create event
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "640px",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Registered</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td style={tdStyle}>{event.title}</td>
                <td style={tdStyle}>
                  {new Date(event.eventDate).toLocaleString()}
                </td>
                <td style={tdStyle}>{event.location}</td>
                <td style={tdStyle}>
                  {event.participants?.length ?? 0} / {event.maxParticipants}
                </td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    style={{ ...blueBtn, marginRight: "6px" }}
                    onClick={() => viewParticipants(event._id)}
                  >
                    Participants
                  </button>
                  <button
                    type="button"
                    style={{ ...blueBtn, marginRight: "6px" }}
                    onClick={() => startEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    style={redBtn}
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {participantsView && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>
            Participants — {participantsView.title} ({participantsView.count}/
            {participantsView.maxParticipants})
          </h3>
          {participantsView.participants?.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <ul>
              {participantsView.participants.map((p) => (
                <li key={p._id}>
                  {p.name} — {p.email}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            style={{ ...grayBtn, marginTop: "12px" }}
            onClick={() => setParticipantsView(null)}
          >
            Close
          </button>
        </div>
      )}

      {editingId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Edit event</h2>
            <input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
            />
            <input
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
            />
            <input
              type="datetime-local"
              value={editData.eventDate}
              onChange={(e) =>
                setEditData({ ...editData, eventDate: e.target.value })
              }
              style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
            />
            <input
              type="number"
              min={1}
              value={editData.maxParticipants}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  maxParticipants: Number(e.target.value),
                })
              }
              style={{ ...inputStyle, width: "100%", marginBottom: "10px" }}
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={3}
              style={{ ...inputStyle, width: "100%", marginBottom: "16px" }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button type="button" style={grayBtn} onClick={() => setEditingId(null)}>
                Cancel
              </button>
              <button type="button" style={greenBtn} onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none",
};

const greenBtn = {
  padding: "8px 14px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const blueBtn = {
  padding: "6px 10px",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "13px",
};

const redBtn = {
  padding: "6px 10px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "13px",
};

const grayBtn = {
  padding: "8px 14px",
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AdminEvents;
