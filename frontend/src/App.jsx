import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEmployeesPage from "./pages/admin/ManageEmployeesPage";
import ManageLeaveTypesPage from "./pages/admin/ManageLeaveTypesPage";
import AllRequestsPage from "./pages/admin/AllRequestsPage";
import CreateLeaveRequestPage from "./pages/employee/CreateLeaveRequestPage";
import MyLeaveRequestsPage from "./pages/employee/MyLeaveRequestsPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";

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
          <ManageEmployeesPage />
          </ProtectedRoute>
      } />
      <Route path="/admin/leave-types" element={
        <ProtectedRoute allowedRole="ADMIN">
          <ManageLeaveTypesPage />
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