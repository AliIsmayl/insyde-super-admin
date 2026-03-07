import React, { useState } from "react";
import {
  FiChevronDown,
  FiSend,
  FiInbox,
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiClock,
  FiHash,
} from "react-icons/fi";
import "./ApplicationsMain.scss";

const initialApplications = [
  {
    id: 1,
    senderName: "Anar Həsənov",
    senderEmail: "anar@example.com",
    usercode: "SYD-00123",
    type: "Şikayət",
    title: "Ödəniş sistemi işləmir",
    message:
      "Dünən kart ilə ödəniş etməyə çalışdım, lakin sistem xəta verdi. Pul hesabımdan çıxdı amma paket aktivləşmədi.",
    date: "06-03-2026",
    time: "14:32",
    status: "pending",
    reply: "",
    repliedAt: "",
  },
  {
    id: 2,
    senderName: "Leyla Əliyeva",
    senderEmail: "leyla@example.com",
    usercode: "İNS-00456",
    type: "Sual",
    title: "Sistem analitikası barədə",
    message:
      "Pro paketdə sistem analitikası özəlliyi necə işləyir? Hansı məlumatları görə bilərəm?",
    date: "05-03-2026",
    time: "09:15",
    status: "replied",
    reply:
      "Salam Leyla xanım! Sistem analitikası bölməsindən profil baxışları, klik statistikası və ziyarətçi coğrafiyasını izləyə bilərsiniz.",
    repliedAt: "05-03-2026, 11:40",
  },
  {
    id: 3,
    senderName: "Rauf Quliyev",
    senderEmail: "rauf@example.com",
    usercode: "SYD-00789",
    type: "Təklif",
    title: "Yeni xüsusiyyət təklifi",
    message:
      "Karta video əlavə etmək imkanı olsa çox yaxşı olardı. Müştərilərə özümü daha yaxşı təqdim edə bilərdim.",
    date: "04-03-2026",
    time: "17:50",
    status: "pending",
    reply: "",
    repliedAt: "",
  },
  {
    id: 4,
    senderName: "Nigar Məmmədova",
    senderEmail: "nigar@example.com",
    usercode: "İNS-01012",
    type: "Digər",
    title: "Hesab silinməsi",
    message:
      "Hesabımı bağlamaq istəyirəm. Məlumatlarımın silinməsini tələb edirəm.",
    date: "03-03-2026",
    time: "10:05",
    status: "replied",
    reply:
      "Salam Nigar xanım. Hesabınızı silmək üçün Parametrlər > Hesab bölməsindən müvafiq əməliyyatı həyata keçirə bilərsiniz.",
    repliedAt: "03-03-2026, 12:18",
  },
];

const TYPE_COLORS = {
  Şikayət: "type--complaint",
  Sual: "type--question",
  Təklif: "type--suggestion",
  Digər: "type--other",
};

