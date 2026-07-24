import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { adminLinks, employeeLinks } from "../components/layout/navLinks";
import { changePassword, getCurrentUserInfo } from "../api/userApi";

function ProfilePage() {
  const role = localStorage.getItem("role");
  const links = role === "ADMIN" ? adminLinks : employeeLinks;

  const [userInfo, setUserInfo] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCurrentUserInfo()
      .then((data) => setUserInfo(data))
      .catch((err) => console.log("Hata:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Şifreniz başarıyla güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={links} />
      <div className="page-container">
        <div className="page-header">
          <h1>Profilim</h1>
          <p>Hesap bilgilerinizi görüntüleyin ve şifrenizi değiştirin.</p>
        </div>

        <div className="card">
          <h2>Hesap Bilgileri</h2>
          {userInfo ? (
            <>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Rol:</strong> {userInfo.role === "ADMIN" ? "Admin" : "Personel"}</p>

              {role === "EMPLOYEE" && (
                <>
                  <p><strong>Kalan İzin Bakiyesi:</strong> {userInfo.annualLeaveBalance} gün</p>
                  <p><strong>Hesap Oluşturulma Tarihi:</strong> {new Date(userInfo.createdAt).toLocaleDateString("tr-TR")}</p>
                </>
              )}
            </>
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>

        <div className="card">
          <h2>Şifre Değiştir</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mevcut Şifre</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Yeni Şifre</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Yeni Şifre (Tekrar)</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="btn btn-primary">Şifreyi Güncelle</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;