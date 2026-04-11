import React, { useState } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import {
  FiPlus,
  FiTrash2,
  FiTag,
  FiAlertTriangle,
  FiCheck,
  FiEdit2,
  FiX,
  FiSave,
} from "react-icons/fi";
import "./CategoryMain.scss";
import Popup from "../../Popup/Popup";

// ── Bütün ikon kitabxanalarını birləşdir ─────────────────────────
const ALL_ICONS = {
  ...FiIcons,
  ...FaIcons,
  ...BiIcons,
  ...MdIcons,
  ...AiIcons,
};

function resolveIcon(iconCode) {
  if (!iconCode || !iconCode.trim()) return null;
  return ALL_ICONS[iconCode.trim()] || null;
}

const CATEGORY_TYPES = [
  { value: "əlaqə", label: "Əlaqə" },
  { value: "əlavə", label: "Əlavə" },
  { value: "sosial", label: "Sosial" },
];

const initialCategories = [
  { id: 1, name: "İnstagram", iconCode: "FaInstagram", type: "sosial" },
  { id: 2, name: "Facebook", iconCode: "FaFacebook", type: "sosial" },
  { id: 3, name: "LinkedIn", iconCode: "FaLinkedin", type: "əlaqə" },
];

export default function CategoryMain() {
  const [categories, setCategories] = useState(initialCategories);

  // ── Form state ──────────────────────────────────────────────────
  const [iconCode, setIconCode] = useState("");
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("əlaqə");
  const [confirmed, setConfirmed] = useState(false);

  // ── Düzəliş state ───────────────────────────────────────────────
  const [editId, setEditId] = useState(null);
  const [editIconCode, setEditIconCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("əlaqə");
  const [editConfirmed, setEditConfirmed] = useState(false);

  // ── Popup state ─────────────────────────────────────────────────
  const [popup, setPopup] = useState({ isOpen: false });
  const closePopup = () => setPopup((p) => ({ ...p, isOpen: false }));
  const openPopup = (cfg) => setPopup({ isOpen: true, ...cfg });

  // ── Yeni form ───────────────────────────────────────────────────
  const PreviewIcon = resolveIcon(iconCode);
  const previewValid = !!PreviewIcon;

  const handleConfirmPreview = () => {
    if (previewValid) setConfirmed(true);
  };

  const handleIconCodeChange = (val) => {
    setIconCode(val);
    setConfirmed(false);
  };

  const doAdd = () => {
    if (!catName.trim() || !confirmed || !previewValid) return;
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: catName.trim(),
        iconCode: iconCode.trim(),
        type: catType,
      },
    ]);
    setIconCode("");
    setCatName("");
    setCatType("əlaqə");
    setConfirmed(false);
  };

  const handleAdd = () => {
    if (!catName.trim() || !confirmed || !previewValid) return;
    openPopup({
      type: "success",
      title: "Kateqoriya əlavə edilsin?",
      message: `"${catName.trim()}" adlı yeni kateqoriya siyahıya əlavə ediləcək.`,
      confirmText: "Əlavə Et",
      onConfirm: doAdd,
    });
  };

  // ── Düzəliş ─────────────────────────────────────────────────────
  const EditPreviewIcon = resolveIcon(editIconCode);
  const editPreviewValid = !!EditPreviewIcon;

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditIconCode(cat.iconCode);
    setEditName(cat.name);
    setEditType(cat.type || "əlaqə");
    setEditConfirmed(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditIconCode("");
    setEditName("");
    setEditType("əlaqə");
    setEditConfirmed(false);
  };

  const doSaveEdit = () => {
    if (!editName.trim() || !editConfirmed || !editPreviewValid) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editId
          ? {
              ...c,
              name: editName.trim(),
              iconCode: editIconCode.trim(),
              type: editType,
            }
          : c,
      ),
    );
    cancelEdit();
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editConfirmed || !editPreviewValid) return;
    openPopup({
      type: "update",
      title: "Dəyişikliklər saxlanılsın?",
      message: `"${editName.trim()}" kateqoriyası yenilənəcək.`,
      confirmText: "Yenilə",
      onConfirm: doSaveEdit,
    });
  };

  // ── Silmə ───────────────────────────────────────────────────────
  const handleDeleteClick = (cat) => {
    openPopup({
      type: "delete",
      title: "Silmək istədiyinizdən əminsiniz?",
      message: `"${cat.name}" kateqoriyası silinəcək. Bu əməliyyat geri alına bilməz.`,
      confirmText: "Sil",
      onConfirm: () => {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      },
    });
  };

  return (
    <div className="cat">
      {/* ── Popup ── */}
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

      {/* ══ HEADER ══════════════════════════════════════════════════ */}
      <div className="cat__header">
        <div>
          <h2 className="cat__title">Kateqoriyalar</h2>
          <p className="cat__sub">
            Platforma kateqoriyalarını idarə edin. React ikon kodu daxil edib
            önizləmə ilə təsdiqləyin.
          </p>
        </div>
        <div className="cat__stat">
          <FiTag />
          <span>{categories.length} kateqoriya</span>
        </div>
      </div>

      {/* ══ LAYOUT ═════════════════════════════════════════════════ */}
      <div className="cat__layout">
        {/* ── SOL: Yeni kateqoriya forması ─────────────────────── */}
        <div className="cat__form-card">
          <div className="cat__form-title">
            <FiPlus /> Yeni Kateqoriya
          </div>

          <div className="cat__field">
            <label>İkon Kodu</label>
            <input
              type="text"
              className="cat__input"
              placeholder="məs: FaInstagram, FiStar, MdHome..."
              value={iconCode}
              onChange={(e) => handleIconCodeChange(e.target.value)}
            />
          </div>

          <div className="cat__field">
            <label>Kateqoriya Adı</label>
            <input
              type="text"
              className="cat__input"
              placeholder="məs: Instagram, Xidmətlər..."
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>

          <div className="cat__field">
            <label>Növ</label>
            <select
              className="cat__select"
              value={catType}
              onChange={(e) => setCatType(e.target.value)}
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="cat__preview-row">
            <span className="cat__preview-label">Önizləmə:</span>
            {iconCode.trim() === "" ? (
              <span className="cat__preview-hint">İkon kodu daxil edin</span>
            ) : previewValid ? (
              <div className="cat__preview-box cat__preview-box--valid">
                <div className="cat__preview-icon">
                  <PreviewIcon />
                </div>
                <span className="cat__preview-name">{catName || "—"}</span>
                {!confirmed ? (
                  <button
                    className="cat__confirm-btn"
                    onClick={handleConfirmPreview}
                  >
                    <FiCheck /> Təsdiqlə
                  </button>
                ) : (
                  <span className="cat__confirmed-badge">
                    <FiCheck /> Təsdiqləndi
                  </span>
                )}
              </div>
            ) : (
              <div className="cat__preview-box cat__preview-box--invalid">
                <FiAlertTriangle />
                <span>İkon tapılmadı — kodu yoxlayın</span>
              </div>
            )}
          </div>

          <button
            className="cat__add-btn"
            onClick={handleAdd}
            disabled={!catName.trim() || !confirmed || !previewValid}
          >
            <FiPlus /> Əlavə Et
          </button>
        </div>

        {/* ── SAĞ: Kateqoriya siyahısı ─────────────────────────── */}
        <div className="cat__list-card">
          <div className="cat__list-header">
            Mövcud Kateqoriyalar
            <span className="cat__list-count">{categories.length}</span>
          </div>

          {categories.length === 0 && (
            <div className="cat__empty">
              <FiTag />
              <p>Hələ kateqoriya yoxdur.</p>
            </div>
          )}

          <div className="cat__list">
            {categories.map((cat) => {
              const CatIcon = resolveIcon(cat.iconCode);
              const isEditing = editId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`cat__item ${isEditing ? "cat__item--editing" : ""}`}
                >
                  {isEditing ? (
                    /* ── Düzəliş rejimi ── */
                    <div className="cat__edit-row">
                      <div className="cat__edit-fields">
                        <input
                          type="text"
                          className="cat__input cat__input--sm"
                          placeholder="İkon kodu..."
                          value={editIconCode}
                          onChange={(e) => {
                            setEditIconCode(e.target.value);
                            setEditConfirmed(false);
                          }}
                        />
                        <input
                          type="text"
                          className="cat__input cat__input--sm"
                          placeholder="Ad..."
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <select
                          className="cat__select cat__select--sm"
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                        >
                          {CATEGORY_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <div className="cat__edit-preview">
                          {editPreviewValid ? (
                            <>
                              <div className="cat__icon-box">
                                <EditPreviewIcon />
                              </div>
                              {!editConfirmed ? (
                                <button
                                  className="cat__confirm-btn cat__confirm-btn--sm"
                                  onClick={() => setEditConfirmed(true)}
                                >
                                  <FiCheck />
                                </button>
                              ) : (
                                <span className="cat__confirmed-badge cat__confirmed-badge--sm">
                                  <FiCheck />
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="cat__preview-hint">
                              <FiAlertTriangle /> Tapılmadı
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="cat__edit-actions">
                        <button
                          className="cat__icon-btn cat__icon-btn--save"
                          onClick={handleSaveEdit}
                          disabled={
                            !editName.trim() ||
                            !editConfirmed ||
                            !editPreviewValid
                          }
                          title="Saxla"
                        >
                          <FiSave />
                        </button>
                        <button
                          className="cat__icon-btn cat__icon-btn--cancel"
                          onClick={cancelEdit}
                          title="Ləğv"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal görünüş ── */
                    <>
                      <div className="cat__item-left">
                        <div className="cat__icon-box">
                          {CatIcon ? <CatIcon /> : <FiTag />}
                        </div>
                        <div className="cat__item-info">
                          <span className="cat__item-name">{cat.name}</span>
                          <span className="cat__item-code">{cat.iconCode}</span>
                          <span
                            className={`cat__type-badge cat__type-badge--${(cat.type || "əlaqə").replace(/ə/g, "e")}`}
                          >
                            {cat.type || "əlaqə"}
                          </span>
                        </div>
                      </div>
                      <div className="cat__item-actions">
                        <button
                          className="cat__icon-btn cat__icon-btn--edit"
                          onClick={() => startEdit(cat)}
                          title="Düzəliş et"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="cat__icon-btn cat__icon-btn--del"
                          onClick={() => handleDeleteClick(cat)}
                          title="Sil"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
