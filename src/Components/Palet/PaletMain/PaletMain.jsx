import React, { useState, useRef } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiUpload,
  FiSun,
  FiMoon,
  FiCheck,
} from "react-icons/fi";
import "./PaletMain.scss";

const initialColors = [
  { id: 1, name: "Qızılı", hex: "#C8A75E", lightImage: null, darkImage: null },
  { id: 2, name: "Mavi", hex: "#2980B9", lightImage: null, darkImage: null },
  { id: 3, name: "Yaşıl", hex: "#27AE60", lightImage: null, darkImage: null },
  {
    id: 4,
    name: "Bənövşəyi",
    hex: "#8E44AD",
    lightImage: null,
    darkImage: null,
  },
];

const toBase64 = (file) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.readAsDataURL(file);
  });

function ImageUploader({ label, icon, value, onChange, onRemove }) {
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    onChange(b64);
    e.target.value = "";
  };

  return (
    <div className="palet__uploader">
      <div className="palet__uploader-label">
        {icon}
        <span>{label}</span>
      </div>

      {value ? (
        <div className="palet__uploader-preview">
          <img src={value} alt={label} />
          <div className="palet__uploader-actions">
            <button
              className="palet__uploader-action palet__uploader-action--change"
              onClick={() => inputRef.current.click()}
            >
              <FiEdit2 /> Dəyişdir
            </button>
            <button
              className="palet__uploader-action palet__uploader-action--remove"
              onClick={onRemove}
            >
              <FiTrash2 /> Sil
            </button>
          </div>
        </div>
      ) : (
        <div
          className="palet__uploader-empty"
          onClick={() => inputRef.current.click()}
        >
          <FiUpload />
          <span>Şəkil yüklə</span>
          <small>PNG, JPG, SVG, WEBP</small>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}

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

  const handleImage = (id, mode, val) =>
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [mode]: val } : c)),
    );

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

  const startAdd = () => {
    setAddMode(true);
    setNewName("");
    setNewHex("#000000");
    setEditingId(null);
  };

  const cancelAdd = () => setAddMode(false);

  const saveAdd = () => {
    if (!newName.trim()) return;
    const id = Date.now();
    setColors((prev) => [
      ...prev,
      { id, name: newName, hex: newHex, lightImage: null, darkImage: null },
    ]);
    setSelectedId(id);
    setAddMode(false);
  };

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

  return (
    <div className="palet">
      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div className="palet__header">
        <div>
          <h2 className="palet__title">Rəng Palitраları</h2>
          <p className="palet__sub">
            Hər rəng üçün light və dark mode şəkillərini idarə edin.
          </p>
        </div>
        <button className="palet__add-btn" onClick={startAdd}>
          <FiPlus /> Yeni Rəng
        </button>
      </div>

      {/* ══ LAYOUT ═════════════════════════════════════════ */}
      <div className="palet__layout">
        {/* ── SOL SİDEBAR ─────────────────────────────────── */}
        <div className="palet__sidebar">
          <div className="palet__sidebar-title">Rənglər</div>

          {addMode && (
            <div className="palet__add-form">
              <div className="palet__add-form-row">
                <input
                  type="color"
                  className="palet__color-picker-mini"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                />
                <input
                  type="text"
                  className="palet__add-name-input"
                  placeholder="Rəng adı..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveAdd()}
                  autoFocus
                />
              </div>
              <input
                type="text"
                className="palet__add-hex-input"
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                maxLength={7}
                placeholder="#000000"
              />
              <div className="palet__add-form-actions">
                <button
                  className="palet__btn palet__btn--ghost"
                  onClick={cancelAdd}
                >
                  <FiX />
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
          )}

          <div className="palet__list">
            {colors.map((color) => (
              <div
                key={color.id}
                className={`palet__list-item ${selectedId === color.id ? "palet__list-item--active" : ""}`}
                onClick={() => {
                  setSelectedId(color.id);
                  setEditingId(null);
                  setAddMode(false);
                }}
              >
                <div
                  className="palet__list-swatch"
                  style={{ background: color.hex }}
                />
                <div className="palet__list-info">
                  <span className="palet__list-name">{color.name}</span>
                  <span className="palet__list-hex">{color.hex}</span>
                </div>
                <div className="palet__list-images">
                  <span
                    className={`palet__list-img-dot ${color.lightImage ? "palet__list-img-dot--filled" : ""}`}
                    title="Light Mode"
                  >
                    <FiSun />
                  </span>
                  <span
                    className={`palet__list-img-dot ${color.darkImage ? "palet__list-img-dot--filled" : ""}`}
                    title="Dark Mode"
                  >
                    <FiMoon />
                  </span>
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
            ))}

            {colors.length === 0 && (
              <div className="palet__list-empty">Hələ rəng yoxdur.</div>
            )}
          </div>
        </div>

        {/* ── SAĞ DETAL ───────────────────────────────────── */}
        <div className="palet__detail">
          {selected ? (
            <div className="palet__card">
              {/* Kart başlığı */}
              <div className="palet__card-header">
                <div className="palet__card-title-row">
                  <div
                    className="palet__card-swatch"
                    style={{
                      background:
                        editingId === selected.id ? editHex : selected.hex,
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

              {/* Şəkillər */}
              <div className="palet__images-section">
                <div className="palet__images-title">
                  Bu rəng üçün görünüş şəkilləri
                </div>
                <div className="palet__images-grid">
                  <ImageUploader
                    label="Light Mode"
                    icon={<FiSun />}
                    value={selected.lightImage}
                    onChange={(val) =>
                      handleImage(selected.id, "lightImage", val)
                    }
                    onRemove={() =>
                      handleImage(selected.id, "lightImage", null)
                    }
                  />
                  <ImageUploader
                    label="Dark Mode"
                    icon={<FiMoon />}
                    value={selected.darkImage}
                    onChange={(val) =>
                      handleImage(selected.id, "darkImage", val)
                    }
                    onRemove={() => handleImage(selected.id, "darkImage", null)}
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

      {/* ══ SİLMƏ MODALI ══════════════════════════════════ */}
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
              rəngi və ona aid şəkillər silinəcək.
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
