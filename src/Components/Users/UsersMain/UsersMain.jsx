import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaBan,
  FaCrown,
  FaUserCheck,
  FaEnvelope,
  FaIdBadge,
  FaEye,
  FaSave,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaGlobe,
  FaFire,
  FaLinkedin,
  FaPlus,
  FaKey,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./UsersMain.scss";
import Popup from "../../Popup/Popup";

const iconMap = {
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
  tiktok: <FaTiktok />,
  website: <FaGlobe />,
  linkedin: <FaLinkedin />,
};

const initialUsers = [
  {
    id: 1,
    name: "Elçin Məmmədov",
    email: "elcin@example.com",
    profession: "Frontend Developer",
    skills: ["React", "CSS", "UI/UX"],
    about:
      "Minimalist və müasir interfeyslər qurmağı sevirəm. 3 ildən artıq təcrübəm var.",
    status: "active",
    package: "Premium",
    totalViews: 1250,
    userCode: "SYD4568",
    avatar: "https://i.pravatar.cc/150?img=11",
    platforms: [
      {
        id: "p1",
        type: "instagram",
        name: "Instagram",
        handle: "@elcin_dev",
        views: 850,
        color: "#E1306C",
      },
      {
        id: "p2",
        type: "website",
        name: "Vebsayt",
        handle: "elcin.dev",
        views: 300,
        color: "#3b82f6",
      },
      {
        id: "p3",
        type: "linkedin",
        name: "LinkedIn",
        handle: "in/elcinm",
        views: 100,
        color: "#0077b5",
      },
    ],
  },
  {
    id: 2,
    name: "Aysel Əliyeva",
    email: "aysel@example.com",
    profession: "Digital Marketer",
    skills: ["SMM", "SEO", "Copywriting"],
    about: "Rəqəmsal marketinq üzrə 5 illik təcrübə.",
    status: "active",
    package: "VIP",
    totalViews: 3400,
    userCode: "SYD8892",
    avatar: "https://i.pravatar.cc/150?img=5",
    platforms: [
      {
        id: "p4",
        type: "tiktok",
        name: "TikTok",
        handle: "@aysel_marketing",
        views: 2100,
        color: "#000000",
      },
      {
        id: "p5",
        type: "instagram",
        name: "Instagram",
        handle: "@aysel.smm",
        views: 1000,
        color: "#E1306C",
      },
      {
        id: "p6",
        type: "whatsapp",
        name: "WhatsApp",
        handle: "+994 55 123 45 67",
        views: 300,
        color: "#25D366",
      },
    ],
  },
  {
    id: 3,
    name: "Rəşad Həsənov",
    email: "reshad@example.com",
    profession: "Backend Developer",
    skills: ["Node.js", "Python", "SQL"],
    about: "Data bazaları və server məntiqi üzrə mütəxəssis.",
    status: "blocked",
    package: "Basic",
    totalViews: 850,
    userCode: "SYD1122",
    avatar: "https://i.pravatar.cc/150?img=8",
    platforms: [],
  },
  {
    id: 4,
    name: "Nigar Quliyeva",
    email: "nigar@example.com",
    profession: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Sketch"],
    about: "İstifadəçi təcrübəsini mükəmməlləşdirən dizaynlar.",
    status: "active",
    package: "Free",
    totalViews: 420,
    userCode: "SYD9900",
    avatar: "https://i.pravatar.cc/150?img=9",
    platforms: [],
  },
  {
    id: 5,
    name: "Orxan Nəbiyev",
    email: "orxan@example.com",
    profession: "Project Manager",
    skills: ["Agile", "Scrum", "Jira"],
    about: "Komandaları idarə edirəm.",
    status: "active",
    package: "VIP",
    totalViews: 5000,
    userCode: "SYD5555",
    avatar: "https://i.pravatar.cc/150?img=12",
    platforms: [],
  },
];

const getEmptyUser = () => ({
  id: null,
  userCode: "SYD" + Math.floor(1000 + Math.random() * 9000),
  password: "",
  name: "Yeni İstifadəçi",
  email: "Qeyd olunmayıb",
  profession: "Məlumat yoxdur",
  skills: [],
  about: "",
  status: "active",
  package: "Free",
  totalViews: 0,
  avatar: "https://i.pravatar.cc/150?img=1",
  platforms: [],
});

