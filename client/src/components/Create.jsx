import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Install with: npm install jwt-decode

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    dateOfJoining: new Date().toISOString().split("T")[0], // FIXED: Renamed `joinedDate` to `dateOfJoining`
    email: "",
    department: "",
    password: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (!decoded.id) throw new Error("Invalid token");
        setToken(storedToken);
        setAdminId(decoded.id); // Store admin ID
      } catch (error) {
        console.error("Token error:", error);
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login if token is invalid
      }
    } else {
      navigate("/"); // Redirect if no token
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/admin/create-employee",
        { ...employee, admin: adminId }, // FIXED: Renamed `joinedDate` to `dateOfJoining`
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error creating employee:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Employee Name</label>
          <input type="text" name="name" value={employee.name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Joining</label>
          <input type="date" name="dateOfJoining" value={employee.dateOfJoining} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" name="email" value={employee.email} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Department</label>
          <select name="department" value={employee.department} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" required>
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" name="password" value={employee.password} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md" disabled={loading}>
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
