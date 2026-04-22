import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaTag,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaBox,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaIdBadge,
} from "react-icons/fa";
import { MdOutlineDiscount } from "react-icons/md";
import "./PromoCodeMain.scss";
import Popup from "../../Popup/Popup";

const PROMO_DATA = [
  {
    id: 1,
    userCode: "SYD4568",
    name: "Elçin Məmmədov",
    promoCode: "ELCIN20",
    usageCount: 34,
    remainingCount: 66,
    totalLimit: 100,
    earnedPayment: 680,
    activeUntil: "2025-12-31",
    package: "Premium",
    status: "active",
  },
  {
    id: 2,
    userCode: "SYD8892",
    name: "Aysel Əliyeva",
    promoCode: "AYSEL50",
    usageCount: 12,
    remainingCount: 38,
    totalLimit: 50,
    earnedPayment: 1200,
    activeUntil: "2025-09-15",
    package: "VIP",
    status: "active",
  },
  {
    id: 3,
    userCode: "SYD1122",
    name: "Rəşad Həsənov",
    promoCode: "RESHAD10",
    usageCount: 5,
    remainingCount: 0,
    totalLimit: 5,
    earnedPayment: 250,
    activeUntil: "2025-06-01",
    package: "Basic",
    status: "expired",
  },
  {
    id: 4,
    userCode: "SYD9900",
    name: "Nigar Quliyeva",
    promoCode: "NIGAR25",
    usageCount: 88,
    remainingCount: 12,
    totalLimit: 100,
    earnedPayment: 4400,
    activeUntil: "2026-03-20",
    package: "VIP",
    status: "active",
  },
  {
    id: 5,
    userCode: "SYD5555",
    name: "Orxan Nəbiyev",
    promoCode: "ORXAN30",
    usageCount: 0,
    remainingCount: 75,
    totalLimit: 75,
    earnedPayment: 0,
    activeUntil: "2026-06-01",
    package: "Premium",
    status: "active",
  },
  {
    id: 6,
    userCode: "SYD3310",
    name: "Leyla Mustafayeva",
    promoCode: "LEYLA15",
    usageCount: 60,
    remainingCount: 40,
    totalLimit: 100,
    earnedPayment: 3000,
    activeUntil: "2025-11-01",
    package: "Starter",
    status: "active",
  },
  {
    id: 7,
    userCode: "SYD7741",
    name: "Tural İsmayılov",
    promoCode: "TURAL20",
    usageCount: 20,
    remainingCount: 0,
    totalLimit: 20,
    earnedPayment: 980,
    activeUntil: "2025-05-10",
    package: "Basic",
    status: "expired",
  },
];

const MONTHS = [
  "yanvar","fevral","mart","aprel","may","iyun",
  "iyul","avqust","sentyabr","oktyabr","noyabr","dekabr",
];

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function isExpired(dateStr) {
  return new Date(dateStr) < new Date();
}

const packageColors = {
  VIP: "#d4af37",
  Premium: "#3b82f6",
  Basic: "#10b981",
  Starter: "#8b5cf6",
  Free: "#6b7280",
};

const ITEMS_PER_PAGE = 5;

