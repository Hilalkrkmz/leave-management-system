import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { getAllLeaveTypes, createLeaveType, deactivateLeaveType } from "../../api/leaveTypeApi";
import { adminLinks } from "../../components/layout/navLinks";

function ManageLeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createLeaveType({ name, description, isActive: true });
      setName("");
      setDescription("");
      loadLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

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
        <div className="card">
          <h2>Yeni İzin Türü Ekle</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>İsim</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Açıklama</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary">Ekle</button>
          </form>
        </div>

        <div className="card">
          <h2>Mevcut İzin Türleri</h2>
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

export default ManageLeaveTypesPage;