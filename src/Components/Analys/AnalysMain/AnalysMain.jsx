import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiPackage,
  FiLink,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
  FaPhoneAlt,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import "./AnalysMain.scss";

const TOOLS_PER_PAGE = 5;

function AnalysMain() {
  const [period, setPeriod] = useState("month");
  const [toolsPage, setToolsPage] = useState(0);

  const m = {
    day: 0.03,
    week: 0.25,
    month: 1,
    year: 12,
  }[period];

  const userGrowth = {
    day: 0.95,
    week: 0.98,
    month: 1,
    year: 1.5,
  }[period];

  // ================= MOCK DATALAR ================= //

  const totalUsers = Math.round(5200 * userGrowth);
  const activeUsers = Math.round(totalUsers * 0.92);
  const blockedUsers = totalUsers - activeUsers;
  const totalViews = Math.round(450000 * m);

  const summaryStats = [
    {
      title: "İstifadəçi Sayı",
      value: totalUsers,
      icon: <FiUsers />,
      color: "#3b82f6",
      trend: "+5%",
    },
    {
      title: "İşlək Hesablar",
      value: activeUsers,
      icon: <FiUserCheck />,
      color: "#10b981",
      trend: "+3%",
    },
    {
      title: "Bloklu Hesablar",
      value: blockedUsers,
      icon: <FiUserX />,
      color: "#ef4444",
      trend: "-1%",
    },
    {
      title: "Ümumi Oxunma",
      value: totalViews,
      icon: <FiEye />,
      color: "#8b5cf6",
      trend: "+25%",
    },
  ];

  // Paket Seçimi
  const packageData = [
    {
      name: "Free",
      count: Math.round(1500 * userGrowth),
      percent: 35,
      color: "#9ca3af",
    },
    {
      name: "Basic",
      count: Math.round(2000 * userGrowth),
      percent: 45,
      color: "#3b82f6",
    },
    {
      name: "Premium",
      count: Math.round(1200 * userGrowth),
      percent: 15,
      color: "#f59e0b",
    },
    {
      name: "VIP",
      count: Math.round(500 * userGrowth),
      percent: 5,
      color: "#8b5cf6",
    },
  ];

  // Ən Çox Toxunulan Vasitələr (10 item — 2 page × 5)
  const toolsData = [
    {
      name: "Instagram",
      icon: <FaInstagram />,
      count: Math.round(120000 * m),
      percent: 28,
      color: "#E1306C",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      count: Math.round(85000 * m),
      percent: 20,
      color: "#25D366",
    },
    {
      name: "Telefon Zəngi",
      icon: <FaPhoneAlt />,
      count: Math.round(45000 * m),
      percent: 11,
      color: "#3b82f6",
    },
    {
      name: "TikTok",
      icon: <FaTiktok />,
      count: Math.round(40000 * m),
      percent: 10,
      color: "#000000",
    },
    {
      name: "Telegram",
      icon: <FaTelegram />,
      count: Math.round(38000 * m),
      percent: 9,
      color: "#0088cc",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      count: Math.round(32000 * m),
      percent: 8,
      color: "#1877F2",
    },
    {
      name: "YouTube",
      icon: <FaYoutube />,
      count: Math.round(25000 * m),
      percent: 6,
      color: "#FF0000",
    },
    {
      name: "Twitter / X",
      icon: <FaTwitter />,
      count: Math.round(18000 * m),
      percent: 4,
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      count: Math.round(12000 * m),
      percent: 3,
      color: "#0A66C2",
    },
    {
      name: "E-poçt",
      icon: <FaEnvelope />,
      count: Math.round(5000 * m),
      percent: 1,
      color: "#6366f1",
    },
  ];

  const totalToolsPages = Math.ceil(toolsData.length / TOOLS_PER_PAGE);
  const paginatedTools = toolsData.slice(
    toolsPage * TOOLS_PER_PAGE,
    (toolsPage + 1) * TOOLS_PER_PAGE
  );

  // Top 10 İstifadəçi
  const topUsers = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `İstifadəçi ${i + 1}`,
    username: `@user_demo_${i + 1}`,
    views: Math.round((50000 - i * 4500) * m),
  }));

  const handlePeriodChange = (p) => {
    setPeriod(p);
    setToolsPage(0);
  };

  return (
    <div className="analys-main-modern">
      {/* BAŞLIQ VƏ FİLTRLƏR */}
      <div className="top-header">
        <div className="title-area">
          <h2 className="page-title">Superadmin Analitika</h2>
          <p className="page-subtitle">
            Sistemdəki bütün məlumatların detallı hesabatı.
          </p>
        </div>

        <div className="period-filters">
          {[
            { key: "day", label: "Günlük" },
            { key: "week", label: "Həftəlik" },
            { key: "month", label: "Aylıq" },
            { key: "year", label: "İllik" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={period === key ? "active" : ""}
              onClick={() => handlePeriodChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="analys-content">
        {/* ÜMUMİ STATİSTİKA KARTLARI */}
        <div className="summary-cards-row">
          {summaryStats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div className="stat-info">
                <h4>{stat.title}</h4>
                <div className="stat-bottom">
                  <span className="value">{stat.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLI ANALİZ QRİDİ */}
        <div className="dashboard-grid">
          {/* 1. PAKETLƏR */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <FiPackage className="head-icon" /> Paket Seçimi
              </h3>
            </div>
            <div className="card-body">
              {packageData.map((item, index) => (
                <div className="progress-row" key={index}>
                  <div className="row-info">
                    <span className="item-name">{item.name} Paketi</span>
                    <span className="item-count">{item.count} ist.</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. VASİTƏLƏR (paginasiya ilə) */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <FiLink className="head-icon" /> Ən çox toxunulan vasitə
              </h3>
            </div>
            <div className="card-body">
              {paginatedTools.map((item, index) => (
                <div className="progress-row" key={index}>
                  <div className="row-info">
                    <div className="info-left">
                      <span className="item-icon" style={{ color: item.color }}>
                        {item.icon}
                      </span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-count">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGİNASİYA */}
            <div className="card-pagination">
              <button
                className="pag-btn"
                onClick={() => setToolsPage((p) => p - 1)}
                disabled={toolsPage === 0}
                aria-label="Əvvəlki səhifə"
              >
                <FiChevronLeft />
              </button>
              <span className="pag-info">
                {toolsPage + 1} / {totalToolsPages}
              </span>
              <button
                className="pag-btn"
                onClick={() => setToolsPage((p) => p + 1)}
                disabled={toolsPage === totalToolsPages - 1}
                aria-label="Növbəti səhifə"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* 3. TOP 10 İSTİFADƏÇİ (Geniş Kart) */}
          <div className="dashboard-card top-users-card">
            <div className="card-header">
              <h3>
                <FiAward className="head-icon" /> Ən Çox Baxışı Olan 10
                İstifadəçi
              </h3>
            </div>
            <div className="card-body top-users-list">
              {topUsers.map((user) => (
                <div className="top-user-item" key={user.rank}>
                  <div className="user-left">
                    <div
                      className={`rank ${user.rank <= 3 ? `top-${user.rank}` : ""}`}
                    >
                      {user.rank}
                    </div>
                    <div className="user-details">
                      <span className="name">{user.name}</span>
                      <span className="username">{user.username}</span>
                    </div>
                  </div>
                  <div className="user-right">
                    <span className="views-badge">
                      {user.views.toLocaleString()} baxış
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysMain;
