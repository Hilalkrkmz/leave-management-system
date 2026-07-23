import { useState, useEffect } from "react";
import { getAllUsers, deactivateUser, updateLeaveBalance } from "../../api/userApi";

function ManageEmployeesPage() {
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
      <h2>Personel Yönetimi</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Yükleniyor...</p>}

      {!loading && (
        <table border="1" cellPadding="8">
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
                      />
                      <button onClick={() => handleBalanceSubmit(user.id)}>Kaydet</button>
                    </>
                  ) : (
                    <>
                      {user.annualLeaveBalance}{" "}
                      <button onClick={() => handleEditClick(user.id, user.annualLeaveBalance)}>
                        Düzenle
                      </button>
                    </>
                  )}
                </td>
                <td>{user.active ? "Aktif" : "Pasif"}</td>
                <td>
                  {user.active && (
                    <button onClick={() => handleDeactivate(user.id)}>Pasif Yap</button>
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

export default ManageEmployeesPage;