function PromoCodeMain() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PROMO_DATA[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState({ isOpen: false });
  const [copied, setCopied] = useState(false);

  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PROMO_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.promoCode.toLowerCase().includes(q) ||
        p.userCode.toLowerCase().includes(q) ||
        p.package.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.promoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDeactivate = () => {
    setPopup({
      isOpen: true,
      type: "block",
      title: "Promo Kodu Deaktiv Et",
      message: `"${selected.promoCode}" kodu deaktiv ediləcək. İstifadəçilər bu kodu artıq istifadə edə bilməyəcək.`,
      confirmText: "Deaktiv Et",
      onConfirm: () => closePopup(),
    });
  };

  const usagePercent =
    selected.totalLimit > 0
      ? Math.round((selected.usageCount / selected.totalLimit) * 100)
      : 0;

  const expired =
    selected.status === "expired" || isExpired(selected.activeUntil);

  return (
    <div className="promo-main">
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        confirmText={popup.confirmText}
        cancelText="Ləğv et"
        onConfirm={() => {
          popup.onConfirm?.();
          closePopup();
        }}
        onCancel={closePopup}
      />

      {/* ═══════ SOL PANEL ═══════ */}
      <div className="promo-list-panel">
        <div className="panel-header">
          <div className="header-top">
            <h2>Promo Kodlar</h2>
            <span className="total-badge">{PROMO_DATA.length} kod</span>
          </div>
          <div className="search-wrap">
            <FaSearch className="s-icon" />
            <input
              type="text"
              placeholder="Ad, ID, kod və ya paket ilə axtar..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="promo-list">
          {paginated.map((item) => {
            const exp = item.status === "expired" || isExpired(item.activeUntil);
            return (
              <div
                key={item.id}
                className={`promo-row ${selected.id === item.id ? "row-active" : ""} ${exp ? "row-expired" : ""}`}
                onClick={() => setSelected(item)}
              >
                <div className="row-left">
                  <div className="row-avatar">{item.name.charAt(0)}</div>
                  <div className="row-info">
                    <span className="row-name">{item.name}</span>
                    <span className="row-uid">
                      <FaIdBadge /> {item.userCode}
                    </span>
                    <span className="row-code">
                      <FaTag /> {item.promoCode}
                    </span>
                  </div>
                </div>
                <div className="row-right">
                  <span
                    className="row-package"
                    style={{ color: packageColors[item.package] || "#d4af37" }}
                  >
                    {item.package}
                  </span>
                  <span className={`row-status ${exp ? "status-expired" : "status-active"}`}>
                    {exp ? "Bitib" : "Aktiv"}
                  </span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="empty-state">
              <MdOutlineDiscount />
              <p>Nəticə tapılmadı</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pg-btn"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`pg-num ${currentPage === n ? "pg-active" : ""}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="pg-btn"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* ═══════ SAĞ PANEL ═══════ */}
      <div className="promo-detail-panel">
        <div className="detail-header">
          <div className="dh-left">
            <div className="detail-avatar">{selected.name.charAt(0)}</div>
            <div>
              <h3>{selected.name}</h3>
              <span className="dh-uid">
                <FaIdBadge /> {selected.userCode}
              </span>
            </div>
          </div>
          <div className="dh-right">
            <span
              className="pkg-badge"
              style={{
                background: `${packageColors[selected.package] || "#d4af37"}18`,
                color: packageColors[selected.package] || "#d4af37",
                borderColor: `${packageColors[selected.package] || "#d4af37"}40`,
              }}
            >
              <FaBox /> {selected.package}
            </span>
            <span className={`status-badge ${expired ? "badge-expired" : "badge-active"}`}>
              {expired ? <FaTimesCircle /> : <FaCheckCircle />}
              {expired ? "Bitib" : "Aktiv"}
            </span>
          </div>
        </div>

        {/* Promo kod kartı */}
        <div className="code-card">
          <div className="code-label">
            <FaTag /> Promo Kod
          </div>
          <div className="code-value">
            <span>{selected.promoCode}</span>
            <button
              className={`copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              <FaCopy /> {copied ? "Kopyalandı!" : "Kopyala"}
            </button>
          </div>
        </div>

        {/* Stat kartları */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon icon-blue">
              <FaUsers />
            </div>
            <div className="stat-info">
              <span className="stat-label">İstifadə edilən</span>
              <strong className="stat-val">
                {selected.usageCount}
                <span className="active-chip">aktiv</span>
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-gold">
              <FaTag />
            </div>
            <div className="stat-info">
              <span className="stat-label">Qalan say</span>
              <strong className="stat-val">{selected.remainingCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              <FaMoneyBillWave />
            </div>
            <div className="stat-info">
              <span className="stat-label">Əldə etdiyi ödəniş</span>
              <strong className="stat-val">{selected.earnedPayment} ₼</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-purple">
              <FaClock />
            </div>
            <div className="stat-info">
              <span className="stat-label">Aktivlik vaxtı</span>
              <strong className="stat-val">
                {formatDateShort(selected.activeUntil)}
              </strong>
            </div>
          </div>
        </div>

        {/* İstifadə progress */}
        <div className="usage-section">
          <div className="usage-top">
            <span className="usage-title">
              <FaFire /> İstifadə Progressi
            </span>
            <span className="usage-nums">
              {selected.usageCount} / {selected.totalLimit}
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-fill"
              style={{
                width: `${usagePercent}%`,
                background:
                  usagePercent >= 90
                    ? "linear-gradient(90deg,#ef4444,#dc2626)"
                    : usagePercent >= 60
                      ? "linear-gradient(90deg,#f59e0b,#d97706)"
                      : "linear-gradient(90deg,#d4af37,#bc9a2e)",
              }}
            />
          </div>
          <div className="usage-bottom">
            <span>{usagePercent}% istifadə edilib</span>
            <span>{selected.remainingCount} kod qalıb</span>
          </div>
        </div>

        {!expired && (
          <div className="detail-footer">
            <button className="deactivate-btn" onClick={handleDeactivate}>
              <FaTimesCircle /> Kodu Deaktiv Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PromoCodeMain;
