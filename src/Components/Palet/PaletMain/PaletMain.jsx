import React, { useState, useCallback } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiSun,
  FiMoon,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import "./PaletMain.scss";

/* ─────────────────────────────────────────────────────────── */
/*  GRADIENT GENERATOR                                          */
/* ─────────────────────────────────────────────────────────── */

/** hex → {r,g,b} */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/** rgb → hex */
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.min(255, Math.max(0, Math.round(v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** Rəng qarışdır: base + white/black */
function mix(hex, white = 0, black = 0) {
  const { r, g, b } = hexToRgb(hex);
  return {
    r: r + (255 - r) * white - r * black,
    g: g + (255 - g) * white - g * black,
    b: b + (255 - b) * white - b * black,
  };
}

function mixHex(hex, white = 0, black = 0) {
  const { r, g, b } = mix(hex, white, black);
  return rgbToHex(r, g, b);
}

/**
 * Əsas rəngdən light + dark hero-gradient CSS dəyişənlərini generasiya edir.
 * Məntiqi: bd.scss-dəki --hero-gradient strukturuna uyğundur.
 */
function generateGradients(hex) {
  const { r, g, b } = hexToRgb(hex);

  // Light — isti krem fon üzərindəki rəng
  const lightMid = mixHex(hex, 0.45, 0); // rəng + ağ
  const lightDeep = mixHex(hex, 0, 0.15); // bir az tündləş
  const lightBg1 = mixHex(hex, 0.62, 0); // açıq
  const lightBg2 = mixHex(hex, 0.38, 0.05);

  const light = `radial-gradient(ellipse 80% 60% at 20% 30%, rgba(${r},${g},${b},0.55) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(${hexToRgb(lightDeep).r},${hexToRgb(lightDeep).g},${hexToRgb(lightDeep).b},0.3) 0%, transparent 60%),
    linear-gradient(160deg, ${lightBg1} 0%, ${lightMid} 30%, ${hex} 60%, ${lightDeep} 100%)`;

  // Dark — qaranlıq, dərin fon üzərindəki rəng
  const darkBase = mixHex(hex, 0, 0.45);
  const darkDeep = mixHex(hex, 0, 0.72);
  const darkDeep2 = mixHex(hex, 0, 0.85);
  const darkMid = mixHex(hex, 0, 0.6);
  const { r: dr, g: dg, b: db } = hexToRgb(darkBase);
  const { r: dr2, g: dg2, b: db2 } = hexToRgb(darkDeep);

  const dark = `radial-gradient(ellipse 75% 55% at 18% 25%, rgba(${dr},${dg},${db},0.75) 0%, transparent 60%),
    radial-gradient(ellipse 55% 65% at 75% 80%, rgba(${dr2},${dg2},${db2},0.6) 0%, transparent 60%),
    radial-gradient(ellipse 90% 40% at 50% 50%, rgba(${hexToRgb(darkMid).r},${hexToRgb(darkMid).g},${hexToRgb(darkMid).b},0.4) 0%, transparent 70%),
    linear-gradient(155deg, ${darkDeep2} 0%, ${darkDeep} 18%, ${darkMid} 35%, ${darkBase} 52%, ${mixHex(hex, 0, 0.68)} 72%, ${mixHex(hex, 0, 0.9)} 100%)`;

  return { light, dark };
}

/* ─────────────────────────────────────────────────────────── */
/*  GRADIENT PREVIEW                                            */
/* ─────────────────────────────────────────────────────────── */
function GradientPreview({ label, icon, gradient }) {
  return (
    <div className="palet__grad-block">
      <div className="palet__grad-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="palet__grad-preview" style={{ background: gradient }}>
        <div className="palet__grad-mock">
          <div className="palet__grad-mock-avatar" />
          <div className="palet__grad-mock-lines">
            <div className="palet__grad-mock-line palet__grad-mock-line--name" />
            <div className="palet__grad-mock-line palet__grad-mock-line--role" />
          </div>
        </div>
        <div className="palet__grad-overlay" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  INITIAL DATA                                                */
/* ─────────────────────────────────────────────────────────── */
const initialColors = [
  { id: 1, name: "Qızılı", hex: "#C8A75E" },
  { id: 2, name: "Mavi", hex: "#2980B9" },
  { id: 3, name: "Yaşıl", hex: "#27AE60" },
  { id: 4, name: "Bənövşəyi", hex: "#8E44AD" },
];

/* ─────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                              */
/* ─────────────────────────────────────────────────────────── */
export default function PaletMain() {
  const [colors, setColors] = useState(initialColors);
  const [selectedId, setSelectedId] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editHex, setEditHex] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#000000");
  const [deleteId, setDeleteId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const selected = colors.find((c) => c.id === selectedId);
  const previewHex = editingId === selected?.id ? editHex : selected?.hex;
  const gradients = previewHex ? generateGradients(previewHex) : null;

  /* ── EDIT ── */
  const startEdit = (color) => {
    setEditingId(color.id);
    setEditName(color.name);
    setEditHex(color.hex);
    setAddMode(false);
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id) => {
    if (!editName.trim()) return;
    setColors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: editName, hex: editHex } : c,
      ),
    );
    setEditingId(null);
    flash(id);
  };

  /* ── ADD ── */
  const startAdd = () => {
    setAddMode(true);
    setNewName("");
    setNewHex("#C8A75E");
    setEditingId(null);
  };
  const cancelAdd = () => setAddMode(false);
  const saveAdd = () => {
    if (!newName.trim()) return;
    const id = Date.now();
    setColors((prev) => [...prev, { id, name: newName, hex: newHex }]);
    setSelectedId(id);
    setAddMode(false);
  };

  /* ── DELETE ── */
  const doDelete = () => {
    const remaining = colors.filter((c) => c.id !== deleteId);
    setColors(remaining);
    if (selectedId === deleteId) setSelectedId(remaining[0]?.id || null);
    setDeleteId(null);
    if (editingId === deleteId) setEditingId(null);
  };

  const flash = (id) => {
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1800);
  };

  /* ── RANDOM HEX ── */
  const randomHex = () => {
    const h = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    return "#" + h;
  };

  return (
    <div className="palet">
      {/* ══ HEADER ══ */}
      <div className="palet__header">
        <div>
          <h2 className="palet__title">Rəng Palitраları</h2>
          <p className="palet__sub">
            Hər rəng üçün hero gradient avtomatik generasiya olunur — light və
            dark mode ayrı-ayrı.
          </p>
        </div>
        <button className="palet__add-btn" onClick={startAdd}>
          <FiPlus /> Yeni Rəng
        </button>
      </div>

      {/* ══ LAYOUT ══ */}
      <div className="palet__layout">
        {/* ── SOL SİDEBAR ── */}
        <div className="palet__sidebar">
          <div className="palet__sidebar-title">Rənglər</div>

          <div className="palet__list">
            {colors.map((color) => {
              const grads = generateGradients(color.hex);
              return (
                <div
                  key={color.id}
                  className={`palet__list-item ${selectedId === color.id ? "palet__list-item--active" : ""}`}
                  onClick={() => {
                    setSelectedId(color.id);
                    setEditingId(null);
                    setAddMode(false);
                  }}
                >
                  {/* Kiçik gradient önizləməsi */}
                  <div
                    className="palet__list-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${mixHex(color.hex, 0.35, 0)} 0%, ${color.hex} 50%, ${mixHex(color.hex, 0, 0.3)} 100%)`,
                    }}
                  />
                  <div className="palet__list-info">
                    <span className="palet__list-name">{color.name}</span>
                    <span className="palet__list-hex">{color.hex}</span>
                  </div>
                  <div className="palet__list-modes">
                    <span
                      className="palet__list-mode-dot"
                      style={{
                        background: grads.light.includes("linear")
                          ? color.hex
                          : "#ccc",
                      }}
                      title="Light"
                    />
                    <span
                      className="palet__list-mode-dot palet__list-mode-dot--dark"
                      style={{ background: mixHex(color.hex, 0, 0.5) }}
                      title="Dark"
                    />
                  </div>
                  <button
                    className="palet__list-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(color.id);
                    }}
                    title="Sil"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
            {colors.length === 0 && (
              <div className="palet__list-empty">Hələ rəng yoxdur.</div>
            )}
          </div>
        </div>

        {/* ── SAĞ DETAL ── */}
        <div className="palet__detail">
          {selected ? (
            <div className="palet__card">
              {/* Kart başlığı */}
              <div className="palet__card-header">
                <div className="palet__card-title-row">
                  <div
                    className="palet__card-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${mixHex(previewHex, 0.35, 0)} 0%, ${previewHex} 50%, ${mixHex(previewHex, 0, 0.3)} 100%)`,
                    }}
                  />
                  {editingId === selected.id ? (
                    <div className="palet__edit-fields">
                      <input
                        type="color"
                        className="palet__color-picker-mini"
                        value={editHex}
                        onChange={(e) => setEditHex(e.target.value)}
                      />
                      <input
                        className="palet__edit-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Rəng adı"
                        autoFocus
                      />
                      <input
                        className="palet__edit-hex"
                        type="text"
                        value={editHex}
                        onChange={(e) => setEditHex(e.target.value)}
                        maxLength={7}
                        placeholder="#000000"
                      />
                    </div>
                  ) : (
                    <div className="palet__card-title-info">
                      <h3>{selected.name}</h3>
                      <span className="palet__card-hex">{selected.hex}</span>
                    </div>
                  )}
                </div>
                <div className="palet__card-actions">
                  {savedId === selected.id && (
                    <span className="palet__saved-badge">
                      <FiCheck /> Saxlanıldı
                    </span>
                  )}
                  {editingId === selected.id ? (
                    <>
                      <button
                        className="palet__btn palet__btn--ghost"
                        onClick={cancelEdit}
                      >
                        <FiX /> Ləğv
                      </button>
                      <button
                        className="palet__btn palet__btn--primary"
                        onClick={() => saveEdit(selected.id)}
                      >
                        <FiSave /> Saxla
                      </button>
                    </>
                  ) : (
                    <button
                      className="palet__btn palet__btn--outline"
                      onClick={() => startEdit(selected)}
                    >
                      <FiEdit2 /> Düzəliş et
                    </button>
                  )}
                </div>
              </div>

              {/* Gradient bölməsi */}
              <div className="palet__grad-section">
                <div className="palet__grad-section-title">
                  Hero Gradient Önizləməsi
                </div>

                <div className="palet__grad-grid">
                  <GradientPreview
                    label="Light Mode"
                    icon={<FiSun />}
                    gradient={gradients.light}
                  />
                  <GradientPreview
                    label="Dark Mode"
                    icon={<FiMoon />}
                    gradient={gradients.dark}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="palet__empty">
              <span>Soldan bir rəng seçin.</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ YENİ RƏNG MODALI ══ */}
      {addMode && (
        <div className="palet__modal-backdrop" onClick={cancelAdd}>
          <div
            className="palet__add-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palet__add-modal__header">
              <div className="palet__add-modal__header-left">
                <div
                  className="palet__add-modal__swatch"
                  style={{
                    background: `linear-gradient(135deg, ${mixHex(newHex, 0.35, 0)} 0%, ${newHex} 50%, ${mixHex(newHex, 0, 0.3)} 100%)`,
                  }}
                />
                <div>
                  <h4>Yeni Rəng</h4>
                  <span className="palet__add-modal__hex-badge">{newHex}</span>
                </div>
              </div>
              <button className="palet__add-modal__close" onClick={cancelAdd}>
                <FiX />
              </button>
            </div>

            <div className="palet__add-modal__picker-row">
              <input
                type="color"
                className="palet__add-modal__color-input"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
              />
              <div className="palet__add-modal__hex-wrap">
                <span className="palet__add-modal__hex-hash">#</span>
                <input
                  type="text"
                  className="palet__add-modal__hex-field"
                  value={newHex.replace("#", "")}
                  onChange={(e) =>
                    setNewHex("#" + e.target.value.replace("#", "").slice(0, 6))
                  }
                  maxLength={6}
                  placeholder="C8A75E"
                />
              </div>
              <button
                className="palet__add-modal__random"
                onClick={() => setNewHex(randomHex())}
                title="Təsadüfi"
              >
                <FiRefreshCw />
              </button>
            </div>

            <div className="palet__add-modal__name-wrap">
              <label className="palet__add-modal__label">Rəng adı</label>
              <input
                type="text"
                className="palet__add-modal__name-input"
                placeholder="məs. Qızılı, Mavi, Zeytun..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveAdd()}
                autoFocus
              />
            </div>

            <div className="palet__add-modal__previews">
              {["light", "dark"].map((mode) => {
                const g = generateGradients(newHex);
                return (
                  <div key={mode} className="palet__add-modal__preview-item">
                    <div
                      className="palet__add-modal__preview-thumb"
                      style={{ background: g[mode] }}
                    />
                    <span className="palet__add-modal__preview-label">
                      {mode === "light" ? (
                        <>
                          <FiSun /> Light
                        </>
                      ) : (
                        <>
                          <FiMoon /> Dark
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="palet__add-modal__footer">
              <button
                className="palet__btn palet__btn--ghost"
                onClick={cancelAdd}
              >
                Ləğv et
              </button>
              <button
                className="palet__btn palet__btn--primary"
                onClick={saveAdd}
                disabled={!newName.trim()}
              >
                <FiCheck /> Əlavə et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SİLMƏ MODALI ══ */}
      {deleteId && (
        <div
          className="palet__modal-backdrop"
          onClick={() => setDeleteId(null)}
        >
          <div className="palet__modal" onClick={(e) => e.stopPropagation()}>
            <div className="palet__modal-icon">
              <FiTrash2 />
            </div>
            <h4>Silmək istədiyinizdən əminsiniz?</h4>
            <p>
              <strong>{colors.find((c) => c.id === deleteId)?.name}</strong>{" "}
              rəngi silinəcək.
            </p>
            <div className="palet__modal-actions">
              <button
                className="palet__btn palet__btn--ghost"
                onClick={() => setDeleteId(null)}
              >
                Ləğv et
              </button>
              <button
                className="palet__btn palet__btn--danger"
                onClick={doDelete}
              >
                <FiTrash2 /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
