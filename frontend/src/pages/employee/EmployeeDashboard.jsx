function EmployeeDashboard() {
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Personel Paneli</h1>
      <p>Hoş geldin, {email}</p>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

export default EmployeeDashboard;