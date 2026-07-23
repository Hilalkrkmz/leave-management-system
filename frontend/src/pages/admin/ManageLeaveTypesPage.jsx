import { useState, useEffect } from "react";
import { getAllLeaveTypes, createLeaveType, deactivateLeaveType } from "../../api/leaveTypeApi";

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
      <h2>İzin Türü Yönetimi</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Yeni İzin Türü Ekle</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>İsim:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Açıklama:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Ekle</button>
      </form>

      <h3>Mevcut İzin Türleri</h3>

      {loading && <p>Yükleniyor...</p>}

      {!loading && (
        <table border="1" cellPadding="8">
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
                <td>{type.active ? "Aktif" : "Pasif"}</td>
                <td>
                  {type.active && (
                    <button onClick={() => handleDeactivate(type.id)}>Pasif Yap</button>
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

export default ManageLeaveTypesPage;