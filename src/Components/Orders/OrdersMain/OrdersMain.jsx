import React, { useState } from "react";
import {
  FiSearch, FiX, FiUser, FiLayout, FiCreditCard, FiCheck,
  FiClock, FiMoon, FiSun, FiPackage, FiCalendar,
  FiTruck, FiMapPin, FiPhone, FiEdit2, FiSave, FiNavigation,
  FiShoppingCart, FiPrinter, FiCheckCircle, FiList, FiMessageSquare,
} from "react-icons/fi";
import Popup from "../../Popup/Popup";
import "./OrdersMain.scss";

// ─── STATUS DEFİNİTİONS ───────────────────────────────────────────────────────
const ORDER_STATUSES = [
  { key: "ordered",   label: "Sifariş edildi",  color: "#6366f1", bg: "rgba(99,102,241,.12)",  border: "rgba(99,102,241,.25)",  Icon: FiShoppingCart },
  { key: "accepted",  label: "Qəbul olundu",    color: "#3b82f6", bg: "rgba(59,130,246,.12)",  border: "rgba(59,130,246,.25)",  Icon: FiCheck },
  { key: "printing",  label: "Çapdadır",         color: "#f59e0b", bg: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.25)",  Icon: FiPrinter },
  { key: "packaging", label: "Qablaşdırılır",    color: "#f97316", bg: "rgba(249,115,22,.12)",  border: "rgba(249,115,22,.25)",  Icon: FiPackage },
  { key: "courier",   label: "Kuryerdədir",      color: "#0891b2", bg: "rgba(8,145,178,.12)",   border: "rgba(8,145,178,.25)",   Icon: FiTruck },
  { key: "delivered", label: "Təhvil verildi",   color: "#22c55e", bg: "rgba(34,197,94,.12)",   border: "rgba(34,197,94,.25)",   Icon: FiCheckCircle },
];

