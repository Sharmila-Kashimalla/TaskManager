import React, { useEffect, useState } from "react";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [createErrors, setCreateErrors] = useState({ title: "", desc: "" });
  const [editErrors, setEditErrors] = useState({ title: "", desc: "" });
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:8000/tasks");
    const data = await res.json();
    const updatedData = data
      .map((task) => ({ ...task, status: task.status || "Initiated" }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setTasks(updatedData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8000/tasks/${id}`, { method: "DELETE" });
    showMsg("Task deleted successfully!");
    fetchTasks();
  };

  const toggleStatus = async (id, currentStatus, title, desc) => {
    if (currentStatus === "Initiated") {
      const newStatus = "Completed";
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc, status: newStatus }),
      });
      showMsg("Task marked as completed!");
      fetchTasks();
    }
  };

  const createTask = async () => {
    let errors = { title: "", desc: "" };
    if (!newTitle) errors.title = "Title must be filled";
    if (!newDesc) errors.desc = "Description must be filled";
    setCreateErrors(errors);
    if (errors.title || errors.desc) return;

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, desc: newDesc }),
    });
    setShowCreate(false);
    setNewTitle("");
    setNewDesc("");
    showMsg("Task created successfully!");
    fetchTasks();
  };

  const startEdit = (task) => {
    if (showCreate) setShowCreate(false);
    setEditTask(task);
    setEditTitle(task.title || "");
    setEditDesc(task.desc || "");
    setEditErrors({ title: "", desc: "" });
  };

  const submitEdit = async () => {
    let errors = { title: "", desc: "" };
    if (!editTitle) errors.title = "Title must be filled";
    if (!editDesc) errors.desc = "Description must be filled";
    setEditErrors(errors);
    if (errors.title || errors.desc) return;

    await fetch(`http://localhost:8000/tasks/${editTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, desc: editDesc, status: editTask.status }),
    });
    setEditTask(null);
    setEditTitle("");
    setEditDesc("");
    showMsg("Task updated successfully!");
    fetchTasks();
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditTitle("");
    setEditDesc("");
    setEditErrors({ title: "", desc: "" });
  };

  const filteredTasks = tasks.filter((task) => statusFilter === "All" ? true : task.status === statusFilter);

  const styles = {
    container: { padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#eef2f7", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    title: { fontSize: "36px", fontWeight: "bold", textAlign: "center", flex: 1, color: "#333" },
    createBtn: { backgroundColor: "green", color: "white", padding: "16px 32px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", transition: "0.3s", marginLeft: "20px" },
    formCard: { borderRadius: "10px", padding: "20px", marginBottom: "25px", width: "100%", maxWidth: "400px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    editCard: { borderRadius: "10px", padding: "20px", marginBottom: "25px", width: "100%", maxWidth: "400px", backgroundColor: "#e9f2ff", border: "2px solid #007bff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    input: { width: "100%", padding: "12px", margin: "8px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
    error: { color: "red", fontSize: "12px", marginTop: "-5px", marginBottom: "5px" },
    formButtons: { marginTop: "12px", display: "flex", gap: "12px" },
    btnGreen: { backgroundColor: "green", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", transition: "0.3s" },
    btnRed: { backgroundColor: "red", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", transition: "0.3s" },
    btnBlue: { backgroundColor: "green", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", transition: "0.3s" },
    btnStatus: (status) => ({
      color: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: status === "Completed" ? "not-allowed" : "pointer",
      backgroundColor: status === "Completed" ? "green" : "orange",
      transition: "0.3s",
      fontWeight: "bold"
    }),
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", backgroundColor: "#ffffff" },
    th: { border: "1px solid #ddd", padding: "12px", textAlign: "left", backgroundColor: "#dce6f1", fontSize: "15px", color: "#333" },
    td: { border: "1px solid #ddd", padding: "12px", fontSize: "14px", color: "#333" },
    select: { marginTop: "5px", padding: "6px", borderRadius: "4px", fontSize: "14px" },
    message: { position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#4BB543", color: "white", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
    tableRowHover: { transition: "0.3s", cursor: "pointer" },
    disabledBtn: { backgroundColor: "#d3d3d3", color: "#7a7a7a", cursor: "not-allowed", transition: "0.3s" }
  };

  return (
    <div style={styles.container}>
      {message && <div style={styles.message}>{message}</div>}
      <div style={styles.header}>
        <div style={styles.title}>📋 Task Manager</div>
        <button style={styles.createBtn} onClick={() => {
          setShowCreate(true); setEditTask(null); setNewTitle(""); setNewDesc(""); setCreateErrors({ title: "", desc: "" });
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor="darkgreen"}
        onMouseOut={e => e.currentTarget.style.backgroundColor="green"}>
          + Create Task
        </button>
      </div>

      {/* Create Card */}
      {showCreate && (
        <div style={styles.formCard}>
          <h3>Create New Task</h3>
          <input style={styles.input} type="text" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          {createErrors.title && <div style={styles.error}>{createErrors.title}</div>}
          <input style={styles.input} type="text" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          {createErrors.desc && <div style={styles.error}>{createErrors.desc}</div>}
          <div style={styles.formButtons}>
            <button style={styles.btnBlue} onClick={createTask} onMouseOver={e => e.currentTarget.style.backgroundColor="darkgreen"} onMouseOut={e => e.currentTarget.style.backgroundColor="green"}>Submit</button>
            <button style={styles.btnRed} onClick={() => setShowCreate(false)} onMouseOver={e => e.currentTarget.style.backgroundColor="darkred"} onMouseOut={e => e.currentTarget.style.backgroundColor="red"}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Card */}
      {editTask && (
        <div style={styles.editCard}>
          <h3>Edit Task</h3>
          <input style={styles.input} type="text" placeholder="Title" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          {editErrors.title && <div style={styles.error}>{editErrors.title}</div>}
          <input style={styles.input} type="text" placeholder="Description" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
          {editErrors.desc && <div style={styles.error}>{editErrors.desc}</div>}
          <div style={styles.formButtons}>
            <button style={styles.btnBlue} onClick={submitEdit} onMouseOver={e => e.currentTarget.style.backgroundColor="darkgreen"} onMouseOut={e => e.currentTarget.style.backgroundColor="green"}>Submit</button>
            <button style={styles.btnRed} onClick={cancelEdit} onMouseOver={e => e.currentTarget.style.backgroundColor="darkred"} onMouseOut={e => e.currentTarget.style.backgroundColor="red"}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>
              Status
              <br />
              <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Initiated">Initiated</option>
                <option value="Completed">Completed</option>
              </select>
            </th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0f7fa", ...styles.tableRowHover }}
                onMouseOver={e => e.currentTarget.style.backgroundColor="#c1eaf7"}
                onMouseOut={e => e.currentTarget.style.backgroundColor=index % 2 === 0 ? "#f9f9f9" : "#e0f7fa"}>
              <td style={styles.td}>{task.title}</td>
              <td style={styles.td}>{task.desc}</td>
              <td style={styles.td}>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td style={styles.td}>
                <button style={styles.btnStatus(task.status)} onClick={() => toggleStatus(task.id, task.status, task.title, task.desc)}>
                  {task.status}
                </button>
              </td>
              <td style={styles.td}>
                <button
                  style={task.status === "Completed"
                    ? {...styles.disabledBtn, marginRight: "12px", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold"}
                    : {...styles.btnGreen, marginRight: "12px"}}
                  onClick={() => task.status !== "Completed" && startEdit(task)}
                  disabled={task.status === "Completed"}
                >
                  Edit
                </button>
                <button style={styles.btnRed} onClick={() => deleteTask(task.id)}
                        onMouseOver={e => e.currentTarget.style.backgroundColor="darkred"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor="red"}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
