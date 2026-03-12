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
  FiZap,
  FiCopy,
  FiCheck,
  FiPackage,
} from "react-icons/fi";
import "./ApplicationsMain.scss";
import Popup from "../../Popup/Popup";

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
    message: "Karta video əlavə etmək imkanı olsa çox yaxşı olardı.",
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

const PACKAGES = ["Starter", "Pro", "Business", "Enterprise"];

/* ─────────────────────────────────────────────────────────── */
/*  HELPERS                                                     */
/* ─────────────────────────────────────────────────────────── */
function nowTs() {
  const now = new Date(),
    p = (n) => String(n).padStart(2, "0");
  return `${p(now.getDate())}-${p(now.getMonth() + 1)}-${now.getFullYear()}, ${p(now.getHours())}:${p(now.getMinutes())}`;
}
function todayStr() {
  const now = new Date(),
    p = (n) => String(n).padStart(2, "0");
  return `${p(now.getDate())}-${p(now.getMonth() + 1)}-${now.getFullYear()}`;
}
function timeStr() {
  const now = new Date(),
    p = (n) => String(n).padStart(2, "0");
  return `${p(now.getHours())}:${p(now.getMinutes())}`;
}

/* ─────────────────────────────────────────────────────────── */
/*  ACTIVATION TEMPLATE                                         */
/* ─────────────────────────────────────────────────────────── */
function generateTemplate(req) {
  return `Hörmətli istifadəçi,

Müraciətiniz qəbul edildi. Aşağıda giriş məlumatlarınız göndərilir:

📧 E-poçt: ${req.email}
📦 Paket: ${req.package}
🔑 Parol: [PAROL_BURA]
👤 User Kodu: [USERCODE_BURA]
🔗 Giriş linki: https://panel.sizinsayt.az/login

Zəhmət olmasa ilk girişdən sonra parolunuzu dəyişdirin.

Hər hansı sualınız olarsa bizimlə əlaqə saxlayın.

Hörmətlə,
Admin Komandası`;
}

