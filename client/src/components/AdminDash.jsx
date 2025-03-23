import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUsers, FaTasks, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardOptions = [
    { label: "Create Employee", icon: <FaUserPlus />, path: "/create-employee" },
    { label: "View Employees", icon: <FaUsers />, path: "/view-employees" },
    { label: "Assign Task", icon: <FaTasks />, path: "/assign-task" },
    { label: "View Tasks", icon: <FaClipboardList />, path: "/view-tasks" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {dashboardOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => navigate(option.path)}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all"
          >
            <span className="text-3xl mb-2">{option.icon}</span>
            <span className="text-lg font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
