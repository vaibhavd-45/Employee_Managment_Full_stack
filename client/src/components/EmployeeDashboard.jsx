import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeNavbar from "./Navbar";

const EmployeeDashboard = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const fetchEmployeeTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks/employee-tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployeeName(response.data.employeeName);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Function to mark task as completed
  const completeTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/complete-task/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh tasks after completion
      fetchEmployeeTasks();
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to mark task as completed");
    }
  };

  return (
    <div><EmployeeNavbar/>
    <div className="p-6">
        
        <br></br>
      <h2 className="text-3xl font-bold mb-4">Hello, {employeeName || "Employee"} 👋</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow-md border-l-4"
              style={{ borderColor: getPriorityColor(task.priority) }}>
              <h3 className="text-xl font-semibold">{task.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.taskType}</p>
              <p className="mt-2"><strong>Priority:</strong> <span className={`text-${getPriorityColor(task.priority)}`}>{task.priority}</span></p>
              <p><strong>Estimated Time:</strong> {task.estimatedTime} hrs</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-white ${getStatusColor(task.status)}`}>
                {task.status}
              </span></p>

              {/* 🔹 Show Complete button only if task is not completed */}
              {task.status !== "completed" && (
                <button onClick={() => completeTask(task._id)} 
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

// Function to get color based on priority
const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "high": return "red-500";
    case "medium": return "yellow-500";
    case "low": return "green-500";
    default: return "gray-500";
  }
};

// Function to get color based on status
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending": return "bg-yellow-500";
    case "in progress": return "bg-blue-500";
    case "completed": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

export default EmployeeDashboard;
