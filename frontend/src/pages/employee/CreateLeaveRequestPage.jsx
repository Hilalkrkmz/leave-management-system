import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { createLeaveRequest } from "../../api/leaveRequestApi";
import { getAllLeaveTypes } from "../../api/leaveTypeApi";
import { employeeLinks } from "../../components/layout/navLinks";

function CreateLeaveRequestPage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    getAllLeaveTypes()
      .then((data) => setLeaveTypes(data))
      .catch((err) => console.log("Hata:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      await createLeaveRequest({
        leaveTypeId: Number(leaveTypeId),
        startDate,
        endDate,
        reason,
      });
      setFormSuccess("İzin talebiniz başarıyla oluşturuldu.");
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <Navbar links={employeeLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Yeni İzin Talebi</h1>
          <p>İzin talebinizi oluşturmak için formu doldurun.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>İzin Türü</label>
              <select value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)} required>
                <option value="">Seçiniz</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Başlangıç Tarihi</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Bitiş Tarihi</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Sebep</label>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-message">{formSuccess}</div>}
            <button type="submit" className="btn btn-primary">Talep Oluştur</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLeaveRequestPage;