import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import { getAllUsers, deactivateUser, updateLeaveBalance } from "../../api/userApi";

function EmployeeListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newBalance, setNewBalance] = useState("");

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeactivate = async (id) => {
    setError("");
    try {
      await deactivateUser(id);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  const handleEditClick = (id, currentBalance) => {
    setEditingId(id);
    setNewBalance(currentBalance);
  };

  const handleBalanceSubmit = async (id) => {
    setError("");
    try {
      await updateLeaveBalance(id, Number(newBalance));
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Personel Listesi</h1>
          <p>Mevcut personelleri görüntüleyin ve yönetin.</p>
        </div>

        <div className="card">
          {error && <div className="error-message">{error}</div>}
          {loading && <p>Yükleniyor...</p>}

          {!loading && (
            <table>
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>İzin Bakiyesi</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {editingId === user.id ? (
                        <>
                          <input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            style={{ width: 60, padding: 4, marginRight: 6 }}
                          />
                          <button className="btn btn-primary" onClick={() => handleBalanceSubmit(user.id)}>
                            Kaydet
                          </button>
                        </>
                      ) : (
                        <>
                          {user.annualLeaveBalance}{" "}
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEditClick(user.id, user.annualLeaveBalance)}
                          >
                            Düzenle
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${user.active ? "status-APPROVED" : "status-REJECTED"}`}>
                        {user.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td>
                      {user.active && (
                        <button className="btn btn-danger" onClick={() => handleDeactivate(user.id)}>
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

export default EmployeeListPage;