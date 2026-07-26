import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import { registerUser } from "../../api/userApi";

function AddEmployeePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await registerUser({ firstName, lastName, email, password, role });
      setSuccess("Personel başarıyla eklendi.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYEE");
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Personel Ekle</h1>
          <p>Sisteme yeni bir personel veya admin hesabı ekleyin.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
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
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="btn btn-primary">Personel Ekle</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployeePage;