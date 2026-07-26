import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingRequests } from "../../api/leaveRequestApi";

function AdminNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = () => {
    getPendingRequests()
      .then((requests) => {
        const items = requests.map((r) => ({
          id: r.id,
          title: `${r.employeeName} yeni bir izin talebi oluşturdu`,
          detail: `${r.leaveTypeName} — ${r.startDate} - ${r.endDate}`,
        }));

        setNotifications(items);

        const seenIds = JSON.parse(localStorage.getItem("adminSeenRequestIds") || "[]");
        const unseen = items.filter((item) => !seenIds.includes(item.id));
        setUnseenCount(unseen.length);
      })
      .catch((err) => console.log("Hata:", err));
  };

  useEffect(() => {
  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllSeen = (items) => {
    const allIds = items.map((n) => n.id);
    localStorage.setItem("adminSeenRequestIds", JSON.stringify(allIds));
    setUnseenCount(0);
  };

  const handleBellClick = () => {
    const opening = !panelOpen;
    setPanelOpen(opening);
    if (opening) {
      markAllSeen(notifications);
    }
  };

  const handleItemClick = () => {
    markAllSeen(notifications);
    setPanelOpen(false);
    navigate("/admin");
  };

  return (
    <div className="notification-wrapper" ref={wrapperRef}>
      <button className="notification-bell" onClick={handleBellClick}>
        🔔
        {unseenCount > 0 && <span className="notification-badge">{unseenCount}</span>}
      </button>

      {panelOpen && (
        <div className="notification-panel">
          {notifications.length === 0 ? (
            <div className="notification-empty">Bekleyen talep yok.</div>
          ) : (
            notifications
              .slice()
              .reverse()
              .map((n) => (
                <div key={n.id} className="notification-item" onClick={handleItemClick} style={{ cursor: "pointer" }}>
                  <div className="notification-item-title">{n.title}</div>
                  <div className="notification-item-detail">{n.detail}</div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminNotificationBell;