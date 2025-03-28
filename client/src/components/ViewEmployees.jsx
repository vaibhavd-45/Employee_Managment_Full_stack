import { useState, useEffect } from "react";
import axios from "axios";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please log in.");
          return;
        }

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting employee");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Employees List</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul className="space-y-3">
          {employees.map((employee) => (
            <li key={employee._id} className="p-3 border rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{employee.name}</h3>
                  <p>Email: {employee.email}</p>
                  <p>Department: {employee.department || "N/A"}</p>
                  <p>Joined Date: {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(employee._id)}
                  disabled={deleteLoading === employee._id}
                  className="h-10 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                >
                  {deleteLoading === employee._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewEmployees;