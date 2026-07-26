import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import { getAllLeaveTypes, deactivateLeaveType } from "../../api/leaveTypeApi";

function LeaveTypeListPage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaveTypes = () => {
    setLoading(true);
    getAllLeaveTypes()
      .then((data) => setLeaveTypes(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const handleDeactivate = async (id) => {
    setError("");
    try {
      await deactivateLeaveType(id);
      loadLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Mevcut İzin Türleri</h1>
          <p>Aktif izin türlerini görüntüleyin ve yönetin.</p>
        </div>

        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {loading && <p>Yükleniyor...</p>}

          {!loading && (
            <table>
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Açıklama</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((type) => (
                  <tr key={type.id}>
                    <td>{type.name}</td>
                    <td>{type.description}</td>
                    <td>
                      <span className={`status-badge ${type.active ? "status-APPROVED" : "status-REJECTED"}`}>
                        {type.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td>
                      {type.active && (
                        <button className="btn btn-danger" onClick={() => handleDeactivate(type.id)}>
                          Pasif Yap
                        </button>
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

export default LeaveTypeListPage;