function UsersMain() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeUser, setActiveUser] = useState(initialUsers[0]);
  const [editCode, setEditCode] = useState(initialUsers[0].userCode);
  const [editStatus, setEditStatus] = useState(initialUsers[0].status);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  /* ── Popup state ── */
  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));

  /* Köməkçi: popup açmaq */
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

  useEffect(() => {
    setEditCode(activeUser.userCode || "");
    setEditStatus(activeUser.status || "active");
  }, [activeUser]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const isCreating = activeUser.id === null;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.userCode.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (page) => setCurrentPage(page);

  /* ── Yeni istifadəçi yaratmaq ── */
  const handleCreateNewUser = () => {
    const newUser = { ...activeUser, id: Date.now() };
    setUsers([newUser, ...users]);
    setActiveUser(newUser);
  };

  /* ── Mövcud istifadəçini yadda saxlamaq ── */
  const handleSaveExisting = () => {
    const updated = users.map((u) =>
      u.id === activeUser.id
        ? { ...u, userCode: editCode, status: editStatus }
        : u,
    );
    setUsers(updated);
    setActiveUser({ ...activeUser, userCode: editCode, status: editStatus });
  };

  const toggleStatus = () =>
    setEditStatus(editStatus === "active" ? "blocked" : "active");

  const topPlatform =
    activeUser.platforms?.length > 0
      ? activeUser.platforms.reduce((prev, cur) =>
          prev.views > cur.views ? prev : cur,
        )
      : null;

  /* ─────────────────── POPUP TETİKLƏYİCİLƏR ─────────────────── */

  /* 1. Yeni istifadəçi yarat — validasiya + success popup */
  const handleCreateClick = () => {
    if (!activeUser.userCode || !activeUser.password) {
      openPopup({
        type: "error",
        title: "Məlumatlar çatışmır",
        message: "Zəhmət olmasa User Code və Şifrəni mütləq daxil edin.",
        confirmText: "Anladım",
        onConfirm: null,
      });
      return;
    }
    openPopup({
      type: "success",
      title: "Uğurla yaradıldı!",
      message: `"${activeUser.userCode}" kodu ilə yeni istifadəçi sistemə əlavə edildi.`,
      confirmText: "Əla",
      onConfirm: handleCreateNewUser,
    });
  };

  /* 2. Dəyişiklikləri saxla — update popup */
  const handleSaveClick = () => {
    openPopup({
      type: "update",
      title: "Dəyişikliklər saxlanılsın?",
      message: `"${activeUser.name}" istifadəçisinin məlumatları yenilənəcək.`,
      confirmText: "Yenilə",
      onConfirm: handleSaveExisting,
    });
  };

  /* 3. Blokla / Aktivləşdir */
  const handleBlockClick = () => {
    const willBlock = editStatus === "active";
    openPopup({
      type: willBlock ? "block" : "success",
      title: willBlock
        ? "Hesabı bloklamaq istəyirsiniz?"
        : "Hesabı aktivləşdirmək istəyirsiniz?",
      message: willBlock
        ? `"${activeUser.name}" artıq sistemə daxil ola bilməyəcək.`
        : `"${activeUser.name}" yenidən sistemi istifadə edə biləcək.`,
      confirmText: willBlock ? "Blokla" : "Aktivləşdir",
      onConfirm: toggleStatus,
    });
  };

  return (
    <div className="users-main-modern-split">
      {/* ── Popup ── */}
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

      {/* ═══════════════ SOL: İstifadəçi Siyahısı ═══════════════ */}
      <div className="users-list-section">
        <div className="list-header">
          <div className="title-row">
            <h2>İstifadəçilər</h2>
            <div className="title-actions">
              <span className="total-count">{users.length} hesab</span>
              <button
                className="add-btn"
                onClick={() => setActiveUser(getEmptyUser())}
              >
                <FaPlus /> Yeni
              </button>
            </div>
          </div>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Ad və ya Code ilə axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="users-grid-container">
          <div className="users-grid">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className={`user-square-card ${activeUser.id === user.id ? "active-card" : ""}`}
                onClick={() => setActiveUser(user)}
              >
                <div className="card-top">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div
                    className={`status-dot ${user.status === "active" ? "green" : "red"}`}
                  />
                </div>
                <div className="card-body">
                  <h4>{user.name}</h4>
                  <p>{user.profession}</p>
                </div>
                <div className="card-tags">
                  <span
                    className={`tag package-tag ${user.package.toLowerCase()}`}
                  >
                    {user.package === "VIP" && <FaCrown />} {user.package}
                  </span>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="no-results">İstifadəçi tapılmadı.</div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-nav-btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`page-num-btn ${currentPage === n ? "active-page" : ""}`}
                  onClick={() => paginate(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              className="page-nav-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════ SAĞ: Profil / Yaratma Paneli ═══════════════ */}
      <div className="info-section">
        <div className="top-header">
          <div>
            <h2 className="page-title">
              {isCreating ? "Yeni İstifadəçi Yarat ✨" : "Profil Detalları"}
            </h2>
            <p className="page-subtitle">
              {isCreating
                ? "Sistemə daxil olmaq üçün qısa məlumatları təyin edin"
                : "Sistemdəki qeydiyyat və statistika detalları"}
            </p>
          </div>
          {!isCreating && (
            <div className="header-actions">
              <span className={`badge ${activeUser.package.toLowerCase()}`}>
                {activeUser.package} Paket
              </span>
              <span className={`status-text ${editStatus}`}>
                {editStatus === "active" ? <FaUserCheck /> : <FaBan />}
                {editStatus === "active" ? " Aktiv" : " Bloklanıb"}
              </span>
            </div>
          )}
        </div>

        {isCreating ? (
          /* ─── YENİ İSTİFADƏÇİ FORMU ─── */
          <div className="modern-card profile-card create-mode-card">
            <div className="create-content">
              <div className="create-icon">
                <FaUserCheck />
              </div>
              <h3>Giriş Məlumatlarını Təyin Edin</h3>
              <p>
                Sadəcə unikal User Code və ilkin şifrə tələb olunur. Digər
                detalları istifadəçi özü dolduracaq.
              </p>
              <div className="create-inputs">
                <div className="input-box">
                  <label>
                    <FaIdBadge /> User Code
                  </label>
                  <input
                    type="text"
                    value={activeUser.userCode}
                    onChange={(e) =>
                      setActiveUser({ ...activeUser, userCode: e.target.value })
                    }
                  />
                </div>
                <div className="input-box">
                  <label>
                    <FaKey /> Şifrə (Parol)
                  </label>
                  <input
                    type="text"
                    placeholder="Şifrə daxil edin..."
                    value={activeUser.password || ""}
                    onChange={(e) =>
                      setActiveUser({ ...activeUser, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="admin-actions-footer">
              <button
                className="action-btn cancel-btn"
                onClick={() => users.length > 0 && setActiveUser(users[0])}
              >
                <FaTimes /> Ləğv Et
              </button>
              <button
                className="action-btn save-btn"
                onClick={handleCreateClick}
              >
                <FaSave /> Yarat və Yadda Saxla
              </button>
            </div>
          </div>
        ) : (
          /* ─── MÖVCUD PROFİL ─── */
          <div className="modern-card profile-card">
            <div className="profile-header-main">
              <div className="ph-left">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="main-avatar"
                />
                <div className="ph-titles">
                  <h3>{activeUser.name}</h3>
                  <p>{activeUser.profession}</p>
                  <div className="ph-skills">
                    {activeUser.skills.map((skill, i) => (
                      <span key={i} className="mini-skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ph-right">
                <div className="total-views-box">
                  <span>Ümumi Baxış</span>
                  <strong>
                    <FaEye /> {activeUser.totalViews.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="admin-control-grid">
              <div className="control-box">
                <label>
                  <FaIdBadge /> User Code (Dəyişdirilə bilər)
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="editable-input"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="control-box">
                <label>
                  <FaEnvelope /> Email Ünvanı
                </label>
                <div className="static-data">{activeUser.email}</div>
              </div>
            </div>

            <div className="about-section">
              <label>Haqqında Özəti</label>
              <p>
                {activeUser.about ||
                  "İstifadəçi özü haqqında məlumat qeyd etməyib."}
              </p>
            </div>

            <div className="platforms-section">
              <div className="section-title">
                <h4>Vasitələr və Baxış Sayı</h4>
                <span className="platform-count">
                  {activeUser.platforms.length} vasitə aktivdir
                </span>
              </div>
              <div className="platforms-list">
                {activeUser.platforms.map((platform) => {
                  const isTop = topPlatform && topPlatform.id === platform.id;
                  return (
                    <div
                      className={`platform-item ${isTop ? "is-top" : ""}`}
                      key={platform.id}
                    >
                      <div className="plat-left">
                        <div
                          className="plat-icon"
                          style={{
                            backgroundColor: `${platform.color}15`,
                            color: platform.color,
                          }}
                        >
                          {iconMap[platform.type]}
                        </div>
                        <div className="plat-info">
                          <h5>{platform.name}</h5>
                          <span className="plat-handle">{platform.handle}</span>
                        </div>
                      </div>
                      <div className="plat-right">
                        {isTop && (
                          <span className="top-badge">
                            <FaFire /> Ən çox baxış
                          </span>
                        )}
                        <div className="plat-views">
                          <strong>{platform.views.toLocaleString()}</strong>
                          <span>baxış</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeUser.platforms.length === 0 && (
                  <div className="no-platforms">
                    İstifadəçi hələ heç bir vasitə əlavə etməyib.
                  </div>
                )}
              </div>
            </div>

            <div className="admin-actions-footer">
              {/* Blokla / Aktivləşdir — indi popup ilə */}
              <button
                className={`action-btn ${editStatus === "active" ? "block-btn" : "unblock-btn"}`}
                onClick={handleBlockClick}
              >
                {editStatus === "active" ? (
                  <>
                    <FaBan /> Hesabı Blokla
                  </>
                ) : (
                  <>
                    <FaUserCheck /> Hesabı Aktivləşdir
                  </>
                )}
              </button>

              {/* Yadda saxla — indi update popup ilə */}
              <button className="action-btn save-btn" onClick={handleSaveClick}>
                <FaSave /> Dəyişiklikləri Saxla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersMain;
