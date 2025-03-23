import { BrowserRouter, Route,Routes } from "react-router-dom"
import Signup from "./components/Signup"
import Login from "./components/Login"
import AdminDashboard from "./components/AdminDash"
import CreateEmployee from "./components/Create"
import AssignTask from "./components/AssignTask"
import ViewEmployees from "./components/ViewEmployees"
import ViewTasks from "./components/ViewTasks"
import EmployeeDashboard from "./components/EmployeeDashboard"
import EmployeeProfile from "./components/EmployeeProfile"
const App=()=>{

  return(
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/admin-dashboard"  element={<AdminDashboard/>}/>
      <Route path="/create-employee" element={<CreateEmployee/>}/>
      <Route path="/assign-task" element={<AssignTask/>}/>
      <Route path="/view-employees" element={<ViewEmployees />} />
      <Route path="/view-tasks" element={<ViewTasks/>}/>
      <Route path="employee-dashboard" element={<EmployeeDashboard/>}/>
      <Route path="/employee-profile" element={<EmployeeProfile/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App