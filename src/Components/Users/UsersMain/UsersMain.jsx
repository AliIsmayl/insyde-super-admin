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

// İkonları dinamik çağırmaq üçün
const iconMap = {
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
  tiktok: <FaTiktok />,
  website: <FaGlobe />,
  linkedin: <FaLinkedin />,
};

// MOCK DATALAR (Paginasiyanı test etmək üçün çoxaldılıb)
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

// YENİ İSTİFADƏÇİ ŞABLONU
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

  // Redaktə oluna bilən sahələr
  const [editCode, setEditCode] = useState(activeUser.userCode);
  const [editStatus, setEditStatus] = useState(activeUser.status);

  // === PAGİNASİYA STATE-LƏRİ ===
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4; // Hər səhifədə göstəriləcək kart sayı

  // activeUser dəyişəndə inputları yeniləyirik
  useEffect(() => {
    setEditCode(activeUser.userCode || "");
    setEditStatus(activeUser.status || "active");
  }, [activeUser]);

  const isCreating = activeUser.id === null;

  // Axtarışdan keçən istifadəçilər
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.userCode.toLowerCase().includes(search.toLowerCase()),
  );

  // Axtarış edildikdə səhifəni 1-ə qaytarmaq
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // === PAGİNASİYA HESABLAMALARI ===
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Yaratma rejiminə keçid
  const handleAddNewClick = () => {
    setActiveUser(getEmptyUser());
  };

  // Yaratmaqdan imtina etmək
  const handleCancelCreate = () => {
    if (users.length > 0) setActiveUser(users[0]);
  };

  // Yeni istifadəçi yaratmaq
  const handleCreateNewUser = () => {
    if (!activeUser.userCode || !activeUser.password) {
      alert("Zəhmət olmasa User Code və Şifrəni daxil edin!");
      return;
    }
    const newUser = { ...activeUser, id: Date.now() };
    setUsers([newUser, ...users]);
    setActiveUser(newUser);
    alert("Yeni istifadəçi uğurla yaradıldı!");
  };

  // Mövcud istifadəçini redaktə edib saxlamaq
  const handleSaveExisting = () => {
    const updatedUsers = users.map((u) =>
      u.id === activeUser.id
        ? { ...u, userCode: editCode, status: editStatus }
        : u,
    );
    setUsers(updatedUsers);
    setActiveUser({ ...activeUser, userCode: editCode, status: editStatus });
    alert("Dəyişikliklər uğurla yadda saxlanıldı!");
  };

  const toggleStatus = () => {
    setEditStatus(editStatus === "active" ? "blocked" : "active");
  };

  // Top platformanı tapmaq
  const topPlatform =
    activeUser.platforms && activeUser.platforms.length > 0
      ? activeUser.platforms.reduce((prev, current) =>
          prev.views > current.views ? prev : current,
        )
      : null;

  return (
    <div className="users-main-modern-split">
      {/* ================= SOL TƏRƏF (İstifadəçi Siyahısı) ================= */}
      <div className="users-list-section">
        <div className="list-header">
          <div className="title-row">
            <h2>İstifadəçilər</h2>
            <div className="title-actions">
              <span className="total-count">{users.length} hesab</span>
              <button className="add-btn" onClick={handleAddNewClick}>
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
                  ></div>
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

        {/* === PAGİNASİYA KONTROLLARI === */}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    className={`page-num-btn ${currentPage === number ? "active-page" : ""}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ),
              )}
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

      {/* ================= SAĞ TƏRƏF (Profil və ya Yaratma Paneli) ================= */}
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
          /* ================= YENİ İSTİFADƏÇİ YARATMA FORMU ================= */
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
                onClick={handleCancelCreate}
              >
                <FaTimes /> Ləğv Et
              </button>
              <button
                className="action-btn save-btn"
                onClick={handleCreateNewUser}
              >
                <FaSave /> Yarat və Yadda Saxla
              </button>
            </div>
          </div>
        ) : (
          /* ================= MÖVCUD PROFİLƏ BAXIŞ VƏ REDAKTƏ ================= */
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
              <button
                className={`action-btn ${editStatus === "active" ? "block-btn" : "unblock-btn"}`}
                onClick={toggleStatus}
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
              <button
                className="action-btn save-btn"
                onClick={handleSaveExisting}
              >
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
