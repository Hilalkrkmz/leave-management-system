import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllRequestsPage from "./pages/admin/AllRequestsPage";
import CreateLeaveRequestPage from "./pages/employee/CreateLeaveRequestPage";
import MyLeaveRequestsPage from "./pages/employee/MyLeaveRequestsPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import EmployeesLandingPage from "./pages/admin/EmployeesLandingPage";
import AddEmployeePage from "./pages/admin/AddEmployeePage";
import EmployeeListPage from "./pages/admin/EmployeeListPage";
import LeaveTypesLandingPage from "./pages/admin/LeaveTypesLandingPage";
import AddLeaveTypePage from "./pages/admin/AddLeaveTypePage";
import LeaveTypeListPage from "./pages/admin/LeaveTypeListPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/all-requests" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AllRequestsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/employees" element={
        <ProtectedRoute allowedRole="ADMIN">
          <EmployeesLandingPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/employees/add" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AddEmployeePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/employees/list" element={
        <ProtectedRoute allowedRole="ADMIN">
          <EmployeeListPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/leave-types" element={
        <ProtectedRoute allowedRole="ADMIN">
          <LeaveTypesLandingPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/leave-types/add" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AddLeaveTypePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/leave-types/list" element={
        <ProtectedRoute allowedRole="ADMIN">
          <LeaveTypeListPage />
        </ProtectedRoute>
      } />

      <Route path="/employee" element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <CreateLeaveRequestPage />
        </ProtectedRoute>
      } />
      <Route path="/employee/my-requests" element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <MyLeaveRequestsPage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;