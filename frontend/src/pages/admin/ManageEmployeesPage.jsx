import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { getAllUsers, deactivateUser, updateLeaveBalance, registerUser } from "../../api/userApi";
import { adminLinks } from "../../components/layout/navLinks";

function ManageEmployeesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newBalance, setNewBalance] = useState("");

  // Yeni personel formu için state'ler
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await registerUser({ firstName, lastName, email, password, role });
      setFormSuccess("Personel başarıyla eklendi.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYEE");
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

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
          <h1>Personel Yönetimi</h1>
          <p>Personelleri görüntüleyin, yönetin ve yeni personel ekleyin.</p>
        </div>

        <div className="card">
          <h2>Yeni Personel Ekle</h2>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Ad</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="EMPLOYEE">Personel</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-message">{formSuccess}</div>}
            <button type="submit" className="btn btn-primary">Personel Ekle</button>
          </form>
        </div>

        <div className="card">
          <h2>Personel Listesi</h2>

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

export default ManageEmployeesPage;