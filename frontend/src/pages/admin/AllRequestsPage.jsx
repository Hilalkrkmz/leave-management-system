import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import { getAllRequests } from "../../api/leaveRequestApi";

function AllRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  useEffect(() => {
    getAllRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStart = !filterStart || req.startDate >= filterStart;
    const matchesEnd = !filterEnd || req.endDate <= filterEnd;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Tüm İzin Talepleri</h1>
          <p>Sistemdeki tüm izin taleplerini görüntüleyin.</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Personel adı ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200, padding: 8 }}
            />

            <label style={{ fontSize: 13 }}>Başlangıç ≥</label>
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
              style={{ width: "auto", padding: 6 }}
            />

            <label style={{ fontSize: 13 }}>Bitiş ≤</label>
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              style={{ width: "auto", padding: 6 }}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: "auto" }}>
              <option value="startDate">Tarihe göre</option>
              <option value="leaveTypeName">İzin türüne göre</option>
              <option value="status">Duruma göre</option>
              <option value="employeeName">Personele göre</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: "auto" }}>
              <option value="asc">Artan</option>
              <option value="desc">Azalan</option>
            </select>
          </div>

          {loading && <p>Yükleniyor...</p>}
          {!loading && sortedRequests.length === 0 && <p>Sonuç bulunamadı.</p>}

          {!loading && sortedRequests.length > 0 && (
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
                {sortedRequests.map((req) => (
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