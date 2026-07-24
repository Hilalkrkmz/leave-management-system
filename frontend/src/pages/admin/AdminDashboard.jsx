import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import {
  getPendingRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../api/leaveRequestApi";
import { adminLinks } from "../../components/layout/navLinks";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const loadRequests = () => {
    setLoading(true);
    getPendingRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    setError("");
    try {
      await approveLeaveRequest(id);
      loadRequests();
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
        <div className="card">
          <h2>Bekleyen İzin Talepleri</h2>

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