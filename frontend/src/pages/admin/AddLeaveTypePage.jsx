import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";
import { createLeaveType } from "../../api/leaveTypeApi";

function AddLeaveTypePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createLeaveType({ name, description, isActive: true });
      setSuccess("İzin türü başarıyla eklendi.");
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>İzin Türü Ekle</h1>
          <p>Sisteme yeni bir izin türü ekleyin.</p>
        </div>

        <div className="card">
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
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="btn btn-primary">Ekle</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLeaveTypePage;