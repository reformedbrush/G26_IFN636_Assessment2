import axios from 'axios';
import { useEffect, useState } from 'react';

function Plots() {
  const [plots, setPlots] = useState([]);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [plants, setPlants] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/plots')
      .then(res => setPlots(res.data));
  }, []);

  const addPlot = async () => {
    if (!name || !size) {
      alert("Name and size are required");
      return;
    }

    const res = await axios.post('http://localhost:5001/api/plots', {
      name, size, plants
    });

    setPlots([...plots, res.data]);

    setName('');
    setSize('');
    setPlants('');
  };

  const deletePlot = async (id) => {
    await axios.delete(`http://localhost:5001/api/plots/${id}`);
    setPlots(plots.filter(p => p._id !== id));
  };

  const updatePlot = async (id, status) => {
    const res = await axios.put(`http://localhost:5001/api/plots/${id}`, { status });
    setPlots(plots.map(p => p._id === id ? res.data : p));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{paddingBottom: "30px"}}><b>Plot Management</b></h1>

   
      <div style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <input
          value={name}
          placeholder="Plot name"
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none"
          }}
        />

        <input
          value={size}
          placeholder="Size"
          onChange={(e) => setSize(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none"
          }}
        />

        <input
          value={plants}
          placeholder="Plants"
          onChange={(e) => setPlants(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none"
          }}
        />

        <button
          onClick={addPlot}
          style={{
            padding: "8px 14px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          + Add Plot
        </button>
      </div>
<div style={{textAlign: "left"}}>
   
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#f3f4f6", padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ backgroundColor: "#f3f4f6", padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Size</th>
            <th style={{ backgroundColor: "#f3f4f6", padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Plants</th>
            <th style={{ backgroundColor: "#f3f4f6", padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
            <th style={{ backgroundColor: "#f3f4f6", padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {plots.map(plot => (
            <tr key={plot._id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{plot.name}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{plot.size}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{plot.plants}</td>

              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                <select
                  value={plot.status}
                  onChange={(e) => updatePlot(plot._id, e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </td>

              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                <button style={{backgroundColor: "#FF0000", color: "white", border: "none", padding: "8px 14px", borderRadius: "5px", cursor: "pointer"}} onClick={() => deletePlot(plot._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}

export default Plots;