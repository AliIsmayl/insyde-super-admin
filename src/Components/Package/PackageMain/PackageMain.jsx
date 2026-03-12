import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiInfo,
  FiSave,
  FiPlus,
  FiTrash2,
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
  FiSlash,
  FiRefreshCw,
} from "react-icons/fi";
import "./PackageMain.scss";

// ─────────────────────────────────────────────
// POPUP
// ─────────────────────────────────────────────
const POPUP_CONFIG = {
  success: {
    Icon: FiCheckCircle,
    confirmClass: "popup__btn--success",
    defaultConfirm: "Əla",
    cancelable: false,
  },
  delete: {
    Icon: FiTrash2,
    confirmClass: "popup__btn--delete",
    defaultConfirm: "Sil",
    cancelable: true,
  },
  error: {
    Icon: FiAlertCircle,
    confirmClass: "popup__btn--error",
    defaultConfirm: "Anladım",
    cancelable: false,
  },
  block: {
    Icon: FiSlash,
    confirmClass: "popup__btn--block",
    defaultConfirm: "Blokla",
    cancelable: true,
  },
  update: {
    Icon: FiRefreshCw,
    confirmClass: "popup__btn--update",
    defaultConfirm: "Yenilə",
    cancelable: true,
  },
};

function Popup({
  isOpen = false,
  type = "success",
  title = "",
  message = "",
  confirmText,
  cancelText = "Ləğv et",
  onConfirm,
  onCancel,
}) {
  const cfg = POPUP_CONFIG[type] ?? POPUP_CONFIG.success;
  const finalConfirmText = confirmText ?? cfg.defaultConfirm;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="popup__overlay"
        onClick={cfg.cancelable ? onCancel : undefined}
        aria-hidden="true"
      />
      <div
        className={`popup popup--${type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {cfg.cancelable && (
          <button
            className="popup__close"
            onClick={onCancel}
            aria-label="Bağla"
          >
            <FiX />
          </button>
        )}
        <div className="popup__icon-wrap">
          <cfg.Icon className="popup__icon" />
        </div>
        <div className="popup__content">
          {title && (
            <h3 id="popup-title" className="popup__title">
              {title}
            </h3>
          )}
          {message && <p className="popup__message">{message}</p>}
        </div>
        <div className="popup__actions">
          {cfg.cancelable && (
            <button
              className="popup__btn popup__btn--cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`popup__btn ${cfg.confirmClass}`}
            onClick={() => onConfirm?.()}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const initialPackages = {
  basic: {
    name: "Sadə",
    price: "12.90",
    monthlyTotal: "1.50",
    hasMinProfiles: false,
    minProfiles: null,
  },
  pro: {
    name: "Pro",
    price: "26.90",
    monthlyTotal: "2.00",
    hasMinProfiles: false,
    minProfiles: null,
  },
  premium: {
    name: "Premium",
    price: "36.90",
    monthlyTotal: "2.00",
    hasMinProfiles: false,
    minProfiles: null,
  },
  biznes: {
    name: "Biznes",
    price: "52.90",
    monthlyTotal: "4.00",
    hasMinProfiles: true,
    minProfiles: 5,
  },
};

const initialFeatures = [
  {
    id: 1,
    name: "Sosial şəbəkə",
    info: "Bütün sosial şəbəkə hesablarınızı tək bir səhifədə birləşdirin.",
    basic: true,
    pro: true,
    premium: true,
    biznes: true,
  },
  {
    id: 2,
    name: "Əlaqə məlumatları",
    info: "Telefon, e-poçt və ünvan kimi əlaqə vasitələrini müştərilərlə paylaşın.",
    basic: true,
    pro: true,
    premium: true,
    biznes: true,
  },
  {
    id: 3,
    name: "Portfel, kataloq, menu",
    info: "Məhsul və xidmətlərinizi vizual olaraq nümayiş etdirin.",
    basic: false,
    pro: true,
    premium: true,
    biznes: true,
  },
  {
    id: 4,
    name: "NFC + QR sistem",
    info: "NFC kart və QR kod ilə profil paylaşımı.",
    basic: false,
    pro: true,
    premium: true,
    biznes: true,
  },
  {
    id: 5,
    name: "Fiziki kart",
    info: "Şirkət loqolu premium fiziki NFC kart çatdırılması.",
    basic: false,
    pro: false,
    premium: true,
    biznes: true,
  },
  {
    id: 6,
    name: "Sistem analitikası",
    info: "Profilinizə baxış sayını və hansı linklərə klikləndiyini detallı izləyin.",
    basic: false,
    pro: false,
    premium: true,
    biznes: true,
  },
  {
    id: 7,
    name: "Xüsusi dizayn",
    info: "Kartınızın üzərində şirkətinizin loqosu və fərdi dizaynı tətbiq olunur.",
    basic: false,
    pro: false,
    premium: false,
    biznes: true,
  },
  {
    id: 8,
    name: "Fərdi müqavilə",
    info: "Şirkətiniz üçün ayrıca müqavilə və dəstək paketi.",
    basic: false,
    pro: false,
    premium: false,
    biznes: true,
  },
];

const PKG_KEYS = [
  { key: "basic", label: "Sadə" },
  { key: "pro", label: "Pro" },
  { key: "premium", label: "Premium" },
  { key: "biznes", label: "Biznes", highlight: true },
];

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function PackageMain() {
  const [packages, setPackages] = useState(initialPackages);
  const [features, setFeatures] = useState(initialFeatures);

  // Popup state
  const [popup, setPopup] = useState({ isOpen: false, type: "success" });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));

  // ── Paket dəyişikliyi ──
  const handlePkgChange = (pkgKey, field, value) =>
    setPackages((p) => ({ ...p, [pkgKey]: { ...p[pkgKey], [field]: value } }));

  // ── Xüsusiyyət mətn ──
  const handleFeatText = (id, field, value) =>
    setFeatures((f) =>
      f.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );

  // ── Toggle — update popup ilə ──
  const toggleFeat = (id, pkgKey) => {
    const feat = features.find((f) => f.id === id);
    const willEnable = !feat[pkgKey];
    const pkgLabel = PKG_KEYS.find((p) => p.key === pkgKey)?.label ?? pkgKey;

    setPopup({
      isOpen: true,
      type: "update",
      title: willEnable ? "Xüsusiyyəti aktiv et?" : "Xüsusiyyəti deaktiv et?",
      message: `"${feat.name}" xüsusiyyəti "${pkgLabel}" paketi üçün ${willEnable ? "aktiv" : "deaktiv"} ediləcək.`,
      confirmText: willEnable ? "Aktiv et" : "Deaktiv et",
      onConfirm: () => {
        setFeatures((f) =>
          f.map((x) => (x.id === id ? { ...x, [pkgKey]: !x[pkgKey] } : x)),
        );
        closePopup();
      },
    });
  };

  // ── Əlavə et — success popup ──
  const handleAdd = () => {
    const newId =
      features.length > 0 ? features[features.length - 1].id + 1 : 1;
    setFeatures([
      ...features,
      {
        id: newId,
        name: "",
        info: "",
        basic: false,
        pro: false,
        premium: false,
        biznes: false,
      },
    ]);
  };

  // ── Sil — delete popup ilə təsdiq ──
  const handleDelete = (id) => {
    const feat = features.find((f) => f.id === id);
    setPopup({
      isOpen: true,
      type: "delete",
      title: "Xüsusiyyəti sil?",
      message: `"${feat?.name || "Bu xüsusiyyət"}" silinəcək. Bu əməliyyat geri qaytarıla bilməz.`,
      confirmText: "Sil",
      onConfirm: () => {
        setFeatures((f) => f.filter((x) => x.id !== id));
        closePopup();
      },
    });
  };

  // ── Yadda saxla — update popup, sonra success ──
  const handleSave = () => {
    // Boş adlı xüsusiyyət varsa xəta
    const hasEmpty = features.some((f) => !f.name.trim());
    if (hasEmpty) {
      setPopup({
        isOpen: true,
        type: "error",
        title: "Xəta!",
        message: "Bəzi xüsusiyyətlərin adı boşdur. Zəhmət olmasa doldurun.",
        confirmText: "Anladım",
        onConfirm: closePopup,
      });
      return;
    }

    setPopup({
      isOpen: true,
      type: "update",
      title: "Dəyişiklikləri yadda saxla?",
      message: "Bütün paket və xüsusiyyət məlumatları yenilənəcək.",
      confirmText: "Yadda Saxla",
      onConfirm: () => {
        // API çağırışı buraya yazılacaq
        console.log("Paketlər:", packages);
        console.log("Xüsusiyyətlər:", features);
        setPopup({
          isOpen: true,
          type: "success",
          title: "Uğurla saxlanıldı!",
          message: "Dəyişikliklər sistemə tətbiq edildi.",
          confirmText: "Əla",
          onConfirm: closePopup,
        });
      },
    });
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="pkg-admin">
      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        confirmText={popup.confirmText}
        cancelText="Ləğv et"
        onConfirm={popup.onConfirm}
        onCancel={closePopup}
      />

      {/* HEADER */}
      <div className="pkg-admin__header">
        <div className="pkg-admin__header-texts">
          <h2 className="pkg-admin__title">Paketlərin İdarə Edilməsi</h2>
          <p className="pkg-admin__sub">
            Müştərilərin görəcəyi qiymətləri və xüsusiyyətləri buradan
            tənzimləyin.
          </p>
        </div>
        <button className="pkg-admin__save-btn" onClick={handleSave}>
          <FiSave /> Yadda Saxla
        </button>
      </div>

      {/* PAKET QİYMƏTLƏRİ */}
      <div className="pkg-admin__card">
        <h3 className="pkg-admin__section-title">Mövcud Paketlər</h3>
        <div className="pkg-admin__packages">
          {PKG_KEYS.map(({ key, label, highlight }) => (
            <div
              key={key}
              className={`pkg-admin__pkg-box pkg-admin__pkg-box--${key}${highlight ? " pkg-admin__pkg-box--highlight" : ""}`}
            >
              {highlight && (
                <span className="pkg-admin__pkg-badge">
                  <FiZap /> Biznes
                </span>
              )}
              <span className="pkg-admin__pkg-label">{label} Paket</span>

              <div className="pkg-admin__pkg-field">
                <label className="pkg-admin__field-label">Paket Adı</label>
                <input
                  className="pkg-admin__pkg-name"
                  type="text"
                  value={packages[key].name}
                  onChange={(e) => handlePkgChange(key, "name", e.target.value)}
                  placeholder="Paket adı..."
                />
              </div>

              <div className="pkg-admin__pkg-field">
                <label className="pkg-admin__field-label">
                  Qiymət (₼ / hesab)
                </label>
                <input
                  className="pkg-admin__pkg-price"
                  type="text"
                  value={packages[key].price}
                  onChange={(e) =>
                    handlePkgChange(key, "price", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="pkg-admin__pkg-field">
                <label className="pkg-admin__field-label">
                  Minimum Profil Sayı
                </label>
                {packages[key].hasMinProfiles ? (
                  <input
                    className="pkg-admin__pkg-meta"
                    type="number"
                    min="1"
                    value={packages[key].minProfiles ?? ""}
                    onChange={(e) =>
                      handlePkgChange(
                        key,
                        "minProfiles",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="0"
                  />
                ) : (
                  <div className="pkg-admin__pkg-meta pkg-admin__pkg-meta--static">
                    Yoxdur
                  </div>
                )}
              </div>

              <div className="pkg-admin__pkg-field">
                <label className="pkg-admin__field-label">
                  Aylıq Qiymət (₼/ay)
                </label>
                <input
                  className="pkg-admin__pkg-meta"
                  type="text"
                  value={packages[key].monthlyTotal ?? ""}
                  onChange={(e) =>
                    handlePkgChange(key, "monthlyTotal", e.target.value || null)
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XÜSUSİYYƏTLƏR */}
      <div className="pkg-admin__card">
        <h3 className="pkg-admin__section-title">Xüsusiyyətlər</h3>

        <div className="pkg-admin__features">
          {features.map((feat) => (
            <div className="pkg-admin__feat-row" key={feat.id}>
              <div className="pkg-admin__feat-inputs">
                <input
                  className="pkg-admin__feat-name"
                  type="text"
                  value={feat.name}
                  onChange={(e) =>
                    handleFeatText(feat.id, "name", e.target.value)
                  }
                  placeholder="Xüsusiyyətin adı"
                />
                <div className="pkg-admin__feat-info-row">
                  <FiInfo className="pkg-admin__info-icon" />
                  <input
                    className="pkg-admin__feat-info"
                    type="text"
                    value={feat.info}
                    onChange={(e) =>
                      handleFeatText(feat.id, "info", e.target.value)
                    }
                    placeholder="Müştərilər üçün qısa açıqlama..."
                  />
                </div>
              </div>

              <div className="pkg-admin__toggles">
                {PKG_KEYS.map(({ key, label, highlight }) => (
                  <div
                    key={key}
                    className={`pkg-admin__toggle ${feat[key] ? "pkg-admin__toggle--on" : ""}${highlight ? " pkg-admin__toggle--biznes" : ""}`}
                    onClick={() => toggleFeat(feat.id, key)}
                  >
                    <span className="pkg-admin__toggle-label">{label}</span>
                    {feat[key] ? (
                      <FiCheck className="pkg-admin__icon-check" />
                    ) : (
                      <FiX className="pkg-admin__icon-cross" />
                    )}
                  </div>
                ))}
              </div>

              <button
                className="pkg-admin__del-btn"
                onClick={() => handleDelete(feat.id)}
              >
                <FiTrash2 />
                <span className="pkg-admin__del-text">Sil</span>
              </button>
            </div>
          ))}
        </div>

        <button className="pkg-admin__add-btn" onClick={handleAdd}>
          <FiPlus /> Yeni Özəllik Əlavə Et
        </button>
      </div>
    </div>
  );
}
