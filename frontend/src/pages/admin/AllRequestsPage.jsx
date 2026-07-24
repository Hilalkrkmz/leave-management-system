import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { getAllRequests } from "../../api/leaveRequestApi";
import { adminLinks } from "../../components/layout/navLinks";


function AllRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="card">
          <h2>Tüm İzin Talepleri</h2>

          {loading && <p>Yükleniyor...</p>}
          {!loading && requests.length === 0 && <p>Hiç talep yok.</p>}

          {!loading && requests.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>İzin Türü</th>
                  <th>Başlangıç</th>
                  <th>Bitiş</th>
                  <th>Gün</th>
                  <th>Durum</th>
                  <th>Onaylayan</th>
                  <th>Red Sebebi</th>
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
                    <td><span className={`status-badge status-${req.status}`}>{req.status}</span></td>
                    <td>{req.reviewedByName || "-"}</td>
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

export default AllRequestsPage;