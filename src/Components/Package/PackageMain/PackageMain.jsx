import React, { useState } from "react";
import { FiCheck, FiX, FiInfo, FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import "./PackageMain.scss";

const initialPackages = {
  basic: { name: "Sadə", price: "12.90₼" },
  pro: { name: "Pro", price: "26.90₼" },
  premium: { name: "Premium", price: "32.90₼" },
};

const initialFeatures = [
  {
    id: 1,
    name: "Sosial şəbəkə",
    info: "Bütün sosial şəbəkə hesablarınızı tək bir səhifədə birləşdirin.",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    id: 2,
    name: "Əlaqə məlumatları",
    info: "Telefon, e-poçt və ünvan kimi əlaqə vasitələrini müştərilərlə paylaşın.",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    id: 3,
    name: "Sistem analitikası",
    info: "Profilinizə baxış sayını və hansı linklərə klikləndiyini detallı izləyin.",
    basic: false,
    pro: true,
    premium: true,
  },
  {
    id: 4,
    name: "Xüsusi dizayn",
    info: "Kartınızın üzərində şirkətinizin loqosu və fərdi dizaynı tətbiq olunur.",
    basic: false,
    pro: true,
    premium: true,
  },
  {
    id: 5,
    name: "Digital kart",
    info: "Apple Wallet və Google Wallet üçün rəqəmsal kart dəstəyi.",
    basic: false,
    pro: false,
    premium: true,
  },
];

const PKG_KEYS = [
  { key: "basic", label: "Sadə" },
  { key: "pro", label: "Pro" },
  { key: "premium", label: "Premium" },
];

export default function PackageMain() {
  const [packages, setPackages] = useState(initialPackages);
  const [features, setFeatures] = useState(initialFeatures);

  // Paket adı / qiyməti dəyişmək
  const handlePkgChange = (pkgKey, field, value) =>
    setPackages((p) => ({
      ...p,
      [pkgKey]: { ...p[pkgKey], [field]: value },
    }));

  // Xüsusiyyət mətnini dəyişmək
  const handleFeatText = (id, field, value) =>
    setFeatures((f) =>
      f.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );

  // Xüsusiyyətin paket üzrə aktiv/passiv vəziyyətini dəyişmək
  const toggleFeat = (id, pkgKey) =>
    setFeatures((f) =>
      f.map((x) => (x.id === id ? { ...x, [pkgKey]: !x[pkgKey] } : x)),
    );

  // Yeni xüsusiyyət əlavə etmək
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
      },
    ]);
  };

  // Xüsusiyyət silmək
  const handleDelete = (id) => setFeatures(features.filter((f) => f.id !== id));

  // Yadda saxla
  const handleSave = () => {
    console.log("Paketlər:", packages);
    console.log("Xüsusiyyətlər:", features);
    alert("Dəyişikliklər uğurla yadda saxlanıldı!");
  };

  return (
    <div className="pkg-admin">
      {/* ══════════════ HEADER ══════════════ */}
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

      {/* ══════════════ PAKET QİYMƏTLƏRİ ══════════════ */}
      <div className="pkg-admin__card">
        <h3 className="pkg-admin__section-title">Mövcud Paketlər</h3>
        <div className="pkg-admin__packages">
          {PKG_KEYS.map(({ key, label }) => (
            <div
              key={key}
              className={`pkg-admin__pkg-box pkg-admin__pkg-box--${key}`}
            >
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
                <label className="pkg-admin__field-label">Qiymət</label>
                <input
                  className="pkg-admin__pkg-price"
                  type="text"
                  value={packages[key].price}
                  onChange={(e) =>
                    handlePkgChange(key, "price", e.target.value)
                  }
                  placeholder="0.00₼"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ XÜSUSİYYƏTLƏR ══════════════ */}
      <div className="pkg-admin__card">
        <h3 className="pkg-admin__section-title">Xüsusiyyətlər</h3>

        <div className="pkg-admin__features">
          {features.map((feat) => (
            <div className="pkg-admin__feat-row" key={feat.id}>
              {/* Mətn inputları */}
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

              {/* Toggle-lar */}
              <div className="pkg-admin__toggles">
                {PKG_KEYS.map(({ key, label }) => (
                  <div
                    key={key}
                    className={`pkg-admin__toggle ${
                      feat[key] ? "pkg-admin__toggle--on" : ""
                    }`}
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

              {/* Silmə düyməsi */}
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

        {/* Yeni xüsusiyyət əlavə et */}
        <button className="pkg-admin__add-btn" onClick={handleAdd}>
          <FiPlus /> Yeni Özəllik Əlavə Et
        </button>
      </div>
    </div>
  );
}
