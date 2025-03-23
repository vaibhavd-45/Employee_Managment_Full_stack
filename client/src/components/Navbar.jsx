import { useNavigate } from "react-router-dom"; 
 
const EmployeeNavbar = () => { 
  const navigate = useNavigate(); 
  
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.clear();
    // Navigate to login page
    navigate("/");
  };
 
  return ( 
    <nav className="bg-blue-600 p-4 shadow-md"> 
      <div className="container mx-auto flex justify-between items-center"> 
        <h1 className="text-white text-2xl font-bold">Employee Tasker</h1> 
 
        <div className="space-x-4"> 
          <button 
            onClick={() => navigate("/employee-dashboard")} 
            className="px-4 py-2 rounded text-white hover:bg-blue-500" 
          > 
            Dashboard 
          </button> 
 
          <button 
            onClick={() => navigate("/employee-profile")} 
            className="px-4 py-2 rounded text-white hover:bg-blue-500" 
          > 
            Profile 
          </button>
          
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" 
          > 
            Logout 
          </button> 
        </div> 
      </div> 
    </nav> 
  ); 
}; 
 
export default EmployeeNavbar;