import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiDollarSign,
  FiEye,
  FiPackage,
  FiLink,
  FiMapPin,
  FiAward,
} from "react-icons/fi";
import {
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";
import "./AnalysMain.scss";

function AnalysMain() {
  // Zaman filtri üçün state (day, week, month, year)
  const [period, setPeriod] = useState("month");

  // Zaman aralığına görə məlumatları dəyişmək üçün vuruq məntiqi
  // Gəlir və oxunma sayı tam dəyişəcək, istifadəçi sayları isə cüzi (böyümə məntiqi ilə)
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

  // 1. Ümumi Statistika (Üst kartlar)
  const totalUsers = Math.round(5200 * userGrowth);
  const activeUsers = Math.round(totalUsers * 0.92);
  const blockedUsers = totalUsers - activeUsers;
  const income = Math.round(14500 * m);
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
      title: "Ümumi Gəlir",
      value: `${income} ₼`,
      icon: <FiDollarSign />,
      color: "#f59e0b",
      trend: "+12%",
    },
    {
      title: "Ümumi Oxunma",
      value: totalViews,
      icon: <FiEye />,
      color: "#8b5cf6",
      trend: "+25%",
    },
  ];

  // 2. Paket Seçimi
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

  // 3. Ən Çox Toxunulan Vasitələr
  const toolsData = [
    {
      name: "Instagram",
      icon: <FaInstagram />,
      count: Math.round(120000 * m),
      percent: 45,
      color: "#E1306C",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      count: Math.round(85000 * m),
      percent: 30,
      color: "#25D366",
    },
    {
      name: "Telefon Zəngi",
      icon: <FaPhoneAlt />,
      count: Math.round(45000 * m),
      percent: 15,
      color: "#3b82f6",
    },
    {
      name: "TikTok",
      icon: <FaTiktok />,
      count: Math.round(25000 * m),
      percent: 8,
      color: "#000000",
    },
    {
      name: "Telegram",
      icon: <FaTelegram />,
      count: Math.round(15000 * m),
      percent: 2,
      color: "#0088cc",
    },
  ];

  // 4. Ən Çox İstifadə Edilən Bölgələr
  const locationData = [
    {
      country: "Azərbaycan",
      city: "Bakı",
      count: Math.round(280000 * m),
      percent: 65,
    },
    {
      country: "Azərbaycan",
      city: "Sumqayıt",
      count: Math.round(65000 * m),
      percent: 15,
    },
    {
      country: "Azərbaycan",
      city: "Gəncə",
      count: Math.round(45000 * m),
      percent: 10,
    },
    {
      country: "Türkiyə",
      city: "İstanbul",
      count: Math.round(30000 * m),
      percent: 7,
    },
    {
      country: "Rusiya",
      city: "Moskva",
      count: Math.round(15000 * m),
      percent: 3,
    },
  ];

  // 5. Ən Çox Baxışı Olan 10 İstifadəçi
  const topUsers = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `İstifadəçi ${i + 1}`,
    username: `@user_demo_${i + 1}`,
    views: Math.round((50000 - i * 4500) * m),
  }));

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

        {/* ZAMAN FİLTRİ */}
        <div className="period-filters">
          <button
            className={period === "day" ? "active" : ""}
            onClick={() => setPeriod("day")}
          >
            Günlük
          </button>
          <button
            className={period === "week" ? "active" : ""}
            onClick={() => setPeriod("week")}
          >
            Həftəlik
          </button>
          <button
            className={period === "month" ? "active" : ""}
            onClick={() => setPeriod("month")}
          >
            Aylıq
          </button>
          <button
            className={period === "year" ? "active" : ""}
            onClick={() => setPeriod("year")}
          >
            İllik
          </button>
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

          {/* 2. VASİTƏLƏR */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <FiLink className="head-icon" /> Ən çox toxunulan vasitə
              </h3>
            </div>
            <div className="card-body">
              {toolsData.map((item, index) => (
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
          </div>

          {/* 3. BÖLGƏLƏR */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <FiMapPin className="head-icon" /> Ən çox istifadə edilən bölgə
              </h3>
            </div>
            <div className="card-body">
              {locationData.map((item, index) => (
                <div className="location-row" key={index}>
                  <div className="loc-left">
                    <div className="loc-texts">
                      <span className="city">{item.city}</span>
                      <span className="country">{item.country}</span>
                    </div>
                  </div>
                  <div className="loc-right">
                    <span className="loc-count">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="loc-percent">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. TOP 10 İSTİFADƏÇİ (Geniş Kart) */}
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