const getStatusDef = (key) => ORDER_STATUSES.find((s) => s.key === key) || ORDER_STATUSES[0];

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const initialOrders = [
  {
    id: 1, orderNo: "INS-0038",
    user: { firstName: "Əli", lastName: "Məmmədov", userCode: "USR-0001" },
    design: { firstName: "Əli", lastName: "Məmmədov", profession: "Müəllim", initials: "ÆM", ringMode: "dark" },
    payment: { package: "Premium", months: 12, isPaid: true },
    status: "printing",
    delivery: { method: "address", address: "Nizami küçəsi, 15, mənzil 3", metro: "", time: "14:00", phone: "+994 50 123 45 67" },
    note: "Zəng etmədən gəlməyin",
  },
  {
    id: 2, orderNo: "INS-0039",
    user: { firstName: "Leyla", lastName: "Hüseynova", userCode: "USR-0002" },
    design: { firstName: "Leyla", lastName: "Hüseynova", profession: "Dizayner", initials: "LH", ringMode: "light" },
    payment: { package: "Basic", months: 6, isPaid: false },
    status: "accepted",
    delivery: { method: "metro", address: "", metro: "Nizami", time: "11:30", phone: "+994 55 234 56 78" },
    note: "",
  },
  {
    id: 3, orderNo: "INS-0040",
    user: { firstName: "Nicat", lastName: "Quliyev", userCode: "USR-0003" },
    design: { firstName: "Nicat", lastName: "Quliyev", profession: "Proqramçı", initials: "NQ", ringMode: "dark" },
    payment: { package: "VIP", months: 12, isPaid: true },
    status: "delivered",
    delivery: { method: "address", address: "Azadlıq pr., 102, mənzil 7", metro: "", time: "16:00", phone: "+994 70 345 67 89" },
    note: "Qapı zəngi işləmir",
  },
  {
    id: 4, orderNo: "INS-0041",
    user: { firstName: "Aytən", lastName: "Əliyeva", userCode: "USR-0004" },
    design: { firstName: "Aytən", lastName: "Əliyeva", profession: "Marketoloq", initials: "AƏ", ringMode: "light" },
    payment: { package: "Free", months: 1, isPaid: true },
    status: "packaging",
    delivery: { method: "metro", address: "", metro: "28 May", time: "13:00", phone: "+994 51 456 78 90" },
    note: "",
  },
  {
    id: 5, orderNo: "INS-0042",
    user: { firstName: "Rauf", lastName: "İsmayılov", userCode: "USR-0005" },
    design: { firstName: "Rauf", lastName: "İsmayılov", profession: "Həkim", initials: "Rİ", ringMode: "dark" },
    payment: { package: "Premium", months: 3, isPaid: false },
    status: "courier",
    delivery: { method: "address", address: "Hüsü Hacıyev küçəsi, 33", metro: "", time: "17:30", phone: "+994 50 567 89 01" },
    note: "Axşam saatlarında çatdırılsın",
  },
  {
    id: 6, orderNo: "INS-0043",
    user: { firstName: "Gülnar", lastName: "Babayeva", userCode: "USR-0006" },
    design: { firstName: "Gülnar", lastName: "Babayeva", profession: "Mühasib", initials: "GB", ringMode: "light" },
    payment: { package: "Basic", months: 12, isPaid: true },
    status: "ordered",
    delivery: { method: "metro", address: "", metro: "Əhmədli", time: "10:00", phone: "+994 55 678 90 12" },
    note: "",
  },
  {
    id: 7, orderNo: "INS-0044",
    user: { firstName: "Tural", lastName: "Nəsirov", userCode: "USR-0007" },
    design: { firstName: "Tural", lastName: "Nəsirov", profession: "Hüquqşünas", initials: "TN", ringMode: "dark" },
    payment: { package: "VIP", months: 6, isPaid: false },
    status: "accepted",
    delivery: { method: "address", address: "İnşaatçılar pr., 57, mənzil 12", metro: "", time: "15:00", phone: "+994 70 789 01 23" },
    note: "Ev sahibini axtarın",
  },
  {
    id: 8, orderNo: "INS-0045",
    user: { firstName: "Sevinc", lastName: "Orucova", userCode: "USR-0008" },
    design: { firstName: "Sevinc", lastName: "Orucova", profession: "Müəllim", initials: "SO", ringMode: "light" },
    payment: { package: "Premium", months: 12, isPaid: true },
    status: "printing",
    delivery: { method: "metro", address: "", metro: "İçərişəhər", time: "12:30", phone: "+994 51 890 12 34" },
    note: "Tez çatdırılsın",
  },
  {
    id: 9, orderNo: "INS-0046",
    user: { firstName: "Kamran", lastName: "Həsənov", userCode: "USR-0009" },
    design: { firstName: "Kamran", lastName: "Həsənov", profession: "Mühəndis", initials: "KH", ringMode: "dark" },
    payment: { package: "Basic", months: 3, isPaid: false },
    status: "ordered",
    delivery: { method: "address", address: "Xaqani küçəsi, 78, mənzil 2", metro: "", time: "09:00", phone: "+994 50 901 23 45" },
    note: "",
  },
  {
    id: 10, orderNo: "INS-0047",
    user: { firstName: "Nərmin", lastName: "Süleymanova", userCode: "USR-0010" },
    design: { firstName: "Nərmin", lastName: "Süleymanova", profession: "Psixoloq", initials: "NS", ringMode: "light" },
    payment: { package: "Premium", months: 6, isPaid: true },
    status: "packaging",
    delivery: { method: "metro", address: "", metro: "Koroğlu", time: "14:30", phone: "+994 55 012 34 56" },
    note: "Xahiş edirəm əvvəlcədən zəng edin",
  },
];

