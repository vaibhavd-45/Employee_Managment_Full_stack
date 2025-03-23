import { useState, useEffect } from "react";
import axios from "axios";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <h3 className="font-semibold">{employee.name}</h3>
              <p>Email: {employee.email}</p>
              <p>Department: {employee.department || "N/A"}</p>
              <p>Joined Date: {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewEmployees;
