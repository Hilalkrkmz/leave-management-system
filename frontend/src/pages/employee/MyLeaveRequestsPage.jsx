import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { getMyLeaveRequests } from "../../api/leaveRequestApi";
import { employeeLinks } from "../../components/layout/navLinks";

function MyLeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLeaveRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar links={employeeLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>İzin Taleplerim</h1>
          <p>Oluşturduğunuz izin taleplerinin durumunu buradan takip edebilirsiniz.</p>
        </div>

        <div className="card">
          {loading && <p>Yükleniyor...</p>}
          {!loading && requests.length === 0 && (
            <div className="empty-state">Henüz bir izin talebiniz yok.</div>
          )}
          {!loading && requests.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>İzin Türü</th>
                  <th>Başlangıç</th>
                  <th>Bitiş</th>
                  <th>Gün</th>
                  <th>Durum</th>
                  <th>Red Sebebi</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.leaveTypeName}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.totalDays}</td>
                    <td><span className={`status-badge status-${req.status}`}>{req.status}</span></td>
                    <td>{req.rejectionReason || "-"}</td>
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

export default MyLeaveRequestsPage;