// ─── AVATAR COLORS ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
  "#ef4444", "#0088cc", "#E1306C", "#0A66C2",
  "#22c55e", "#6366f1",
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function OrdersMain() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ type: null, order: null });

  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

  // Delivery edit form state
  const [deliveryEdit, setDeliveryEdit] = useState({ isEditing: false, values: null });

  // ── Search ────────────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    const fullName = `${o.user.firstName} ${o.user.lastName}`.toLowerCase();
    const code = o.user.userCode.toLowerCase();
    const orderNo = o.orderNo.toLowerCase();
    const q = search.toLowerCase().trim();
    return fullName.includes(q) || code.includes(q) || orderNo.includes(q);
  });

  // ── Modal helpers ─────────────────────────────────────────────
  const openModal = (type, order) => {
    setModal({ type, order });
    if (type === "delivery") {
      setDeliveryEdit({
        isEditing: false,
        values: {
          address: order.delivery.address,
          metro: order.delivery.metro,
          time: order.delivery.time,
          phone: order.delivery.phone,
          note: order.note,
        },
      });
    }
  };

  const closeModal = () => {
    setModal({ type: null, order: null });
    setDeliveryEdit({ isEditing: false, values: null });
  };

  const modalOrder = modal.order
    ? orders.find((o) => o.id === modal.order.id) || modal.order
    : null;

  // ── Payment toggle ────────────────────────────────────────────
  const doTogglePayment = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, payment: { ...o.payment, isPaid: !o.payment.isPaid } } : o
      )
    );
  };

  const handleTogglePayment = (order) => {
    const willBePaid = !order.payment.isPaid;
    openPopup({
      type: willBePaid ? "update" : "delete",
      title: willBePaid ? "Ödəniş təsdiqlənsin?" : "Ödəniş ləğv edilsin?",
      message: willBePaid
        ? `"${order.user.firstName} ${order.user.lastName}" üçün ödəniş ödənildi kimi işarələnəcək.`
        : `"${order.user.firstName} ${order.user.lastName}" üçün ödəniş statusu gözlənilir kimi dəyişdiriləcək.`,
      confirmText: willBePaid ? "Ödənildi" : "Ləğv et",
      onConfirm: () => doTogglePayment(order.id),
    });
  };

  // ── Status change ─────────────────────────────────────────────
  const doChangeStatus = (orderId, newStatusKey) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatusKey } : o))
    );
  };

  const handleStatusChange = (order, newStatusKey) => {
    const newStatus = getStatusDef(newStatusKey);
    openPopup({
      type: "update",
      title: "Status dəyişdirilsin?",
      message: `"${order.user.firstName} ${order.user.lastName}" sifarişinin statusu "${newStatus.label}" olaraq dəyişdiriləcək.`,
      confirmText: "Dəyiş",
      onConfirm: () => doChangeStatus(order.id, newStatusKey),
    });
  };

  // ── Delivery save ─────────────────────────────────────────────
  const saveDelivery = () => {
    if (!modalOrder || !deliveryEdit.values) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === modalOrder.id
          ? {
              ...o,
              delivery: {
                ...o.delivery,
                address: deliveryEdit.values.address,
                metro: deliveryEdit.values.metro,
                time: deliveryEdit.values.time,
                phone: deliveryEdit.values.phone,
              },
              note: deliveryEdit.values.note,
            }
          : o
      )
    );
    setDeliveryEdit((p) => ({ ...p, isEditing: false }));
  };

  const cancelDeliveryEdit = () => {
    if (!modalOrder) return;
    setDeliveryEdit({
      isEditing: false,
      values: {
        address: modalOrder.delivery.address,
        metro: modalOrder.delivery.metro,
        time: modalOrder.delivery.time,
        phone: modalOrder.delivery.phone,
        note: modalOrder.note,
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="orders">
      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        confirmText={popup.confirmText}
        cancelText="Ləğv et"
        onConfirm={() => { popup.onConfirm?.(); closePopup(); }}
        onCancel={closePopup}
      />

      {/* HEADER */}
      <div className="orders__header">
        <div>
          <h2 className="orders__title">Sifarişlər</h2>
          <p className="orders__sub">İstifadəçilərin sifariş məlumatlarını idarə edin.</p>
        </div>
        <div className="orders__stat">
          <FiPackage />
          <span>{orders.length} sifariş</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="orders__search-row">
        <div className="orders__search-box">
          <FiSearch className="orders__search-icon" />
          <input
            type="text"
            className="orders__search-input"
            placeholder="Ad, soyad, istifadəçi kodu və ya sifariş nömrəsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="orders__search-clear" onClick={() => setSearch("")} aria-label="Təmizlə">
              <FiX />
            </button>
          )}
        </div>
        <span className="orders__count-badge">{filteredOrders.length} nəticə</span>
      </div>

      {/* TABLE */}
      <div className="orders__table-wrap">
        <table className="orders__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sifariş №</th>
              <th><span className="th-inner"><FiList /> Status</span></th>
              <th><span className="th-inner"><FiUser /> İstifadəçi</span></th>
              <th><span className="th-inner"><FiLayout /> Dizayn</span></th>
              <th><span className="th-inner"><FiCreditCard /> Ödəniş</span></th>
              <th><span className="th-inner"><FiTruck /> Çatdırılma</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="orders__empty">
                  <FiSearch />
                  <span>Nəticə tapılmadı</span>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => {
                const statusDef = getStatusDef(order.status);
                return (
                  <tr key={order.id}>
                    <td className="orders__td-num">{idx + 1}</td>
                    <td>
                      <span className="orders__order-no">{order.orderNo}</span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <button
                        className="orders__cell-btn orders__cell-btn--status"
                        onClick={() => openModal("status", order)}
                      >
                        <span
                          className="orders__status-chip"
                          style={{
                            background: statusDef.bg,
                            color: statusDef.color,
                            border: `1px solid ${statusDef.border}`,
                          }}
                        >
                          <statusDef.Icon />
                          {statusDef.label}
                        </span>
                      </button>
                    </td>

                    {/* USER */}
                    <td>
                      <button
                        className="orders__cell-btn orders__cell-btn--user"
                        onClick={() => openModal("user", order)}
                      >
                        <div
                          className="orders__avatar"
                          style={{ backgroundColor: AVATAR_COLORS[order.id % AVATAR_COLORS.length] }}
                        >
                          {order.design.initials}
                        </div>
                        <div className="orders__cell-info">
                          <span className="orders__cell-name">{order.user.firstName} {order.user.lastName}</span>
                          <span className="orders__cell-sub">{order.user.userCode}</span>
                        </div>
                      </button>
                    </td>

                    {/* DESIGN */}
                    <td>
                      <button
                        className="orders__cell-btn orders__cell-btn--design"
                        onClick={() => openModal("design", order)}
                      >
                        <span className="orders__cell-name">{order.design.profession}</span>
                        <span className={`orders__mode-chip orders__mode-chip--${order.design.ringMode}`}>
                          {order.design.ringMode === "dark" ? <FiMoon /> : <FiSun />}
                          {order.design.ringMode === "dark" ? "Dark" : "Light"}
                        </span>
                      </button>
                    </td>

                    {/* PAYMENT */}
                    <td>
                      <button
                        className="orders__cell-btn orders__cell-btn--payment"
                        onClick={() => openModal("payment", order)}
                      >
                        <span className="orders__pkg-name">{order.payment.package}</span>
                        <span className={`orders__paid-chip ${order.payment.isPaid ? "orders__paid-chip--paid" : "orders__paid-chip--unpaid"}`}>
                          {order.payment.isPaid ? <><FiCheck /> Ödənilib</> : <><FiClock /> Gözlənilir</>}
                        </span>
                      </button>
                    </td>

                    {/* DELIVERY */}
                    <td>
                      <button
                        className="orders__cell-btn orders__cell-btn--user"
                        onClick={() => openModal("delivery", order)}
                      >
                        <div className={`orders__delivery-badge orders__delivery-badge--${order.delivery.method}`}>
                          {order.delivery.method === "metro" ? <FiNavigation /> : <FiMapPin />}
                        </div>
                        <div className="orders__cell-info">
                          <span className="orders__cell-name">
                            {order.delivery.method === "metro" ? "Metro" : "Ünvan"}
                          </span>
                          <span className="orders__cell-sub">
                            {order.delivery.method === "metro"
                              ? order.delivery.metro
                              : order.delivery.address.length > 22
                                ? order.delivery.address.slice(0, 22) + "…"
                                : order.delivery.address}
                          </span>
                        </div>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {modal.type && modalOrder && (
        <div className="orders__modal-backdrop" onClick={closeModal}>
          <div
            className={`orders__modal${modal.type === "status" || modal.type === "delivery" ? " orders__modal--md" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── USER ── */}
            {modal.type === "user" && (
              <>
                <div className="orders__modal-header orders__modal-header--user">
                  <div className="orders__modal-icon-wrap"><FiUser /></div>
                  <h3>İstifadəçi Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}><FiX /></button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__modal-avatar" style={{ backgroundColor: AVATAR_COLORS[modalOrder.id % AVATAR_COLORS.length] }}>
                    {modalOrder.design.initials}
                  </div>
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ad</span>
                      <span className="orders__field-value">{modalOrder.user.firstName}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Soyad</span>
                      <span className="orders__field-value">{modalOrder.user.lastName}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">User Code</span>
                      <span className="orders__field-value orders__field-value--code">{modalOrder.user.userCode}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── DESIGN ── */}
            {modal.type === "design" && (
              <>
                <div className="orders__modal-header orders__modal-header--design">
                  <div className="orders__modal-icon-wrap"><FiLayout /></div>
                  <h3>Dizayn Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}><FiX /></button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__logo-wrap">
                    <div className="orders__logo-circle" style={{ backgroundColor: AVATAR_COLORS[modalOrder.id % AVATAR_COLORS.length] }}>
                      {modalOrder.design.initials}
                    </div>
                    <span className="orders__logo-hint">Logo</span>
                  </div>
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ad</span>
                      <span className="orders__field-value">{modalOrder.design.firstName}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Soyad</span>
                      <span className="orders__field-value">{modalOrder.design.lastName}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Peşə</span>
                      <span className="orders__field-value">{modalOrder.design.profession}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Ring Modu</span>
                      <span className={`orders__mode-chip orders__mode-chip--${modalOrder.design.ringMode}`}>
                        {modalOrder.design.ringMode === "dark" ? <FiMoon /> : <FiSun />}
                        {modalOrder.design.ringMode === "dark" ? "Dark Mode" : "Light Mode"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PAYMENT ── */}
            {modal.type === "payment" && (
              <>
                <div className="orders__modal-header orders__modal-header--payment">
                  <div className="orders__modal-icon-wrap"><FiCreditCard /></div>
                  <h3>Ödəniş Məlumatları</h3>
                  <button className="orders__modal-close" onClick={closeModal}><FiX /></button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__modal-fields">
                    <div className="orders__field-row">
                      <span className="orders__field-label"><FiPackage /> Paket</span>
                      <span className="orders__field-value orders__field-value--pkg">{modalOrder.payment.package}</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label"><FiCalendar /> Müddət</span>
                      <span className="orders__field-value">{modalOrder.payment.months} ay</span>
                    </div>
                    <div className="orders__field-row">
                      <span className="orders__field-label">Status</span>
                      <span className={`orders__paid-chip ${modalOrder.payment.isPaid ? "orders__paid-chip--paid" : "orders__paid-chip--unpaid"}`}>
                        {modalOrder.payment.isPaid ? <><FiCheck /> Ödənilib</> : <><FiClock /> Gözlənilir</>}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`orders__toggle-btn ${modalOrder.payment.isPaid ? "orders__toggle-btn--unpay" : "orders__toggle-btn--pay"}`}
                    onClick={() => handleTogglePayment(modalOrder)}
                  >
                    {modalOrder.payment.isPaid
                      ? <><FiClock /> Ödənilmədi kimi işarələ</>
                      : <><FiCheck /> Ödənildi kimi işarələ</>}
                  </button>
                </div>
              </>
            )}

            {/* ── STATUS ── */}
            {modal.type === "status" && (
              <>
                <div className="orders__modal-header orders__modal-header--status">
                  <div className="orders__modal-icon-wrap"><FiList /></div>
                  <h3>Sifariş Statusu</h3>
                  <button className="orders__modal-close" onClick={closeModal}><FiX /></button>
                </div>
                <div className="orders__modal-body orders__modal-body--status">
                  <div className="orders__status-list">
                    {ORDER_STATUSES.map((s, idx) => {
                      const currentIdx = ORDER_STATUSES.findIndex((st) => st.key === modalOrder.status);
                      const isActive = idx === currentIdx;
                      const isPast = idx < currentIdx;
                      return (
                        <React.Fragment key={s.key}>
                          <button
                            className={[
                              "orders__si",
                              isActive && "orders__si--active",
                              isPast && "orders__si--past",
                            ].filter(Boolean).join(" ")}
                            style={isActive ? { borderColor: s.border, background: s.bg } : {}}
                            onClick={() => !isActive && handleStatusChange(modalOrder, s.key)}
                            disabled={isActive}
                          >
                            <span
                              className="orders__si-dot"
                              style={isActive || isPast ? { background: s.color, color: "#fff" } : {}}
                            >
                              <s.Icon />
                            </span>
                            <span
                              className="orders__si-label"
                              style={isActive ? { color: s.color, fontWeight: 700 } : {}}
                            >
                              {s.label}
                            </span>
                            {isActive && (
                              <span
                                className="orders__si-badge"
                                style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                              >
                                Cari
                              </span>
                            )}
                          </button>
                          {idx < ORDER_STATUSES.length - 1 && (
                            <div
                              className={`orders__si-line${isPast ? " orders__si-line--done" : ""}`}
                              style={isPast ? { background: s.color } : {}}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── DELIVERY ── */}
            {modal.type === "delivery" && deliveryEdit.values && (
              <>
                <div className="orders__modal-header orders__modal-header--delivery">
                  <div className="orders__modal-icon-wrap">
                    {modalOrder.delivery.method === "metro" ? <FiNavigation /> : <FiTruck />}
                  </div>
                  <h3>Çatdırılma Məlumatları</h3>
                  {!deliveryEdit.isEditing ? (
                    <button
                      className="orders__modal-action-btn orders__modal-action-btn--edit"
                      onClick={() => setDeliveryEdit((p) => ({ ...p, isEditing: true }))}
                    >
                      <FiEdit2 /> Düzəlt
                    </button>
                  ) : (
                    <button
                      className="orders__modal-action-btn orders__modal-action-btn--save"
                      onClick={saveDelivery}
                    >
                      <FiSave /> Saxla
                    </button>
                  )}
                  <button className="orders__modal-close" onClick={closeModal}><FiX /></button>
                </div>
                <div className="orders__modal-body">
                  <div className="orders__modal-fields">

                    {/* Üsul — dəyişdirilmir */}
                    <div className="orders__field-row">
                      <span className="orders__field-label">
                        {modalOrder.delivery.method === "metro" ? <FiNavigation /> : <FiMapPin />}
                        Üsul
                      </span>
                      <span className="orders__field-value">
                        <span className={`orders__method-chip orders__method-chip--${modalOrder.delivery.method}`}>
                          {modalOrder.delivery.method === "metro" ? "Metro" : "Ünvana çatdırılma"}
                        </span>
                      </span>
                    </div>

                    {/* Stansiya / Ünvan */}
                    {modalOrder.delivery.method === "metro" ? (
                      <div className="orders__field-row">
                        <span className="orders__field-label"><FiNavigation /> Stansiya</span>
                        {deliveryEdit.isEditing ? (
                          <input
                            className="orders__field-input"
                            value={deliveryEdit.values.metro}
                            onChange={(e) => setDeliveryEdit((p) => ({ ...p, values: { ...p.values, metro: e.target.value } }))}
                            placeholder="Metro stansiyası"
                          />
                        ) : (
                          <span className="orders__field-value">{deliveryEdit.values.metro || "—"}</span>
                        )}
                      </div>
                    ) : (
                      <div className="orders__field-row">
                        <span className="orders__field-label"><FiMapPin /> Ünvan</span>
                        {deliveryEdit.isEditing ? (
                          <input
                            className="orders__field-input"
                            value={deliveryEdit.values.address}
                            onChange={(e) => setDeliveryEdit((p) => ({ ...p, values: { ...p.values, address: e.target.value } }))}
                            placeholder="Ünvan daxil edin"
                          />
                        ) : (
                          <span className="orders__field-value orders__field-value--wrap">{deliveryEdit.values.address || "—"}</span>
                        )}
                      </div>
                    )}

                    {/* Saat */}
                    <div className="orders__field-row">
                      <span className="orders__field-label"><FiClock /> Saat</span>
                      {deliveryEdit.isEditing ? (
                        <input
                          className="orders__field-input orders__field-input--sm"
                          type="time"
                          value={deliveryEdit.values.time}
                          onChange={(e) => setDeliveryEdit((p) => ({ ...p, values: { ...p.values, time: e.target.value } }))}
                        />
                      ) : (
                        <span className="orders__field-value">{deliveryEdit.values.time || "—"}</span>
                      )}
                    </div>

                    {/* Nömrə */}
                    <div className="orders__field-row">
                      <span className="orders__field-label"><FiPhone /> Nömrə</span>
                      {deliveryEdit.isEditing ? (
                        <input
                          className="orders__field-input"
                          value={deliveryEdit.values.phone}
                          onChange={(e) => setDeliveryEdit((p) => ({ ...p, values: { ...p.values, phone: e.target.value } }))}
                          placeholder="+994 XX XXX XX XX"
                        />
                      ) : (
                        <span className="orders__field-value">{deliveryEdit.values.phone || "—"}</span>
                      )}
                    </div>

                    {/* Qeyd */}
                    <div className="orders__field-row orders__field-row--note">
                      <span className="orders__field-label"><FiMessageSquare /> Qeyd</span>
                      {deliveryEdit.isEditing ? (
                        <textarea
                          className="orders__field-textarea"
                          value={deliveryEdit.values.note}
                          onChange={(e) => setDeliveryEdit((p) => ({ ...p, values: { ...p.values, note: e.target.value } }))}
                          placeholder="Əlavə qeyd..."
                          rows={3}
                        />
                      ) : (
                        <span className="orders__field-value orders__field-value--note">
                          {deliveryEdit.values.note || <em className="orders__no-note">—</em>}
                        </span>
                      )}
                    </div>
                  </div>

                  {deliveryEdit.isEditing && (
                    <button className="orders__cancel-edit-btn" onClick={cancelDeliveryEdit}>
                      Ləğv et
                    </button>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
