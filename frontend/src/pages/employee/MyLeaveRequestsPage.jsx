import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { employeeLinks } from "../../components/layout/navLinks";
import { getMyLeaveRequests } from "../../api/leaveRequestApi";

function MyLeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const load = () => {
      getMyLeaveRequests()
        .then((data) => {
          setRequests(data);
          const decidedIds = data.filter((r) => r.status !== "PENDING").map((r) => r.id);
          const seenIds = JSON.parse(localStorage.getItem("seenRequestIds") || "[]");
          const merged = [...new Set([...seenIds, ...decidedIds])];
          localStorage.setItem("seenRequestIds", JSON.stringify(merged));
        })
        .catch((err) => console.log("Hata:", err))
        .finally(() => setLoading(false));
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests =
    statusFilter === "ALL"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  return (
    <div>
      <Navbar links={employeeLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>İzin Taleplerim</h1>
          <p>Oluşturduğunuz izin taleplerinin durumunu buradan takip edebilirsiniz.</p>
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="ALL">Tümü</option>
              <option value="PENDING">Bekleyen</option>
              <option value="APPROVED">Onaylanan</option>
              <option value="REJECTED">Reddedilen</option>
            </select>
          </div>

          {loading && <p>Yükleniyor...</p>}
          {!loading && filteredRequests.length === 0 && (
            <div className="empty-state">Bu kritere uyan bir izin talebiniz yok.</div>
          )}
          {!loading && filteredRequests.length > 0 && (
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
                {filteredRequests.map((req) => (
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