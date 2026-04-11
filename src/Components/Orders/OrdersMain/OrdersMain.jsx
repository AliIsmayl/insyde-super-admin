import React, { useState } from "react";
import {
  FiSearch,
  FiX,
  FiUser,
  FiLayout,
  FiCreditCard,
  FiCheck,
  FiClock,
  FiMoon,
  FiSun,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";
import Popup from "../../Popup/Popup";
import "./OrdersMain.scss";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────

const initialOrders = [
  {
    id: 1,
    user: { firstName: "Əli", lastName: "Məmmədov", userCode: "USR-0001" },
    design: { firstName: "Əli", lastName: "Məmmədov", profession: "Müəllim", initials: "ÆM", ringMode: "dark" },
    payment: { package: "Premium", months: 12, isPaid: true },
  },
  {
    id: 2,
    user: { firstName: "Leyla", lastName: "Hüseynova", userCode: "USR-0002" },
    design: { firstName: "Leyla", lastName: "Hüseynova", profession: "Dizayner", initials: "LH", ringMode: "light" },
    payment: { package: "Basic", months: 6, isPaid: false },
  },
  {
    id: 3,
    user: { firstName: "Nicat", lastName: "Quliyev", userCode: "USR-0003" },
    design: { firstName: "Nicat", lastName: "Quliyev", profession: "Proqramçı", initials: "NQ", ringMode: "dark" },
    payment: { package: "VIP", months: 12, isPaid: true },
  },
  {
    id: 4,
    user: { firstName: "Aytən", lastName: "Əliyeva", userCode: "USR-0004" },
    design: { firstName: "Aytən", lastName: "Əliyeva", profession: "Marketoloq", initials: "AƏ", ringMode: "light" },
    payment: { package: "Free", months: 1, isPaid: true },
  },
  {
    id: 5,
    user: { firstName: "Rauf", lastName: "İsmayılov", userCode: "USR-0005" },
    design: { firstName: "Rauf", lastName: "İsmayılov", profession: "Həkim", initials: "Rİ", ringMode: "dark" },
    payment: { package: "Premium", months: 3, isPaid: false },
  },
  {
    id: 6,
    user: { firstName: "Gülnar", lastName: "Babayeva", userCode: "USR-0006" },
    design: { firstName: "Gülnar", lastName: "Babayeva", profession: "Mühasib", initials: "GB", ringMode: "light" },
    payment: { package: "Basic", months: 12, isPaid: true },
  },
  {
    id: 7,
    user: { firstName: "Tural", lastName: "Nəsirov", userCode: "USR-0007" },
    design: { firstName: "Tural", lastName: "Nəsirov", profession: "Hüquqşünas", initials: "TN", ringMode: "dark" },
    payment: { package: "VIP", months: 6, isPaid: false },
  },
  {
    id: 8,
    user: { firstName: "Sevinc", lastName: "Orucova", userCode: "USR-0008" },
    design: { firstName: "Sevinc", lastName: "Orucova", profession: "Müəllim", initials: "SO", ringMode: "light" },
    payment: { package: "Premium", months: 12, isPaid: true },
  },
  {
    id: 9,
    user: { firstName: "Kamran", lastName: "Həsənov", userCode: "USR-0009" },
    design: { firstName: "Kamran", lastName: "Həsənov", profession: "Mühəndis", initials: "KH", ringMode: "dark" },
    payment: { package: "Basic", months: 3, isPaid: false },
  },
  {
    id: 10,
    user: { firstName: "Nərmin", lastName: "Süleymanova", userCode: "USR-0010" },
    design: { firstName: "Nərmin", lastName: "Süleymanova", profession: "Psixoloq", initials: "NS", ringMode: "light" },
    payment: { package: "Premium", months: 6, isPaid: true },
  },
];

// ─── AVATAR COLORS ─────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
  "#ef4444", "#0088cc", "#E1306C", "#0A66C2",
  "#22c55e", "#6366f1",
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function OrdersMain() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ type: null, order: null });

  // ── Popup state (eyni pattern — digər səhifələr kimi) ──────────
  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

  // ── Search filter ─────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    const fullName =
      `${o.user.firstName} ${o.user.lastName}`.toLowerCase();
    const code = o.user.userCode.toLowerCase();
    const q = search.toLowerCase().trim();
    return fullName.includes(q) || code.includes(q);
  });

  // ── Info modal helpers ────────────────────────────────────────
  const openModal = (type, order) => setModal({ type, order });
  const closeModal = () => setModal({ type: null, order: null });

  // ── Ödəniş statusunu birbaşa yenilə ──────────────────────────
  const doTogglePayment = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, payment: { ...o.payment, isPaid: !o.payment.isPaid } }
          : o,
      ),
    );
  };

  // ── Popup ilə təsdiq (digər səhifələrlə eyni axın) ────────────
  const handleTogglePayment = (order) => {
    const willBePaid = !order.payment.isPaid;
    openPopup({
      type: willBePaid ? "update" : "delete",
      title: willBePaid
        ? "Ödəniş təsdiqlənsin?"
        : "Ödəniş ləğv edilsin?",
      message: willBePaid
        ? `"${order.user.firstName} ${order.user.lastName}" üçün ödəniş ödənildi kimi işarələnəcək.`
        : `"${order.user.firstName} ${order.user.lastName}" üçün ödəniş statusu gözlənilir kimi dəyişdiriləcək.`,
      confirmText: willBePaid ? "Ödənildi" : "Ləğv et",
      onConfirm: () => doTogglePayment(order.id),
    });
  };

  // ── Sync modal order with latest orders state ─────────────────
  const modalOrder =
    modal.order
      ? orders.find((o) => o.id === modal.order.id) || modal.order
      : null;

  return (
    <div className="orders">
      {/* ── POPUP (Təsdiq modalı — digər səhifələr ilə eyni) ─── */}
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

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="orders__header">
        <div>
          <h2 className="orders__title">Sifarişlər</h2>
          <p className="orders__sub">
            İstifadəçilərin sifariş məlumatlarını idarə edin.
          </p>
        </div>
        <div className="orders__stat">
          <FiPackage />
          <span>{orders.length} sifariş</span>
        </div>
      </div>

      {/* ── SEARCH ─────────────────────────────────────────────── */}
      <div className="orders__search-row">
        <div className="orders__search-box">
          <FiSearch className="orders__search-icon" />
          <input
            type="text"
            className="orders__search-input"
            placeholder="Ad, soyad və ya istifadəçi kodu ilə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="orders__search-clear"
              onClick={() => setSearch("")}
              aria-label="Təmizlə"
            >
              <FiX />
            </button>
          )}
        </div>
        <span className="orders__count-badge">
          {filteredOrders.length} nəticə
        </span>
      </div>

      {/* ── TABLE ──────────────────────────────────────────────── */}
      <div className="orders__table-wrap">
        <table className="orders__table">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <span className="th-inner">
                  <FiUser /> İstifadəçi
                </span>
              </th>
              <th>
                <span className="th-inner">
                  <FiLayout /> Dizayn
                </span>
              </th>
              <th>
                <span className="th-inner">
                  <FiCreditCard /> Ödəniş
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="orders__empty">
                  <FiSearch />
                  <span>Nəticə tapılmadı</span>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr key={order.id}>
                  <td className="orders__td-num">{idx + 1}</td>

                  {/* İSTİFADƏÇİ */}
                  <td>
                    <button
                      className="orders__cell-btn orders__cell-btn--user"
                      onClick={() => openModal("user", order)}
                    >
                      <div
                        className="orders__avatar"
                        style={{
                          backgroundColor:
                            AVATAR_COLORS[order.id % AVATAR_COLORS.length],
                        }}
                      >
                        {order.design.initials}
                      </div>
                      <div className="orders__cell-info">
                        <span className="orders__cell-name">
                          {order.user.firstName} {order.user.lastName}
                        </span>
                        <span className="orders__cell-sub">
                          {order.user.userCode}
                        </span>
                      </div>
                    </button>
                  </td>

                  {/* DİZAYN */}
                  <td>
                    <button
                      className="orders__cell-btn orders__cell-btn--design"
                      onClick={() => openModal("design", order)}
                    >
                      <span className="orders__cell-name">
                        {order.design.profession}
                      </span>
                      <span
                        className={`orders__mode-chip orders__mode-chip--${order.design.ringMode}`}
                      >
                        {order.design.ringMode === "dark" ? (
                          <FiMoon />
                        ) : (
                          <FiSun />
                        )}
                        {order.design.ringMode === "dark" ? "Dark" : "Light"}
                      </span>
                    </button>
                  </td>

                  {/* ÖDƏNİŞ */}
                  <td>
                    <button
                      className="orders__cell-btn orders__cell-btn--payment"
                      onClick={() => openModal("payment", order)}
                    >
                      <span className="orders__pkg-name">
                        {order.payment.package}
                      </span>
                      <span
                        className={`orders__paid-chip ${order.payment.isPaid ? "orders__paid-chip--paid" : "orders__paid-chip--unpaid"}`}
                      >
                        {order.payment.isPaid ? (
                          <>
                            <FiCheck /> Ödənilib
                          </>
                        ) : (
                          <>
                            <FiClock /> Gözlənilir
                          </>
                        )}
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────── */}
      {modal.type && modalOrder && (
        <div className="orders__modal-backdrop" onClick={closeModal}>
          <div
            className="orders__modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── İSTİFADƏÇİ MODALI ──────────────────────────── */}
            {modal.type === "user" && (
              <>
                <div className="orders__modal-header orders__modal-header--user">
                  <div className="orders__modal-icon-wrap">
                    <FiUser />
                  </div>
                  <h3>İstifadəçi Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                <div className="orders__modal-body">
                  <div
                    className="orders__modal-avatar"
                    style={{
                      backgroundColor:
                        AVATAR_COLORS[
                          modalOrder.id % AVATAR_COLORS.length
                        ],
                    }}
                  >
                    {modalOrder.design.initials}
                  </div>
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ad</span>
                      <span className="orders__field-value">
                        {modalOrder.user.firstName}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Soyad</span>
                      <span className="orders__field-value">
                        {modalOrder.user.lastName}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">User Code</span>
                      <span className="orders__field-value orders__field-value--code">
                        {modalOrder.user.userCode}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── DİZAYN MODALI ──────────────────────────────── */}
            {modal.type === "design" && (
              <>
                <div className="orders__modal-header orders__modal-header--design">
                  <div className="orders__modal-icon-wrap">
                    <FiLayout />
                  </div>
                  <h3>Dizayn Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__logo-wrap">
                    <div
                      className="orders__logo-circle"
                      style={{
                        backgroundColor:
                          AVATAR_COLORS[
                            modalOrder.id % AVATAR_COLORS.length
                          ],
                      }}
                    >
                      {modalOrder.design.initials}
                    </div>
                    <span className="orders__logo-hint">Logo</span>
                  </div>
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ad</span>
                      <span className="orders__field-value">
                        {modalOrder.design.firstName}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Soyad</span>
                      <span className="orders__field-value">
                        {modalOrder.design.lastName}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Peşə</span>
                      <span className="orders__field-value">
                        {modalOrder.design.profession}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ring Modu</span>
                      <span
                        className={`orders__mode-chip orders__mode-chip--${modalOrder.design.ringMode}`}
                      >
                        {modalOrder.design.ringMode === "dark" ? (
                          <FiMoon />
                        ) : (
                          <FiSun />
                        )}
                        {modalOrder.design.ringMode === "dark"
                          ? "Dark Mode"
                          : "Light Mode"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── ÖDƏNİŞ MODALI ──────────────────────────────── */}
            {modal.type === "payment" && (
              <>
                <div className="orders__modal-header orders__modal-header--payment">
                  <div className="orders__modal-icon-wrap">
                    <FiCreditCard />
                  </div>
                  <h3>Ödəniş Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label">
                        <FiPackage /> Paket
                      </span>
                      <span className="orders__field-value orders__field-value--pkg">
                        {modalOrder.payment.package}
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">
                        <FiCalendar /> Müddət
                      </span>
                      <span className="orders__field-value">
                        {modalOrder.payment.months} ay
                      </span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Status</span>
                      <span
                        className={`orders__paid-chip ${modalOrder.payment.isPaid ? "orders__paid-chip--paid" : "orders__paid-chip--unpaid"}`}
                      >
                        {modalOrder.payment.isPaid ? (
                          <>
                            <FiCheck /> Ödənilib
                          </>
                        ) : (
                          <>
                            <FiClock /> Gözlənilir
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`orders__toggle-btn ${modalOrder.payment.isPaid ? "orders__toggle-btn--unpay" : "orders__toggle-btn--pay"}`}
                    onClick={() => handleTogglePayment(modalOrder)}
                  >
                    {modalOrder.payment.isPaid ? (
                      <>
                        <FiClock /> Ödənilmədi kimi işarələ
                      </>
                    ) : (
                      <>
                        <FiCheck /> Ödənildi kimi işarələ
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