export default function ApplicationsMain() {
  const [applications, setApplications] = useState(initialApplications);
  const [activeTab, setActiveTab] = useState("pending");
  const [openId, setOpenId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sending, setSending] = useState(null);

  const filtered = applications.filter((a) => a.status === activeTab);

  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const repliedCount = applications.filter(
    (a) => a.status === "replied",
  ).length;

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  const handleReplyChange = (id, val) =>
    setReplyTexts((prev) => ({ ...prev, [id]: val }));

  const handleSendReply = (id) => {
    const text = (replyTexts[id] || "").trim();
    if (!text) return;
    setSending(id);
    setTimeout(() => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const ts = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}, ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setApplications((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "replied", reply: text, repliedAt: ts }
            : a,
        ),
      );
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
      setOpenId(null);
      setSending(null);
    }, 600);
  };

  return (
    <div className="app-admin">
      {/* ── HEADER ── */}
      <div className="app-admin__header">
        <div>
          <h2 className="app-admin__title">Müraciətlər</h2>
          <p className="app-admin__sub">
            İstifadəçilərin göndərdiyi müraciətlər — cavab verin və idarə edin.
          </p>
        </div>
        <div className="app-admin__counters">
          <div className="app-admin__counter app-admin__counter--pending">
            <FiInbox />
            <span>{pendingCount} Gözləyir</span>
          </div>
          <div className="app-admin__counter app-admin__counter--replied">
            <FiCheckCircle />
            <span>{repliedCount} Cavablandı</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="app-admin__tabs">
        <button
          className={`app-admin__tab ${activeTab === "pending" ? "app-admin__tab--active" : ""}`}
          onClick={() => {
            setActiveTab("pending");
            setOpenId(null);
          }}
        >
          <FiClock /> Gözləyən Müraciətlər
          {pendingCount > 0 && (
            <span className="app-admin__badge">{pendingCount}</span>
          )}
        </button>
        <button
          className={`app-admin__tab ${activeTab === "replied" ? "app-admin__tab--active" : ""}`}
          onClick={() => {
            setActiveTab("replied");
            setOpenId(null);
          }}
        >
          <FiCheckCircle /> Cavablandırılmış
          <span className="app-admin__badge app-admin__badge--grey">
            {repliedCount}
          </span>
        </button>
      </div>

      {/* ── LİST ── */}
      <div className="app-admin__list">
        {filtered.length === 0 && (
          <div className="app-admin__empty">
            <FiInbox />
            <p>Bu bölmədə müraciət yoxdur.</p>
          </div>
        )}

        {filtered.map((app) => (
          <div
            key={app.id}
            className={`app-admin__item
              ${openId === app.id ? "app-admin__item--open" : ""}
              ${app.status === "replied" ? "app-admin__item--replied" : ""}`}
          >
            {/* ── BAŞLIQ SƏTRİ ── */}
            <div
              className="app-admin__item-header"
              onClick={() => toggleOpen(app.id)}
            >
              {/* Sol */}
              <div className="app-admin__item-left">
                <div className="app-admin__avatar">
                  {app.senderName.charAt(0)}
                </div>
                <div className="app-admin__item-meta">
                  <div className="app-admin__item-top">
                    <span className="app-admin__sender">{app.senderName}</span>
                    <span
                      className={`app-admin__type-badge ${TYPE_COLORS[app.type] || ""}`}
                    >
                      {app.type}
                    </span>
                  </div>

                  <span className="app-admin__item-title">{app.title}</span>

                  <div className="app-admin__item-info">
                    <span className="app-admin__item-info__code">
                      <FiHash /> {app.usercode}
                    </span>
                    <span>
                      <FiUser /> {app.senderEmail}
                    </span>
                    <span>
                      <FiCalendar /> {app.date} · {app.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sağ */}
              <div className="app-admin__item-right">
                {app.status === "replied" ? (
                  <span className="app-admin__status app-admin__status--replied">
                    <FiCheckCircle /> Cavablandı
                  </span>
                ) : (
                  <span className="app-admin__status app-admin__status--pending">
                    <FiClock /> Gözləyir
                  </span>
                )}
                <FiChevronDown className="app-admin__chevron" />
              </div>
            </div>

            {/* ── AÇILAN MƏZMUN ── */}
            <div className="app-admin__item-body">
              {/* İstifadəçinin mesajı */}
              <div className="app-admin__msg-box app-admin__msg-box--user">
                <div className="app-admin__msg-label">
                  <FiMessageSquare /> İstifadəçinin mesajı
                </div>
                <p>{app.message}</p>
              </div>

              {/* Əvvəlki cavab */}
              {app.reply && (
                <div className="app-admin__msg-box app-admin__msg-box--admin">
                  <div className="app-admin__msg-label">
                    <FiCheckCircle /> Admin cavabı
                    {app.repliedAt && (
                      <span className="app-admin__replied-at">
                        · {app.repliedAt}
                      </span>
                    )}
                  </div>
                  <p>{app.reply}</p>
                </div>
              )}

              {/* Cavab forması — yalnız gözləyənlər */}
              {app.status === "pending" && (
                <div className="app-admin__reply-form">
                  <div className="app-admin__msg-label">
                    <FiSend /> Cavab yaz
                  </div>
                  <textarea
                    className="app-admin__reply-input"
                    rows={4}
                    placeholder={`${app.senderName} üçün cavabınızı yazın...`}
                    value={replyTexts[app.id] || ""}
                    onChange={(e) => handleReplyChange(app.id, e.target.value)}
                  />
                  <div className="app-admin__reply-actions">
                    <button
                      className="app-admin__send-btn"
                      onClick={() => handleSendReply(app.id)}
                      disabled={
                        sending === app.id || !(replyTexts[app.id] || "").trim()
                      }
                    >
                      {sending === app.id ? (
                        <span className="app-admin__spinner" />
                      ) : (
                        <FiSend />
                      )}
                      {sending === app.id ? "Göndərilir..." : "Cavab Göndər"}
                    </button>
                    <span className="app-admin__reply-hint">
                      Cavab göndərildikdən sonra müraciət "Cavablandırılmış"
                      bölməsinə keçəcək.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
