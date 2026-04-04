import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

/** Handles populated { _id, name } or a plain id string from the API. */
function bookerIdFromPlot(plot) {
  const b = plot.bookedBy;
  if (b == null) return null;
  if (typeof b === "string") return b;
  if (typeof b === "object" && b._id != null) return String(b._id);
  return String(b);
}

function bookedByLabel(plot) {
  const b = plot.bookedBy;
  if (!b) return "—";
  if (typeof b === "object" && b.name) return b.name;
  return "—";
}

function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "occupied" || s === "full")
    return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20";
  if (s === "reserved")
    return "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20";
  if (s === "available")
    return "bg-slate-100 text-slate-700 ring-1 ring-slate-500/15";
  return "bg-slate-50 text-slate-600 ring-1 ring-slate-500/10";
}

function UserDashboard() {
  const [allPlots, setAllPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { user } = useAuth();

  const userId = user?.id ?? user?._id;
  const firstName = user?.name?.split(" ")[0] || "there";

  const myPlots = useMemo(() => {
    return allPlots.filter((plot) => {
      const bookerId = bookerIdFromPlot(plot);
      return (
        bookerId != null &&
        userId != null &&
        String(bookerId) === String(userId)
      );
    });
  }, [allPlots, userId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await axiosInstance.get("/api/plots");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setAllPlots(list);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setFetchError("Could not load your plots.");
          setAllPlots([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Hi {firstName} — all plots are listed first, then your bookings.
        </p>
      </header>

      {loading ? (
        <div className="rounded-xl border border-slate-200/80 bg-white p-10 shadow-sm">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
            <div
              className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
              aria-hidden
            />
            <p className="text-sm text-slate-500">Loading…</p>
          </div>
        </div>
      ) : fetchError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {fetchError}
        </div>
      ) : (
        <>
          {/* All plots — above My bookings */}
          <div className="mb-10 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-medium text-slate-900">All plots</h2>
              <p className="text-xs text-slate-500">
                Every plot in the garden ({allPlots.length} total)
              </p>
            </div>
            {allPlots.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-600">
                No plots in the system yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5">Name</th>
                      <th className="px-5 py-3.5">Size</th>
                      <th className="px-5 py-3.5">Plants</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Booked by</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPlots.map((plot) => (
                      <tr
                        key={plot._id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                          {plot.name}
                        </td>
                        <td className="px-5 py-4 text-slate-700">{plot.size}</td>
                        <td className="max-w-[160px] truncate px-5 py-4 text-slate-600">
                          {plot.plants?.trim() ? plot.plants : "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {plot.location?.trim() ? plot.location : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(plot.status)}`}
                          >
                            {plot.status || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {bookedByLabel(plot)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My bookings — below */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-medium text-slate-900">My bookings</h2>
              <p className="text-xs text-slate-500">
                {myPlots.length}{" "}
                {myPlots.length === 1 ? "plot" : "plots"} assigned to you
              </p>
            </div>
            {myPlots.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-slate-600">No plots booked yet.</p>
                <Link
                  to="/user-plots"
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Book a plot
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3.5">Name</th>
                        <th className="px-5 py-3.5">Size</th>
                        <th className="px-5 py-3.5">Plants</th>
                        <th className="px-5 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPlots.map((plot) => (
                        <tr
                          key={plot._id}
                          className="transition-colors hover:bg-slate-50/80"
                        >
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                            {plot.name}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {plot.size}
                          </td>
                          <td className="max-w-[200px] truncate px-5 py-4 text-slate-600">
                            {plot.plants?.trim() ? plot.plants : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(plot.status)}`}
                            >
                              {plot.status || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                  <Link
                    to="/user-plots"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Book or manage plots →
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
