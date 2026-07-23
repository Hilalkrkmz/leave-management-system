import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ManageEmployeesPage from "./pages/admin/ManageEmployeesPage";
import ManageLeaveTypesPage from "./pages/admin/ManageLeaveTypesPage";
import AllRequestsPage from "./pages/admin/AllRequestsPage";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/employee" element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeDashboard />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" />} />

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

      <Route path="/admin/all-requests" element={
        <ProtectedRoute allowedRole="ADMIN">
             <AllRequestsPage />
      </ProtectedRoute>
} />
    </Routes>
  );
}

export default App;