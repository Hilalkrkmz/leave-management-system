import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { adminLinks } from "../../components/layout/navLinks";

function LeaveTypesLandingPage() {
  return (
    <div>
      <Navbar links={adminLinks} />
      <div className="page-container">
        <div className="page-header">
          <h1>İzin Türü Yönetimi</h1>
          <p>Ne yapmak istersiniz?</p>
        </div>

        <div className="option-cards">
          <Link to="/admin/leave-types/add" className="option-card">
            <div className="option-card-icon" style={{ backgroundColor: "#dbeafe" }}>➕</div>
            <div className="option-card-title">İzin Türü Ekle</div>
            <div className="option-card-subtitle">Yeni tür oluştur</div>
          </Link>

          <Link to="/admin/leave-types/list" className="option-card">
            <div className="option-card-icon" style={{ backgroundColor: "#dcfce7" }}>📋</div>
            <div className="option-card-title">Mevcut İzin Türleri</div>
            <div className="option-card-subtitle">Görüntüle ve yönet</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LeaveTypesLandingPage;