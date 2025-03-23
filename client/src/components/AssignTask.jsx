import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AssignTask = () => {
  const [task, setTask] = useState({
    name: "",
    assignedTo: "",
    taskType: "",
    priority: "",
    estimatedTime: "",
    description: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const taskTypes = ["Development", "Design", "Testing"];
  const priorityLevels = ["Low", "Medium", "High"];

  // 🔹 Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("https://employeetask.onrender.com/api/admin/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("https://employeetask.onrender.com/api/tasks/assign-task", task, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      alert(data.message);
      navigate("/admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning task");
    }
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Assign Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Task Name</label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Assign To</label>
          <select
            name="assignedTo"
            value={task.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Task Type</label>
          <select
            name="taskType"
            value={task.taskType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Task Type</option>
            {taskTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Priority Level</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Priority</option>
            {priorityLevels.map((level, index) => (
              <option key={index} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Estimated Time (Hours)</label>
          <input
            type="number"
            name="estimatedTime"
            value={task.estimatedTime}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Task Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">Assign Task</button>
      </form>
    </div>
  );
};

export default AssignTask;
