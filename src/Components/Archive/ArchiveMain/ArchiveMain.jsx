import React, { useState } from "react";
import {
  FiArchive,
  FiUser,
  FiRefreshCw,
  FiTrash2,
  FiMessageSquare,
  FiCalendar,
  FiMail,
  FiPhone,
  FiSearch,
  FiAlertTriangle,
  FiChevronDown,
  FiClock,
  FiHash,
  FiMessageCircle,
  FiCornerDownRight,
} from "react-icons/fi";
import "./ArchiveMain.scss";

// ── Nümunə məlumatlar ─────────────────────────────────────────────
const initialUsers = [
  {
    id: 1,
    name: "Anar Həsənov",
    usercode: "SYD-00123",
    email: "anar@example.com",
    phone: "+994 50 111 22 33",
    deletedAt: "05-03-2026",
    plan: "Pro",
  },
  {
    id: 2,
    name: "Leyla Əliyeva",
    usercode: "İNS-00456",
    email: "leyla@example.com",
    phone: "+994 55 222 33 44",
    deletedAt: "04-03-2026",
    plan: "Premium",
  },
  {
    id: 3,
    name: "Rauf Quliyev",
    usercode: "SYD-00789",
    email: "rauf@example.com",
    phone: "+994 70 333 44 55",
    deletedAt: "03-03-2026",
    plan: "Sadə",
  },
  {
    id: 4,
    name: "Nigar Məmmədova",
    usercode: "İNS-01012",
    email: "nigar@example.com",
    phone: "+994 77 444 55 66",
    deletedAt: "02-03-2026",
    plan: "Pro",
  },
  {
    id: 5,
    name: "Tural İsmayılov",
    usercode: "SYD-01345",
    email: "tural@example.com",
    phone: "+994 51 555 66 77",
    deletedAt: "01-03-2026",
    plan: "Sadə",
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "Anar Həsənov",
    email: "anar@example.com",
    type: "Şikayət",
    title: "Ödəniş problemi",
    date: "06-03-2026",
    time: "14:32",
    content:
      "Salam, ödənişimi etdim lakin hesabıma keçmədi. Nə etməliyəm? Artıq 2 gündür gözləyirəm.",
    reply:
      "Hörmətli Anar bəy, ödənişiniz sistemimizə daxil olub. 24 saat ərzində hesabınıza əks olunacaq. Narahatlıq üçün üzr istəyirik.",
    repliedAt: "06-03-2026 · 16:10",
  },
  {
    id: 2,
    sender: "Leyla Əliyeva",
    email: "leyla@example.com",
    type: "Sual",
    title: "Paket yüksəltmə",
    date: "05-03-2026",
    time: "09:15",
    content: "Pro paketdən Premium-a keçsəm köhnə məlumatlarım qalacaqmı?",
    reply: null,
    repliedAt: null,
  },
  {
    id: 3,
    sender: "Rauf Quliyev",
    email: "rauf@example.com",
    type: "Təklif",
    title: "Yeni xüsusiyyət",
    date: "04-03-2026",
    time: "17:50",
    content:
      "Tətbiqə qaranlıq rejim əlavə edilsə yaxşı olardı. Gecə istifadəsi üçün çox əlverişli olar.",
    reply:
      "Təklifiniz üçün təşəkkür edirik. Bu xüsusiyyət növbəti yeniləmədə nəzərə alınacaq.",
    repliedAt: "05-03-2026 · 10:00",
  },
  {
    id: 4,
    sender: "Nigar Məmmədova",
    email: "nigar@example.com",
    type: "Digər",
    title: "Hesab məlumatları",
    date: "03-03-2026",
    time: "10:05",
    content:
      "Ad-soyadımı dəyişmək istəyirəm, lakin profil parametrləri bölməsini tapa bilmirəm.",
    reply:
      "Profil → Parametrlər → Şəxsi məlumatlar bölməsindən ad-soyadınızı dəyişə bilərsiniz.",
    repliedAt: "03-03-2026 · 11:30",
  },
  {
    id: 5,
    sender: "Tural İsmayılov",
    email: "tural@example.com",
    type: "Şikayət",
    title: "Sistem giriş xətası",
    date: "02-03-2026",
    time: "08:40",
    content:
      "Hər gün sistemə girəndə 403 xəta alıram. Brauzeri dəyişsəm eyni problem var.",
    reply: null,
    repliedAt: null,
  },
];

const TYPE_CLS = {
  Şikayət: "badge--complaint",
  Sual: "badge--question",
  Təklif: "badge--suggestion",
  Digər: "badge--other",
};

