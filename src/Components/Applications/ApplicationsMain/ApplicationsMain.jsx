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
  FiEdit3,
  FiUsers,
  FiCornerUpLeft,
  FiMail,
  FiToggleLeft,
  FiToggleRight,
  FiX,
  FiPlus,
} from "react-icons/fi";
import "./ApplicationsMain.scss";

/* ─────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                   */
/* ─────────────────────────────────────────────────────────── */
const ALL_USERS = [
  { id: 1, name: "Anar Həsənov", email: "anar@example.com", code: "SYD-00123" },
  {
    id: 2,
    name: "Leyla Əliyeva",
    email: "leyla@example.com",
    code: "İNS-00456",
  },
  { id: 3, name: "Rauf Quliyev", email: "rauf@example.com", code: "SYD-00789" },
  {
    id: 4,
    name: "Nigar Məmmədova",
    email: "nigar@example.com",
    code: "İNS-01012",
  },
  {
    id: 5,
    name: "Tural Babayev",
    email: "tural@example.com",
    code: "SYD-01345",
  },
  {
    id: 6,
    name: "Sevinc Hüseynova",
    email: "sevinc@example.com",
    code: "İNS-01678",
  },
];

const initialInbox = [
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

/* ─────────────────────────────────────────────────────────── */
/*  HELPERS                                                     */
/* ─────────────────────────────────────────────────────────── */
function nowTs() {
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(now.getDate())}-${p(now.getMonth() + 1)}-${now.getFullYear()}, ${p(now.getHours())}:${p(now.getMinutes())}`;
}
function todayStr() {
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(now.getDate())}-${p(now.getMonth() + 1)}-${now.getFullYear()}`;
}
function timeStr() {
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(now.getHours())}:${p(now.getMinutes())}`;
}

/* ─────────────────────────────────────────────────────────── */
/*  COMPOSE MODAL                                               */
/* ─────────────────────────────────────────────────────────── */
function ComposeModal({ onClose, onSend }) {
  const [mode, setMode] = useState("individual"); // "individual" | "broadcast"
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [expectReply, setExpectReply] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ALL_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.code.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleUser = (u) => {
    setSelectedUsers((prev) =>
      prev.find((x) => x.id === u.id)
        ? prev.filter((x) => x.id !== u.id)
        : [...prev, u],
    );
  };

  const canSend =
    subject.trim() &&
    body.trim() &&
    (mode === "broadcast" || selectedUsers.length > 0);

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    setTimeout(() => {
      const recipients = mode === "broadcast" ? ALL_USERS : selectedUsers;
      onSend({ recipients, subject, body, expectReply, mode });
      setSending(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="compose-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="compose-modal">
        {/* Header */}
        <div className="compose-modal__header">
          <div className="compose-modal__header-left">
            <FiEdit3 />
            <h3>Yeni Müraciət</h3>
          </div>
          <button className="compose-modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="compose-modal__mode-row">
          <button
            className={`compose-modal__mode-btn ${mode === "individual" ? "active" : ""}`}
            onClick={() => {
              setMode("individual");
              setSelectedUsers([]);
            }}
          >
            <FiUser /> Fərdi
          </button>
          <button
            className={`compose-modal__mode-btn ${mode === "broadcast" ? "active" : ""}`}
            onClick={() => {
              setMode("broadcast");
              setSelectedUsers([]);
            }}
          >
            <FiUsers /> Hamıya (Kütləvi)
          </button>
        </div>

        {/* Recipient section */}
        {mode === "individual" && (
          <div className="compose-modal__recipients">
            <label className="compose-modal__label">
              <FiUsers /> Alıcılar seçin
            </label>
            <input
              className="compose-modal__search"
              placeholder="Ad, e-mail və ya kod axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="compose-modal__user-list">
              {filtered.map((u) => {
                const sel = !!selectedUsers.find((x) => x.id === u.id);
                return (
                  <div
                    key={u.id}
                    className={`compose-modal__user-item ${sel ? "selected" : ""}`}
                    onClick={() => toggleUser(u)}
                  >
                    <div className="compose-modal__user-avatar">
                      {u.name.charAt(0)}
                    </div>
                    <div className="compose-modal__user-info">
                      <span className="compose-modal__user-name">{u.name}</span>
                      <span className="compose-modal__user-sub">
                        {u.email} · {u.code}
                      </span>
                    </div>
                    {sel && (
                      <FiCheckCircle className="compose-modal__user-check" />
                    )}
                  </div>
                );
              })}
            </div>
            {selectedUsers.length > 0 && (
              <div className="compose-modal__selected-chips">
                {selectedUsers.map((u) => (
                  <span key={u.id} className="compose-modal__chip">
                    {u.name}
                    <button onClick={() => toggleUser(u)}>
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === "broadcast" && (
          <div className="compose-modal__broadcast-banner">
            <FiUsers />
            <span>
              Bu mesaj <strong>bütün {ALL_USERS.length} istifadəçiyə</strong>{" "}
              göndəriləcək.
            </span>
          </div>
        )}

        {/* Subject */}
        <div className="compose-modal__field">
          <label className="compose-modal__label">
            <FiMail /> Mövzu
          </label>
          <input
            className="compose-modal__input"
            placeholder="Mesaj mövzusu..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="compose-modal__field">
          <label className="compose-modal__label">
            <FiMessageSquare /> Mətn
          </label>
          <textarea
            className="compose-modal__textarea"
            rows={5}
            placeholder="Mesajınızı yazın..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {/* Expect reply toggle */}
        <div
          className="compose-modal__toggle-row"
          onClick={() => setExpectReply((v) => !v)}
        >
          <div className="compose-modal__toggle-info">
            <FiCornerUpLeft />
            <div>
              <span className="compose-modal__toggle-label">
                Geri dönüş gözlənilir
              </span>
              <span className="compose-modal__toggle-sub">
                İstifadəçilərin bu mesaja cavab verməsi gözlənilir
              </span>
            </div>
          </div>
          <div
            className={`compose-modal__toggle-icon ${expectReply ? "on" : ""}`}
          >
            {expectReply ? <FiToggleRight /> : <FiToggleLeft />}
          </div>
        </div>

        {/* Footer */}
        <div className="compose-modal__footer">
          <button className="compose-modal__cancel-btn" onClick={onClose}>
            Ləğv et
          </button>
          <button
            className="compose-modal__send-btn"
            onClick={handleSend}
            disabled={!canSend || sending}
          >
            {sending ? <span className="app-admin__spinner" /> : <FiSend />}
            {sending ? "Göndərilir..." : "Göndər"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  OUTBOX ITEM  (söhbət rejimli)                              */
/* ─────────────────────────────────────────────────────────── */
function OutboxItem({ msg, openId, onToggle, onSendChat }) {
  const isOpen = openId === msg.id;

  // conversation = [{from:"admin"|"user", text, at, userName?}]
  // ilk mesaj həmişə admindən gəlir
  const conversation = msg.conversation || [
    { from: "admin", text: msg.body, at: `${msg.date}, ${msg.time}` },
    ...(msg.replies || []).map((r) => ({
      from: "user",
      text: r.text,
      at: r.at,
      userName: r.userName,
    })),
  ];

  const adminCount = conversation.filter((m) => m.from === "admin").length;
  const userCount = conversation.filter((m) => m.from === "user").length;
  const totalCount = conversation.length; // max 10

  // Növbəti kimdən gəlməlidir?
  // admin max 5, user max 5; növbə: son mesaja baxaraq alternativ
  const lastFrom = conversation[conversation.length - 1]?.from;
  const nextTurn = lastFrom === "admin" ? "user" : "admin";
  const canReply =
    msg.expectReply &&
    totalCount < 10 &&
    nextTurn === "admin" && // superadmin tərəfindən yazılır
    adminCount < 5;

  const isLimitReached = totalCount >= 10;

  const [chatText, setChatText] = useState("");
  const [sending, setSending] = useState(false);

  const handleChatSend = () => {
    const text = chatText.trim();
    if (!text || !canReply) return;
    setSending(true);
    setTimeout(() => {
      onSendChat(msg.id, { from: "admin", text, at: nowTs() });
      setChatText("");
      setSending(false);
    }, 500);
  };

  const recipientCount = msg.recipients.length;
  const userReplied = userCount > 0;

  return (
    <div
      className={`app-admin__item outbox-item ${isOpen ? "app-admin__item--open" : ""} ${msg.expectReply ? "outbox-item--expects" : ""}`}
    >
      <div className="app-admin__item-header" onClick={() => onToggle(msg.id)}>
        <div className="app-admin__item-left">
          <div className="outbox-item__icon">
            {msg.mode === "broadcast" ? <FiUsers /> : <FiSend />}
          </div>
          <div className="app-admin__item-meta">
            <div className="app-admin__item-top">
              <span className="app-admin__sender">{msg.subject}</span>
              {msg.mode === "broadcast" && (
                <span className="outbox-item__badge outbox-item__badge--broadcast">
                  Kütləvi
                </span>
              )}
              {msg.expectReply && (
                <span className="outbox-item__badge outbox-item__badge--reply">
                  Geri dönüş
                </span>
              )}
            </div>
            <div className="app-admin__item-info">
              <span>
                <FiUsers /> {recipientCount} alıcı
              </span>
              <span>
                <FiCalendar /> {msg.date} · {msg.time}
              </span>
              {msg.expectReply && (
                <span
                  className={`outbox-item__reply-stat ${userReplied ? "has-replies" : ""}`}
                >
                  <FiMessageSquare /> {totalCount}/10 mesaj
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="app-admin__item-right">
          {msg.expectReply && (
            <span
              className={`app-admin__status ${isLimitReached ? "app-admin__status--replied" : userReplied ? "app-admin__status--replied" : "app-admin__status--pending"}`}
            >
              {isLimitReached ? (
                <>
                  <FiCheckCircle /> Tamamlandı
                </>
              ) : userReplied ? (
                <>
                  <FiCornerUpLeft /> Aktiv
                </>
              ) : (
                <>
                  <FiClock /> Gözləyir
                </>
              )}
            </span>
          )}
          <FiChevronDown className="app-admin__chevron" />
        </div>
      </div>

      {/* Body */}
      <div className="app-admin__item-body">
        {/* Alıcılar */}
        <div className="outbox-item__recipients-section">
          <div className="app-admin__msg-label">
            <FiUsers /> Alıcılar
          </div>
          <div className="outbox-item__chips">
            {msg.recipients.map((r) => (
              <span
                key={r.id}
                className={`outbox-item__recipient-chip ${userReplied ? "replied" : ""}`}
              >
                {r.name}
                {userReplied && <FiCornerUpLeft />}
              </span>
            ))}
          </div>
        </div>

        {/* Söhbət */}
        <div className="outbox-item__chat">
          {conversation.map((m, i) => (
            <div
              key={i}
              className={`outbox-item__chat-bubble outbox-item__chat-bubble--${m.from}`}
            >
              {m.from === "user" && (
                <div className="outbox-item__chat-avatar">
                  {(m.userName || msg.recipients[0]?.name || "U").charAt(0)}
                </div>
              )}
              <div className="outbox-item__chat-content">
                {m.from === "user" && (
                  <span className="outbox-item__chat-name">
                    {m.userName || msg.recipients[0]?.name}
                  </span>
                )}
                <p>{m.text}</p>
                <span className="outbox-item__chat-time">{m.at}</span>
              </div>
              {m.from === "admin" && (
                <div className="outbox-item__chat-avatar outbox-item__chat-avatar--admin">
                  A
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Limit xəbərdarlığı */}
        {isLimitReached && (
          <div className="outbox-item__limit-banner">
            <FiCheckCircle />
            <span>Söhbət limitinə (10 mesaj) çatıldı. Bu mövzu bağlandı.</span>
          </div>
        )}

        {/* Cavab forması — yalnız admin növbəsindədirsə və limit keçməyibsə */}
        {msg.expectReply && !isLimitReached && (
          <div className="outbox-item__chat-form">
            {canReply ? (
              <>
                <div className="app-admin__msg-label">
                  <FiSend /> Admin cavabı yaz
                  <span className="outbox-item__chat-counter">
                    {totalCount}/10
                  </span>
                </div>
                <textarea
                  className="app-admin__reply-input"
                  rows={3}
                  placeholder="Cavabınızı yazın..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSend();
                    }
                  }}
                />
                <div className="app-admin__reply-actions">
                  <button
                    className="app-admin__send-btn"
                    onClick={handleChatSend}
                    disabled={sending || !chatText.trim()}
                  >
                    {sending ? (
                      <span className="app-admin__spinner" />
                    ) : (
                      <FiSend />
                    )}
                    {sending ? "Göndərilir..." : "Cavab Göndər"}
                  </button>
                  <span className="app-admin__reply-hint">
                    Qalan: {5 - adminCount} admin · {5 - userCount} istifadəçi
                    mesajı
                  </span>
                </div>
              </>
            ) : (
              <div className="outbox-item__waiting-banner">
                <FiClock />
                <span>
                  {nextTurn === "user"
                    ? "İstifadəçinin cavabı gözlənilir..."
                    : "Admin növbəsi, lakin limit dolub."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                              */
/* ─────────────────────────────────────────────────────────── */
export default function ApplicationsMain() {
  const [inbox, setInbox] = useState(initialInbox);
  const [outbox, setOutbox] = useState([
    {
      id: 101,
      mode: "broadcast",
      subject: "Sistem yeniləməsi bildirişi",
      body: "Hörmətli istifadəçilər, 10 mart 2026 tarixində saat 02:00-06:00 arasında texniki işlər aparılacaq. Bu müddətdə sistem əlçatmaz ola bilər.",
      recipients: ALL_USERS,
      expectReply: false,
      conversation: [
        {
          from: "admin",
          text: "Hörmətli istifadəçilər, 10 mart 2026 tarixində saat 02:00-06:00 arasında texniki işlər aparılacaq. Bu müddətdə sistem əlçatmaz ola bilər.",
          at: "06-03-2026, 10:00",
        },
      ],
      date: "06-03-2026",
      time: "10:00",
    },
    {
      id: 102,
      mode: "individual",
      subject: "Ödəniş problemi haqqında əlavə məlumat",
      body: "Salam Anar bəy, ödəniş məsələnizi araşdırdıq. Zəhmət olmasa bank çıxarışınızı bizə göndərə bilərsinizmi?",
      recipients: [ALL_USERS[0]],
      expectReply: true,
      conversation: [
        {
          from: "admin",
          text: "Salam Anar bəy, ödəniş məsələnizi araşdırdıq. Zəhmət olmasa bank çıxarışınızı bizə göndərə bilərsinizmi?",
          at: "06-03-2026, 12:00",
        },
        {
          from: "user",
          text: "Salam, çıxarışı e-mail ilə göndərdim. Nə vaxt həll olacaq?",
          at: "06-03-2026, 15:20",
          userName: "Anar Həsənov",
        },
      ],
      date: "06-03-2026",
      time: "12:00",
    },
    {
      id: 103,
      mode: "individual",
      subject: "Pro paket təklifi",
      body: "Salam! Sizin üçün xüsusi Pro paket endirimi hazırladıq. Maraqlanırsınızsa əlaqə saxlayın.",
      recipients: [ALL_USERS[1], ALL_USERS[2], ALL_USERS[4]],
      expectReply: true,
      conversation: [
        {
          from: "admin",
          text: "Salam! Sizin üçün xüsusi Pro paket endirimi hazırladıq. Maraqlanırsınızsa əlaqə saxlayın.",
          at: "05-03-2026, 14:00",
        },
      ],
      date: "05-03-2026",
      time: "14:00",
    },
  ]);

  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "replied" | "outbox" | "returns"
  const [openId, setOpenId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sending, setSending] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  /* counts */
  const pendingCount = inbox.filter((a) => a.status === "pending").length;
  const repliedCount = inbox.filter((a) => a.status === "replied").length;
  const outboxCount = outbox.length;

  const filteredInbox = inbox.filter((a) => a.status === activeTab);

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  const handleReplyChange = (id, val) =>
    setReplyTexts((prev) => ({ ...prev, [id]: val }));

  const handleSendReply = (id) => {
    const text = (replyTexts[id] || "").trim();
    if (!text) return;
    setSending(id);
    setTimeout(() => {
      const ts = nowTs();
      setInbox((prev) =>
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

  const handleSendChat = (msgId, newMsg) => {
    setOutbox((prev) =>
      prev.map((o) =>
        o.id === msgId
          ? { ...o, conversation: [...(o.conversation || []), newMsg] }
          : o,
      ),
    );
  };

  const handleComposeSend = ({
    recipients,
    subject,
    body,
    expectReply,
    mode,
  }) => {
    const newMsg = {
      id: Date.now(),
      mode,
      subject,
      body,
      recipients,
      expectReply,
      conversation: [
        { from: "admin", text: body, at: `${todayStr()}, ${timeStr()}` },
      ],
      date: todayStr(),
      time: timeStr(),
    };
    setOutbox((prev) => [newMsg, ...prev]);
    setActiveTab("outbox");
  };

  const tabs = [
    {
      key: "pending",
      icon: <FiClock />,
      label: "Gözləyən",
      count: pendingCount,
      color: "orange",
    },
    {
      key: "replied",
      icon: <FiCheckCircle />,
      label: "Cavablandırılmış",
      count: repliedCount,
      color: "green",
    },
    {
      key: "outbox",
      icon: <FiSend />,
      label: "Göndərilənlər",
      count: outboxCount,
      color: "blue",
    },
  ];

  return (
    <div className="app-admin">
      {/* ── HEADER ── */}
      <div className="app-admin__header">
        <div>
          <h2 className="app-admin__title">Müraciətlər</h2>
          <p className="app-admin__sub">
            Daxil olan müraciətlər, göndərilənlər və geri dönüşlər — hamısını
            buradan idarə edin.
          </p>
        </div>
        <div className="app-admin__header-actions">
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
          <button
            className="app-admin__compose-btn"
            onClick={() => setShowCompose(true)}
          >
            <FiPlus /> Yeni Müraciət
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="app-admin__tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`app-admin__tab app-admin__tab--${t.color} ${activeTab === t.key ? "app-admin__tab--active" : ""}`}
            onClick={() => {
              setActiveTab(t.key);
              setOpenId(null);
            }}
          >
            {t.icon} {t.label}
            {t.count > 0 && (
              <span
                className={`app-admin__badge ${activeTab === t.key ? "" : `app-admin__badge--${t.color}`}`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── LIST ── */}
      <div className="app-admin__list">
        {/* INBOX TABS */}
        {(activeTab === "pending" || activeTab === "replied") && (
          <>
            {filteredInbox.length === 0 && (
              <div className="app-admin__empty">
                <FiInbox />
                <p>Bu bölmədə müraciət yoxdur.</p>
              </div>
            )}
            {filteredInbox.map((app) => (
              <div
                key={app.id}
                className={`app-admin__item
                  ${openId === app.id ? "app-admin__item--open" : ""}
                  ${app.status === "replied" ? "app-admin__item--replied" : ""}`}
              >
                <div
                  className="app-admin__item-header"
                  onClick={() => toggleOpen(app.id)}
                >
                  <div className="app-admin__item-left">
                    <div className="app-admin__avatar">
                      {app.senderName.charAt(0)}
                    </div>
                    <div className="app-admin__item-meta">
                      <div className="app-admin__item-top">
                        <span className="app-admin__sender">
                          {app.senderName}
                        </span>
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

                <div className="app-admin__item-body">
                  <div className="app-admin__msg-box app-admin__msg-box--user">
                    <div className="app-admin__msg-label">
                      <FiMessageSquare /> İstifadəçinin mesajı
                    </div>
                    <p>{app.message}</p>
                  </div>
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
                        onChange={(e) =>
                          handleReplyChange(app.id, e.target.value)
                        }
                      />
                      <div className="app-admin__reply-actions">
                        <button
                          className="app-admin__send-btn"
                          onClick={() => handleSendReply(app.id)}
                          disabled={
                            sending === app.id ||
                            !(replyTexts[app.id] || "").trim()
                          }
                        >
                          {sending === app.id ? (
                            <span className="app-admin__spinner" />
                          ) : (
                            <FiSend />
                          )}
                          {sending === app.id
                            ? "Göndərilir..."
                            : "Cavab Göndər"}
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
          </>
        )}

        {/* OUTBOX TAB */}
        {activeTab === "outbox" && (
          <>
            {outbox.length === 0 && (
              <div className="app-admin__empty">
                <FiSend />
                <p>Hələ heç bir müraciət göndərilməyib.</p>
              </div>
            )}
            {outbox.map((msg) => (
              <OutboxItem
                key={msg.id}
                msg={msg}
                openId={openId}
                onToggle={toggleOpen}
                onSendChat={handleSendChat}
              />
            ))}
          </>
        )}
      </div>

      {/* ── COMPOSE MODAL ── */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSend={handleComposeSend}
        />
      )}
    </div>
  );
}
