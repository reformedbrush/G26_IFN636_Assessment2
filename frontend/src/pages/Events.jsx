import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import styles from "./Events.module.css";

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
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Community events</h1>
        <p className={styles.subtitle}>
          Discover upcoming gardening workshops and community activities.
        </p>

        <div className={styles.toolbar}>
          <input
            type="search"
            placeholder="Search by title, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={upcomingOnly}
              onChange={(e) => setUpcomingOnly(e.target.checked)}
            />
            Upcoming only
          </label>
        </div>

        {events.length === 0 ? (
          <p className={styles.emptyState}>No events match your search.</p>
        ) : (
          <div className={styles.grid}>
            {events.map((event) => {
              const left = slotsLeft(event);
              return (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className={styles.eventCard}
                >
                  <h2 className={styles.eventTitle}>{event.title}</h2>
                  <p className={styles.eventMeta}>
                    {new Date(event.eventDate).toLocaleString()}
                  </p>
                  <p className={styles.eventLocation}>{event.location}</p>
                  <p
                    className={
                      left > 0 ? styles.spotsAvailable : styles.spotsFull
                    }
                  >
                    {left > 0 ? `${left} spots available` : "Event full"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