const PLAN_CLS = {
  Sadə: "plan--basic",
  Pro: "plan--pro",
  Premium: "plan--premium",
};

export default function ArchiveMain() {
  const [users, setUsers] = useState(initialUsers);
  const [messages] = useState(initialMessages);
  const [userSearch, setUserSearch] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [restoreId, setRestoreId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openMsgId, setOpenMsgId] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.usercode.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const filteredMessages = messages.filter(
    (m) =>
      m.sender.toLowerCase().includes(msgSearch.toLowerCase()) ||
      m.title.toLowerCase().includes(msgSearch.toLowerCase()),
  );

  const doRestore = () => {
    setUsers((prev) => prev.filter((u) => u.id !== restoreId));
    setRestoreId(null);
  };

  const doDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  const confirmUser = users.find((u) => u.id === (restoreId || deleteId));

  return (
    <div className="arch">
      {/* ══ HEADER ══════════════════════════════════════════════════ */}
      <div className="arch__header">
        <div>
          <h2 className="arch__title">Arxiv</h2>
          <p className="arch__sub">
            Silinmiş istifadəçilər və keçmiş mesajları buradan idarə edin.
          </p>
        </div>
        <div className="arch__header-stats">
          <div className="arch__stat arch__stat--users">
            <FiUser />
            <span>{users.length} silinmiş istifadəçi</span>
          </div>
          <div className="arch__stat arch__stat--msgs">
            <FiMessageSquare />
            <span>{messages.length} keçmiş mesaj</span>
          </div>
        </div>
      </div>

      {/* ══ TABS ════════════════════════════════════════════════════ */}
      <div className="arch__tabs">
        <button
          className={`arch__tab ${activeTab === "users" ? "arch__tab--active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <FiUser /> Silinmiş İstifadəçilər
          <span className="arch__tab-badge">{users.length}</span>
        </button>
        <button
          className={`arch__tab ${activeTab === "messages" ? "arch__tab--active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          <FiMessageSquare /> Keçmiş Mesajlar
          <span className="arch__tab-badge arch__tab-badge--grey">
            {messages.length}
          </span>
        </button>
      </div>

      {/* ══ İSTİFADƏÇİLƏR TAB ══════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="arch__card">
          <div className="arch__search-row">
            <div className="arch__search-box">
              <FiSearch className="arch__search-icon" />
              <input
                type="text"
                placeholder="Ad, email və ya usercode ilə axtar..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="arch__user-list">
            {filteredUsers.length === 0 && (
              <div className="arch__empty">
                <FiArchive />
                <p>Heç bir nəticə tapılmadı.</p>
              </div>
            )}

            {filteredUsers.map((user) => (
              <div className="arch__user-row" key={user.id}>
                <div className="arch__avatar">{user.name.charAt(0)}</div>

                <div className="arch__user-info">
                  {/* Üst sıra: ad + paket + usercode */}
                  <div className="arch__user-top">
                    <span className="arch__user-name">{user.name}</span>
                    <span
                      className={`arch__plan-badge ${PLAN_CLS[user.plan] || ""}`}
                    >
                      {user.plan}
                    </span>
                    <span className="arch__usercode">
                      <FiHash /> {user.usercode}
                    </span>
                  </div>

                  {/* Alt sıra: email + telefon + silinmə tarixi */}
                  <div className="arch__user-details">
                    <span>
                      <FiMail /> {user.email}
                    </span>
                    <span>
                      <FiPhone /> {user.phone}
                    </span>
                    <span className="arch__deleted-at">
                      <FiCalendar /> Silinmə: {user.deletedAt}
                    </span>
                  </div>
                </div>

                <div className="arch__user-actions">
                  <button
                    className="arch__btn arch__btn--restore"
                    onClick={() => setRestoreId(user.id)}
                  >
                    <FiRefreshCw />
                    <span>Bərpa et</span>
                  </button>
                  <button
                    className="arch__btn arch__btn--delete"
                    onClick={() => setDeleteId(user.id)}
                  >
                    <FiTrash2 />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ MESAJLAR TAB ════════════════════════════════════════════ */}
      {activeTab === "messages" && (
        <div className="arch__card">
          <div className="arch__search-row">
            <div className="arch__search-box">
              <FiSearch className="arch__search-icon" />
              <input
                type="text"
                placeholder="Göndərən və ya başlıq ilə axtar..."
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
              />
            </div>
            <span className="arch__msg-note">
              <FiClock /> Son 5 günün mesajları
            </span>
          </div>

          <div className="arch__msg-list">
            {filteredMessages.length === 0 && (
              <div className="arch__empty">
                <FiMessageSquare />
                <p>Heç bir mesaj tapılmadı.</p>
              </div>
            )}

            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`arch__msg-item ${openMsgId === msg.id ? "arch__msg-item--open" : ""}`}
              >
                {/* Başlıq sətri */}
                <div
                  className="arch__msg-header"
                  onClick={() =>
                    setOpenMsgId(openMsgId === msg.id ? null : msg.id)
                  }
                >
                  <div className="arch__msg-left">
                    <div className="arch__avatar arch__avatar--sm">
                      {msg.sender.charAt(0)}
                    </div>
                    <div className="arch__msg-meta">
                      <div className="arch__msg-top">
                        <span className="arch__msg-sender">{msg.sender}</span>
                        <span
                          className={`arch__type-badge ${TYPE_CLS[msg.type] || ""}`}
                        >
                          {msg.type}
                        </span>
                        {/* Cavab statusu */}
                        {msg.reply ? (
                          <span className="arch__reply-status arch__reply-status--done">
                            Cavablandı
                          </span>
                        ) : (
                          <span className="arch__reply-status arch__reply-status--none">
                            Cavabsız
                          </span>
                        )}
                      </div>
                      <span className="arch__msg-title">{msg.title}</span>
                      <div className="arch__msg-info">
                        <span>
                          <FiMail /> {msg.email}
                        </span>
                        <span>
                          <FiCalendar /> {msg.date} · {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiChevronDown className="arch__msg-chevron" />
                </div>

                {/* Açılan body: mesaj + cavab */}
                <div className="arch__msg-body">
                  <div className="arch__msg-content">
                    {/* İstifadəçi mesajı */}
                    <div className="arch__msg-box arch__msg-box--user">
                      <div className="arch__msg-box-label">
                        <FiMessageCircle /> İstifadəçi mesajı
                      </div>
                      <p>{msg.content}</p>
                    </div>

                    {/* Admin cavabı */}
                    {msg.reply ? (
                      <div className="arch__msg-box arch__msg-box--admin">
                        <div className="arch__msg-box-label">
                          <FiCornerDownRight /> Admin cavabı
                          <span className="arch__replied-at">
                            {msg.repliedAt}
                          </span>
                        </div>
                        <p>{msg.reply}</p>
                      </div>
                    ) : (
                      <div className="arch__msg-box arch__msg-box--empty">
                        <div className="arch__msg-box-label">
                          <FiCornerDownRight /> Admin cavabı
                        </div>
                        <p className="arch__no-reply">
                          Bu mesaja hələ cavab verilməyib.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ RESTORE MODALI ══════════════════════════════════════════ */}
      {restoreId && (
        <div
          className="arch__modal-backdrop"
          onClick={() => setRestoreId(null)}
        >
          <div className="arch__modal" onClick={(e) => e.stopPropagation()}>
            <div className="arch__modal-icon arch__modal-icon--restore">
              <FiRefreshCw />
            </div>
            <h4>İstifadəçini bərpa etmək istəyirsiniz?</h4>
            <p>
              <strong>{confirmUser?.name}</strong>{" "}
              <span className="arch__modal-code">
                ({confirmUser?.usercode})
              </span>{" "}
              hesabı yenidən aktiv ediləcək.
            </p>
            <div className="arch__modal-actions">
              <button
                className="arch__btn arch__btn--ghost"
                onClick={() => setRestoreId(null)}
              >
                Ləğv et
              </button>
              <button
                className="arch__btn arch__btn--restore"
                onClick={doRestore}
              >
                <FiRefreshCw /> Bərpa et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SİLMƏ MODALI ════════════════════════════════════════════ */}
      {deleteId && (
        <div className="arch__modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="arch__modal" onClick={(e) => e.stopPropagation()}>
            <div className="arch__modal-icon arch__modal-icon--delete">
              <FiAlertTriangle />
            </div>
            <h4>Hesabı tamamilə silmək istəyirsiniz?</h4>
            <p>
              <strong>{confirmUser?.name}</strong>{" "}
              <span className="arch__modal-code">
                ({confirmUser?.usercode})
              </span>{" "}
              hesabı birdəfəlik silinəcək. Bu əməliyyat geri alına bilməz.
            </p>
            <div className="arch__modal-actions">
              <button
                className="arch__btn arch__btn--ghost"
                onClick={() => setDeleteId(null)}
              >
                Ləğv et
              </button>
              <button
                className="arch__btn arch__btn--delete"
                onClick={doDelete}
              >
                <FiTrash2 /> Tam Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
