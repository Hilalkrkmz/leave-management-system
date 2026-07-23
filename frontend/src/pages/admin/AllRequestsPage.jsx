import { useState, useEffect } from "react";
import { getAllRequests } from "../../api/leaveRequestApi";

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
      <h2>Tüm İzin Talepleri</h2>

      {loading && <p>Yükleniyor...</p>}

      {!loading && requests.length === 0 && <p>Hiç talep yok.</p>}

      {!loading && requests.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Personel</th>
              <th>İzin Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Gün Sayısı</th>
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
                <td>{req.status}</td>
                <td>{req.reviewedByName || "-"}</td>
                <td>{req.rejectionReason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllRequestsPage;