import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import AdminPanelLogin from "./pages/adminlogin";
import UserLogin from "./pages/userlogin";
import Department from "./components/department/Department";
import EmployeesPage from "./components/employees/Employees";
import AddParticipants from "./components/addParticipants/AddParticipants";
import UserProfileAdmin from "./pages/userprofileadmin";
import UserProfileLocal from "./pages/userprofilelocal";
import ForgotPassword from "./components/forgotPassword/Forgot";
import SetTimeHolidayPage from "./pages/SetTimeHolidayPage";
import CreateAdmin from "./components/createAdmin/CreateAdmin";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/adminlogin" element={<AdminPanelLogin />} />
          <Route exact path="/login" element={<UserLogin />} />
          <Route exact path="/recoverpassword" element={<ForgotPassword />} />
          <Route exact path="/department" element={<Department />} />
          <Route exact path={`/department/:className`} element={<EmployeesPage />} />
          <Route exact path={`/userprofile/:userId`} element={<UserProfileLocal />} />
          <Route exact path={`/admin/userprofile/:userId`} element={<UserProfileAdmin />} />
          <Route exact path={`/:className/addParticipants`} element={<AddParticipants />} />
          <Route exact path={`/settimeholidays`} element={<SetTimeHolidayPage />} />
          <Route exact path={`/createAdmin`} element={<CreateAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
