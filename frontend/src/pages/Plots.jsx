import axiosInstance from "../axiosConfig";
import { useEffect, useState } from "react";
import styles from "./Plots.module.css";

function Plots() {
  const [plots, setPlots] = useState([]);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [plants, setPlants] = useState("");
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", size: "", plants: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const plotsRes = await axiosInstance.get("/api/plots");
    const usersRes = await axiosInstance.get("/api/auth/users");

    setPlots(plotsRes.data);
    setUsers(usersRes.data);
  };

  const addPlot = async () => {
    if (!name || !size) {
      alert("Name and size are required");
      return;
    }

    const res = await axiosInstance.post("/api/plots", {
      name,
      size,
      plants,
    });

    setPlots([...plots, res.data]);

    setName("");
    setSize("");
    setPlants("");
  };

  const deletePlot = async (id) => {
    await axiosInstance.delete(`/api/plots/${id}`);
    setPlots(plots.filter((p) => p._id !== id));
  };

  const updatePlot = async (id, data) => {
    const res = await axiosInstance.put(`/api/plots/${id}`, data);
    setPlots(plots.map((p) => (p._id === id ? res.data : p)));
  };

  const startEdit = (plot) => {
    setEditingId(plot._id);
    setEditData({ name: plot.name, size: plot.size, plants: plot.plants });
  };

  const saveEdit = async () => {
    await updatePlot(editingId, editData);
    setEditingId(null);
    setEditData({ name: "", size: "", plants: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", size: "", plants: "" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Plot Management</h1>
        <p className={styles.subtitle}>
          Create plots, assign users, and manage availability.
        </p>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Add plot</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.formRow}>
              <input
                value={name}
                placeholder="Plot name"
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
              <input
                value={size}
                placeholder="Size"
                onChange={(e) => setSize(e.target.value)}
                className={styles.input}
              />
              <input
                value={plants}
                placeholder="Plants"
                onChange={(e) => setPlants(e.target.value)}
                className={styles.input}
              />
              <button type="button" onClick={addPlot} className={styles.primaryButton}>
                + Add Plot
              </button>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Plots</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Plants</th>
                  <th>Status</th>
                  <th>Assign User</th>
                  <th className={styles.actionsCol}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots.map((plot) => (
                  <tr key={plot._id}>
                    <td>{plot.name}</td>
                    <td>{plot.size}</td>
                    <td>{plot.plants}</td>
                    <td>
                      <select
                        value={plot.status}
                        onChange={(e) =>
                          updatePlot(plot._id, { status: e.target.value })
                        }
                        className={styles.select}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={plot.bookedBy?._id || ""}
                        onChange={(e) =>
                          updatePlot(plot._id, { bookedBy: e.target.value })
                        }
                        className={styles.select}
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.actionsCol}>
                      <span className={styles.btnRow}>
                        <button
                          type="button"
                          onClick={() => startEdit(plot)}
                          className={`${styles.btn} ${styles.btnEdit}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePlot(plot._id)}
                          className={`${styles.btn} ${styles.btnDelete}`}
                        >
                          Delete
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Modal */}
        {editingId && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Edit Plot</h2>

              <input
                value={editData.name}
                placeholder="Plot name"
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className={styles.input}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <input
                value={editData.size}
                placeholder="Size"
                onChange={(e) =>
                  setEditData({ ...editData, size: e.target.value })
                }
                className={styles.input}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <input
                value={editData.plants}
                placeholder="Plants"
                onChange={(e) =>
                  setEditData({ ...editData, plants: e.target.value })
                }
                className={styles.input}
                style={{ width: "100%" }}
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className={styles.saveButton}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plots;
