import { useEffect, useState } from "react";
import axios from "axios";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tasks/admin-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Task Name</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Task Type</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Estimated Time (hrs)</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="text-center">
                <td className="border p-2">{task.name}</td>
                <td className="border p-2">{task.assignedTo?.name || "N/A"}</td>
                <td className="border p-2">{task.taskType}</td>
                <td className="border p-2">{task.priority}</td>
                <td className="border p-2">{task.estimatedTime}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      task.status === "pending"
                        ? "bg-yellow-500"
                        : task.status === "in progress"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewTasks;
