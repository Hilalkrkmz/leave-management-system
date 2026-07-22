import { useState, useEffect } from "react";
import {
  getPendingRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../api/leaveRequestApi";

function AdminDashboard() {
  const email = localStorage.getItem("email");
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

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
      <h1>Admin Paneli</h1>
      <p>Hoş geldin, {email}</p>
      <button onClick={handleLogout}>Çıkış Yap</button>

      <h2>Bekleyen İzin Talepleri</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Yükleniyor...</p>}

      {!loading && requests.length === 0 && (
        <p>Bekleyen talep yok.</p>
      )}

      {!loading && requests.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Personel</th>
              <th>İzin Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Gün Sayısı</th>
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
                  <button onClick={() => handleApprove(req.id)}>Onayla</button>
                  <button onClick={() => handleRejectClick(req.id)}>Reddet</button>

                  {rejectingId === req.id && (
                    <div>
                      <input
                        type="text"
                        placeholder="Red sebebi"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <button onClick={() => handleRejectSubmit(req.id)}>
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
  );
}

export default AdminDashboard;