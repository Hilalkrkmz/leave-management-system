function AdminDashboard() {
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Admin Paneli</h1>
      <p>Hoş geldin, {email}</p>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

export default AdminDashboard;