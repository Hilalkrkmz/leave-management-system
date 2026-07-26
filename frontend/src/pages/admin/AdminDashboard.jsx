import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import {
  getPendingRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getAllRequests,
} from "../../api/leaveRequestApi";
import { getAllUsers } from "../../api/userApi";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const [stats, setStats] = useState({ pending: 0, totalEmployees: 0, approvedThisMonth: 0 });

  const loadRequests = () => {
    setLoading(true);
    getPendingRequests()
      .then((data) => {
        setRequests(data);
        setStats((prev) => ({ ...prev, pending: data.length }));
      })
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  };

  const loadStats = () => {
    getAllUsers()
      .then((users) => {
        const employeeCount = users.filter((u) => u.role === "EMPLOYEE").length;
        setStats((prev) => ({ ...prev, totalEmployees: employeeCount }));
      })
      .catch((err) => console.log("Hata:", err));

    getAllRequests()
      .then((allRequests) => {
        const now = new Date();
        const approvedThisMonth = allRequests.filter((r) => {
          if (r.status !== "APPROVED" || !r.reviewedAt) return false;
          const reviewedDate = new Date(r.reviewedAt);
          return (
            reviewedDate.getMonth() === now.getMonth() &&
            reviewedDate.getFullYear() === now.getFullYear()
          );
        }).length;
        setStats((prev) => ({ ...prev, approvedThisMonth }));
      })
      .catch((err) => console.log("Hata:", err));
  };

  useEffect(() => {
  loadRequests();
  loadStats();

  const interval = setInterval(() => {
    loadRequests();
    loadStats();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  const handleApprove = async (id) => {
    setError("");
    try {
      await approveLeaveRequest(id);
      loadRequests();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  const handleRejectClick = (id) => {
    setRejectingId(id);
    setRejectionReason("");
  };

  const handleRejectSubmit = async (id) => {
    setError("");
    try {
      await rejectLeaveRequest(id, rejectionReason);
      setRejectingId(null);
      loadRequests();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Bekleyen İzin Talepleri</h1>
          <p>Onay bekleyen izin taleplerini buradan yönetebilirsiniz.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Bekleyen Talep</div>
            <div className="stat-card-value">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Toplam Personel</div>
            <div className="stat-card-value">{stats.totalEmployees}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Bu Ay Onaylanan</div>
            <div className="stat-card-value">{stats.approvedThisMonth}</div>
          </div>
        </div>

        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {loading && <p>Yükleniyor...</p>}
          {!loading && requests.length === 0 && <p>Bekleyen talep yok.</p>}

          {!loading && requests.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>İzin Türü</th>
                  <th>Başlangıç</th>
                  <th>Bitiş</th>
                  <th>Gün</th>
                  <th>Sebep</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.employeeName}</td>
                    <td>{req.leaveTypeName}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.totalDays}</td>
                    <td>{req.reason}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleApprove(req.id)}>Onayla</button>
                      <button className="btn btn-danger" onClick={() => handleRejectClick(req.id)}>Reddet</button>

                      {rejectingId === req.id && (
                        <div style={{ marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Red sebebi"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            style={{ marginRight: 8, padding: 6 }}
                          />
                          <button className="btn btn-primary" onClick={() => handleRejectSubmit(req.id)}>
                            Gönder
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;