/* ─────────────────────────────────────────────────────────── */
/*  ACTIVATION ITEM                                             */
/* ─────────────────────────────────────────────────────────── */
function ActivationItem({
  req,
  openId,
  onToggle,
  onStatusChange,
  copiedId,
  onCopy,
}) {
  const isOpen = openId === req.id;
  return (
    <div
      className={`app-admin__item activation-item ${isOpen ? "app-admin__item--open" : ""} ${req.status === "Tamamlandı" ? "activation-item--done" : ""}`}
    >
      <div className="app-admin__item-header" onClick={() => onToggle(req.id)}>
        <div className="app-admin__item-left">
          <div className="activation-item__icon">
            <FiZap />
          </div>
          <div className="app-admin__item-meta">
            <div className="app-admin__item-top">
              <span className="app-admin__sender">{req.email}</span>
              <span className="activation-item__pkg-badge">{req.package}</span>
            </div>
            <div className="app-admin__item-info">
              <span>
                <FiCalendar /> {req.date} · {req.time}
              </span>
            </div>
          </div>
        </div>
        <div className="app-admin__item-right">
          <span
            className={`app-admin__status ${req.status === "Tamamlandı" ? "app-admin__status--replied" : "app-admin__status--pending"}`}
          >
            {req.status === "Tamamlandı" ? (
              <>
                <FiCheckCircle /> Tamamlandı
              </>
            ) : (
              <>
                <FiClock /> Gözləyir
              </>
            )}
          </span>
          <FiChevronDown className="app-admin__chevron" />
        </div>
      </div>
      <div className="app-admin__item-body">
        <div className="activation-item__template-box">
          <div className="activation-item__template-header">
            <span>
              <FiMail /> Göndəriləcək Şablon
            </span>
            <button
              className={`activation-item__copy-btn ${copiedId === req.id ? "copied" : ""}`}
              onClick={() => onCopy(req.id, generateTemplate(req))}
            >
              {copiedId === req.id ? (
                <>
                  <FiCheck /> Kopyalandı
                </>
              ) : (
                <>
                  <FiCopy /> Kopyala
                </>
              )}
            </button>
          </div>
          <pre className="activation-item__template-text">
            {generateTemplate(req)}
          </pre>
        </div>
        {req.status === "Gözləyir" && (
          <div className="app-admin__reply-form">
            <div className="app-admin__msg-label">
              <FiSend /> Şablonu müştəriyə göndərdikdən sonra statusu tamamlandı
              kimi işarələyin
            </div>
            <div className="app-admin__reply-actions">
              <button
                className="app-admin__send-btn activation-item__done-btn"
                onClick={() => onStatusChange(req.id, "Tamamlandı")}
              >
                <FiCheckCircle /> Tamamlandı işarələ
              </button>
              <span className="app-admin__reply-hint">
                Status dəyişdirildikdən sonra bu müraciət tamamlanmış görünəcək.
              </span>
            </div>
          </div>
        )}
        {req.status === "Tamamlandı" && (
          <div className="activation-item__done-banner">
            <FiCheckCircle />
            <span>
              Bu aktivasiya müraciəti tamamlandı. Müştəriyə giriş məlumatları
              göndərildi.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  COMPOSE MODAL  —  Popup inteqrasiyası ilə                  */
/* ─────────────────────────────────────────────────────────── */
function ComposeModal({ onClose, onSend }) {
  const [mode, setMode] = useState("individual");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [expectReply, setExpectReply] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  /* ── Daxili Popup state ── */
  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

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

  const hasContent = subject.trim() || body.trim() || selectedUsers.length > 0;

  const canSend =
    subject.trim() &&
    body.trim() &&
    (mode === "broadcast" || selectedUsers.length > 0);

  /* ── Real göndərmə ── */
  const doSend = () => {
    setSending(true);
    setTimeout(() => {
      const recipients = mode === "broadcast" ? ALL_USERS : selectedUsers;
      onSend({ recipients, subject, body, expectReply, mode });
      setSending(false);
      onClose();
    }, 700);
  };

  /* ── Göndər — popup ilə ── */
  const handleSend = () => {
    if (!canSend) return;
    const recipients = mode === "broadcast" ? ALL_USERS : selectedUsers;
    const recipientText =
      mode === "broadcast"
        ? `Bütün ${ALL_USERS.length} istifadəçiyə`
        : recipients.length === 1
          ? `"${recipients[0].name}" istifadəçisinə`
          : `${recipients.length} istifadəçiyə`;

    openPopup({
      type: "success",
      title: "Mesaj göndərilsin?",
      message: `"${subject}" mövzusunda mesaj ${recipientText} göndəriləcək.${expectReply ? " Geri dönüş gözlənilir." : ""}`,
      confirmText: "Göndər",
      onConfirm: doSend,
    });
  };

  /* ── Ləğv et / X / overlay — mətn varsa xəbərdar et ── */
  const handleClose = () => {
    if (!hasContent) {
      onClose();
      return;
    }
    openPopup({
      type: "delete",
      title: "Mesajdan çıxmaq istəyirsiniz?",
      message:
        "Yazılmış məlumatlar yadda saxlanılmayacaq. Bu əməliyyat geri alına bilməz.",
      confirmText: "Sil və Çıx",
      onConfirm: onClose,
    });
  };

  return (
    <>
      {/* Popup compose-overlay-in üzərində render olunur */}
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

      <div
        className="compose-overlay"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className="compose-modal">
          <div className="compose-modal__header">
            <div className="compose-modal__header-left">
              <FiEdit3 />
              <h3>Yeni Mesaj</h3>
            </div>
            <button className="compose-modal__close" onClick={handleClose}>
              <FiX />
            </button>
          </div>

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
                        <span className="compose-modal__user-name">
                          {u.name}
                        </span>
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

          <div className="compose-modal__footer">
            <button className="compose-modal__cancel-btn" onClick={handleClose}>
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
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  OUTBOX ITEM                                                 */
/* ─────────────────────────────────────────────────────────── */
function OutboxItem({ msg, openId, onToggle, onSendChat }) {
  const isOpen = openId === msg.id;

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
  const totalCount = conversation.length;
  const lastFrom = conversation[conversation.length - 1]?.from;
  const nextTurn = lastFrom === "admin" ? "user" : "admin";
  const canReply =
    msg.expectReply &&
    totalCount < 10 &&
    nextTurn === "admin" &&
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

      <div className="app-admin__item-body">
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

        {isLimitReached && (
          <div className="outbox-item__limit-banner">
            <FiCheckCircle />
            <span>Söhbət limitinə (10 mesaj) çatıldı. Bu mövzu bağlandı.</span>
          </div>
        )}

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
      body: "Hörmətli istifadəçilər, 10 mart 2026 tarixində saat 02:00-06:00 arasında texniki işlər aparılacaq.",
      recipients: ALL_USERS,
      expectReply: false,
      conversation: [
        {
          from: "admin",
          text: "Hörmətli istifadəçilər, 10 mart 2026 tarixində saat 02:00-06:00 arasında texniki işlər aparılacaq.",
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
  ]);

  const [activationRequests, setActivationRequests] = useState([
    {
      id: 201,
      email: "test@example.com",
      package: "Pro",
      date: "08-03-2026",
      time: "11:20",
      status: "Gözləyir",
    },
  ]);
  const [activationForm, setActivationForm] = useState({
    email: "",
    package: "Starter",
  });
  const [activationSent, setActivationSent] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activationOpenId, setActivationOpenId] = useState(null);

  const [activeTab, setActiveTab] = useState("pending");
  const [openId, setOpenId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sending, setSending] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  /* ── Ana Popup state ── */
  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

  const pendingCount = inbox.filter((a) => a.status === "pending").length;
  const repliedCount = inbox.filter((a) => a.status === "replied").length;
  const outboxCount = outbox.length;
  const activationCount = activationRequests.filter(
    (r) => r.status === "Gözləyir",
  ).length;

  const filteredInbox = inbox.filter((a) => a.status === activeTab);
  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  const handleReplyChange = (id, val) =>
    setReplyTexts((prev) => ({ ...prev, [id]: val }));

  /* ── Cavab göndər — real iş ── */
  const doSendReply = (id) => {
    const text = (replyTexts[id] || "").trim();
    if (!text) return;
    setSending(id);
    setTimeout(() => {
      setInbox((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "replied", reply: text, repliedAt: nowTs() }
            : a,
        ),
      );
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
      setOpenId(null);
      setSending(null);
    }, 600);
  };

  /* ── Cavab göndər — popup ilə ── */
  const handleSendReply = (app) => {
    const text = (replyTexts[app.id] || "").trim();
    if (!text) return;
    openPopup({
      type: "success",
      title: "Cavab göndərilsin?",
      message: `"${app.senderName}" istifadəçisinə cavabınız göndəriləcək və müraciət cavablandırılmış kimi işarələnəcək.`,
      confirmText: "Göndər",
      onConfirm: () => doSendReply(app.id),
    });
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

  /* ── Aktivasiya göndər — real iş ── */
  const doActivationSubmit = () => {
    const newReq = {
      id: Date.now(),
      email: activationForm.email,
      package: activationForm.package,
      date: todayStr(),
      time: timeStr(),
      status: "Gözləyir",
    };
    setActivationRequests((prev) => [newReq, ...prev]);
    setActivationSent(true);
    setActivationForm({ email: "", package: "Starter" });
    setTimeout(() => setActivationSent(false), 4000);
  };

  /* ── Aktivasiya göndər — popup ilə ── */
  const handleActivationSubmit = (e) => {
    e.preventDefault();
    if (!activationForm.email) return;
    openPopup({
      type: "success",
      title: "Aktivasiya müraciəti göndərilsin?",
      message: `"${activationForm.email}" ünvanına ${activationForm.package} paketi üçün aktivasiya müraciəti göndəriləcək.`,
      confirmText: "Göndər",
      onConfirm: doActivationSubmit,
    });
  };

  /* ── Aktivasiya statusu — popup ilə ── */
  const handleActivationStatusChange = (id, newStatus) => {
    const req = activationRequests.find((r) => r.id === id);
    openPopup({
      type: "update",
      title: "Status yenilənsin?",
      message: `"${req?.email}" aktivasiyası tamamlandı kimi işarələnəcək.`,
      confirmText: "Tamamlandı",
      onConfirm: () =>
        setActivationRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
        ),
    });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
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
    {
      key: "activation",
      icon: <FiZap />,
      label: "Sistem Aktivasiyası",
      count: activationCount,
      color: "purple",
    },
  ];

  return (
    <div className="app-admin">
      {/* ── Ana Popup ── */}
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

      {/* ── HEADER ── */}
      <div className="app-admin__header">
        <div>
          <h2 className="app-admin__title">Müraciətlər</h2>
          <p className="app-admin__sub">
            Daxil olan müraciətlər, göndərilənlər və aktivasiyalar — hamısını
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
            {activationCount > 0 && (
              <div className="app-admin__counter app-admin__counter--activation">
                <FiZap />
                <span>{activationCount} Aktivasiya</span>
              </div>
            )}
          </div>
          <button
            className="app-admin__compose-btn"
            onClick={() => setShowCompose(true)}
          >
            <FiPlus /> Yeni Mesaj
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
        {/* INBOX */}
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
                className={`app-admin__item ${openId === app.id ? "app-admin__item--open" : ""} ${app.status === "replied" ? "app-admin__item--replied" : ""}`}
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
                          onClick={() => handleSendReply(app)}
                          disabled={
                            sending === app.id ||
                            !(replyTexts[app.id] || "").trim()
                          }
                        >
                          {sending === app.id ? (
                            <>
                              <span className="app-admin__spinner" />{" "}
                              Göndərilir...
                            </>
                          ) : (
                            <>
                              <FiSend /> Cavab Göndər
                            </>
                          )}
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

        {/* OUTBOX */}
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

        {/* ACTIVATION */}
        {activeTab === "activation" && (
          <div className="activation-section">
            <div className="app-admin__item activation-form-card">
              <div className="activation-form-card__header">
                <div className="activation-form-card__icon">
                  <FiZap />
                </div>
                <div>
                  <h3>Yeni Sistem Aktivasiyası</h3>
                  <p>Müştərinin e-poçtunu və seçdiyi paketi daxil edin.</p>
                </div>
              </div>

              {activationSent && (
                <div className="activation-form-card__success">
                  <FiCheck /> Müraciət uğurla göndərildi! Superadmin bildiriş
                  aldı.
                </div>
              )}

              <form
                onSubmit={handleActivationSubmit}
                className="activation-form-card__form"
              >
                <div className="activation-form-card__field">
                  <label>
                    <FiMail /> Müştərinin E-poçtu
                  </label>
                  <input
                    type="email"
                    placeholder="musteri@example.com"
                    value={activationForm.email}
                    onChange={(e) =>
                      setActivationForm({
                        ...activationForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="activation-form-card__field">
                  <label>
                    <FiPackage /> Seçilmiş Paket
                  </label>
                  <div className="activation-form-card__packages">
                    {PACKAGES.map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        className={`activation-form-card__pkg-btn ${activationForm.package === pkg ? "active" : ""}`}
                        onClick={() =>
                          setActivationForm({ ...activationForm, package: pkg })
                        }
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="app-admin__send-btn activation-form-card__submit"
                >
                  <FiSend /> Müraciət Göndər
                </button>
              </form>
            </div>

            <div className="activation-requests">
              <div className="activation-requests__header">
                <h3>
                  <FiInbox /> Gözləyən Aktivasiyalar
                </h3>
                <p>
                  Şablonu kopyalayıb müştərinin e-poçtuna göndərin, sonra
                  statusu dəyişin.
                </p>
              </div>

              {activationRequests.length === 0 && (
                <div className="app-admin__empty">
                  <FiZap />
                  <p>Hələ aktivasiya müraciəti yoxdur.</p>
                </div>
              )}

              {activationRequests.map((req) => (
                <ActivationItem
                  key={req.id}
                  req={req}
                  openId={activationOpenId}
                  onToggle={(id) =>
                    setActivationOpenId(activationOpenId === id ? null : id)
                  }
                  onStatusChange={handleActivationStatusChange}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
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
