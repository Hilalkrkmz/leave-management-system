import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";

function EmployeesLandingPage() {
  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>Personel Yönetimi</h1>
          <p>Ne yapmak istersiniz?</p>
        </div>

        <div className="option-cards">
          <Link to="/admin/employees/add" className="option-card">
            <div className="option-card-icon" style={{ backgroundColor: "#dbeafe" }}>👤</div>
            <div className="option-card-title">Personel Ekle</div>
            <div className="option-card-subtitle">Yeni hesap oluştur</div>
          </Link>

          <Link to="/admin/employees/list" className="option-card">
            <div className="option-card-icon" style={{ backgroundColor: "#dcfce7" }}>📋</div>
            <div className="option-card-title">Personel Listesi</div>
            <div className="option-card-subtitle">Görüntüle ve yönet</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmployeesLandingPage;