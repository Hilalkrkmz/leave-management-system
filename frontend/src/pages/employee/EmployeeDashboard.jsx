import { useState, useEffect } from "react";
import { getMyLeaveRequests, createLeaveRequest } from "../../api/leaveRequestApi";
import { getAllLeaveTypes } from "../../api/leaveTypeApi";

function EmployeeDashboard() {
  const email = localStorage.getItem("email");
  const [requests, setRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const loadRequests = () => {
    getMyLeaveRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.log("Hata:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
    getAllLeaveTypes()
      .then((data) => setLeaveTypes(data))
      .catch((err) => console.log("Hata:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

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
      setFormSuccess("İzin talebiniz oluşturuldu.");
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
      setReason("");
      loadRequests();
    } catch (err) {
      setFormError(err.response?.data?.message || "Bir hata oluştu.");
    }
  };

  return (
    <div>
      <h1>Personel Paneli</h1>
      <p>Hoş geldin, {email}</p>
      <button onClick={handleLogout}>Çıkış Yap</button>

      <h2>Yeni İzin Talebi</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>İzin Türü:</label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            required
          >
            <option value="">Seçiniz</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Başlangıç Tarihi:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bitiş Tarihi:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sebep:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        {formSuccess && <p style={{ color: "green" }}>{formSuccess}</p>}
        <button type="submit">Talep Oluştur</button>
      </form>

      <h2>İzin Taleplerim</h2>

      {loading && <p>Yükleniyor...</p>}

      {!loading && requests.length === 0 && (
        <p>Henüz bir izin talebin yok.</p>
      )}

      {!loading && requests.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>İzin Türü</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Gün Sayısı</th>
              <th>Durum</th>
              <th>Red Sebebi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.leaveTypeName}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>{req.totalDays}</td>
                <td>{req.status}</td>
                <td>{req.rejectionReason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeDashboard;