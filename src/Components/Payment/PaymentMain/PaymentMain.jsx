import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaSearch,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaMoneyBillWave,
  FaUsers,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";
import "./PaymentMain.scss";

const PACKAGE_OPTIONS = ["Starter", "Basic", "Premium", "Enterprise"];

const INITIAL_PAYMENTS = [
  {
    id: 1,
    userCode: "SYD4568",
    fullName: "Elçin Məmmədov",
    package: "Premium",
    paidAmount: 49,
    monthlyFee: 49,
    lastPaymentDate: "2025-06-01",
  },
  {
    id: 2,
    userCode: "SYD4568",
    fullName: "Elçin Məmmədov",
    package: "Premium",
    paidAmount: 49,
    monthlyFee: 49,
    lastPaymentDate: "2025-07-01",
  },
  {
    id: 3,
    userCode: "SYD1234",
    fullName: "Aytən Həsənova",
    package: "Basic",
    paidAmount: 19,
    monthlyFee: 19,
    lastPaymentDate: "2025-06-15",
  },
];

function getDaysUntilNext(lastPaymentDate) {
  const last = new Date(lastPaymentDate);
  const next = new Date(last);
  next.setMonth(next.getMonth() + 1);
  const today = new Date();
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getNextDate(lastPaymentDate) {
  const d = new Date(lastPaymentDate);
  d.setMonth(d.getMonth() + 1);
  return formatDate(d.toISOString().split("T")[0]);
}

function StatusBadge({ days }) {
  if (days < 0) return <span className="badge badge-overdue">Gecikmiş</span>;
  if (days <= 5) return <span className="badge badge-soon">{days} gün</span>;
  return <span className="badge badge-ok">{days} gün</span>;
}

const emptyForm = {
  userCode: "",
  fullName: "",
  package: "Starter",
  paidAmount: "",
  monthlyFee: "",
  lastPaymentDate: "",
};

export default function PaymentMain() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [nextId, setNextId] = useState(4);
  const [errors, setErrors] = useState({});

  // Group payments by userCode
  const grouped = useMemo(() => {
    const map = {};
    payments.forEach((p) => {
      if (!map[p.userCode]) map[p.userCode] = [];
      map[p.userCode].push(p);
    });
    return map;
  }, [payments]);

  // Filter by search
  const filteredKeys = useMemo(() => {
    const q = search.toLowerCase().trim();
    return Object.keys(grouped).filter((code) => {
      const entries = grouped[code];
      const name = entries[0]?.fullName?.toLowerCase() || "";
      return code.toLowerCase().includes(q) || name.includes(q);
    });
  }, [grouped, search]);

  // Stats
  const totalRevenue = useMemo(
    () => payments.reduce((sum, p) => sum + Number(p.paidAmount), 0),
    [payments],
  );
  const uniqueUsers = Object.keys(grouped).length;
  const overdueCount = useMemo(() => {
    return Object.keys(grouped).filter((code) => {
      const latest = grouped[code].reduce((a, b) =>
        new Date(a.lastPaymentDate) > new Date(b.lastPaymentDate) ? a : b,
      );
      return getDaysUntilNext(latest.lastPaymentDate) < 0;
    }).length;
  }, [grouped]);

  const validate = () => {
    const e = {};
    if (!form.userCode.trim()) e.userCode = "Zəruri";
    if (!form.fullName.trim()) e.fullName = "Zəruri";
    if (!form.paidAmount || isNaN(form.paidAmount))
      e.paidAmount = "Rəqəm daxil edin";
    if (!form.monthlyFee || isNaN(form.monthlyFee))
      e.monthlyFee = "Rəqəm daxil edin";
    if (!form.lastPaymentDate) e.lastPaymentDate = "Zəruri";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const newPayment = {
      id: nextId,
      userCode: form.userCode.trim().toUpperCase(),
      fullName: form.fullName.trim(),
      package: form.package,
      paidAmount: Number(form.paidAmount),
      monthlyFee: Number(form.monthlyFee),
      lastPaymentDate: form.lastPaymentDate,
    };
    setPayments((prev) => [...prev, newPayment]);
    setNextId((n) => n + 1);
    setForm(emptyForm);
    setErrors({});
    // Auto-expand the newly added user
    setExpandedUsers((prev) => ({
      ...prev,
      [newPayment.userCode]: true,
    }));
  };

  const handleDelete = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleExpand = (code) => {
    setExpandedUsers((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  return (
    <div className="payment-main">
      {/* HEADER */}
      <div className="pm-header">
        <div className="pm-header__left">
          <h2 className="pm-title">Ödəniş İdarəetməsi</h2>
          <span className="pm-subtitle">
            Bütün ödənişlər əl ilə idarə olunur
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="pm-stats">
        <div className="pm-stat-card">
          <div className="pm-stat-card__icon green">
            <FaMoneyBillWave />
          </div>
          <div>
            <div className="pm-stat-card__val">{totalRevenue} ₼</div>
            <div className="pm-stat-card__label">Ümumi Gəlir</div>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-card__icon blue">
            <FaUsers />
          </div>
          <div>
            <div className="pm-stat-card__val">{uniqueUsers}</div>
            <div className="pm-stat-card__label">Unikal İstifadəçi</div>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-card__icon gold">
            <FaCalendarCheck />
          </div>
          <div>
            <div className="pm-stat-card__val">{payments.length}</div>
            <div className="pm-stat-card__label">Ümumi Ödəniş</div>
          </div>
        </div>
        <div className="pm-stat-card">
          <div className="pm-stat-card__icon red">
            <FaClock />
          </div>
          <div>
            <div className="pm-stat-card__val">{overdueCount}</div>
            <div className="pm-stat-card__label">Gecikmiş</div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="pm-card pm-form-card">
        <div className="pm-form-card__title">
          <FaPlus /> Yeni Ödəniş Əlavə Et
        </div>
        <div className="pm-form-grid">
          <div className={`pm-field ${errors.userCode ? "has-error" : ""}`}>
            <label>User Code</label>
            <input
              type="text"
              name="userCode"
              placeholder="SYD0000"
              value={form.userCode}
              onChange={handleFormChange}
            />
            {errors.userCode && (
              <span className="pm-error">{errors.userCode}</span>
            )}
          </div>
          <div className={`pm-field ${errors.fullName ? "has-error" : ""}`}>
            <label>Ad Soyad</label>
            <input
              type="text"
              name="fullName"
              placeholder="İstifadəçi adı"
              value={form.fullName}
              onChange={handleFormChange}
            />
            {errors.fullName && (
              <span className="pm-error">{errors.fullName}</span>
            )}
          </div>
          <div className="pm-field">
            <label>Paket Növü</label>
            <select
              name="package"
              value={form.package}
              onChange={handleFormChange}
            >
              {PACKAGE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className={`pm-field ${errors.paidAmount ? "has-error" : ""}`}>
            <label>Edilən Ödəniş (₼)</label>
            <input
              type="number"
              name="paidAmount"
              placeholder="0.00"
              value={form.paidAmount}
              onChange={handleFormChange}
            />
            {errors.paidAmount && (
              <span className="pm-error">{errors.paidAmount}</span>
            )}
          </div>
          <div className={`pm-field ${errors.monthlyFee ? "has-error" : ""}`}>
            <label>Aylıq Ödəniş (₼)</label>
            <input
              type="number"
              name="monthlyFee"
              placeholder="0.00"
              value={form.monthlyFee}
              onChange={handleFormChange}
            />
            {errors.monthlyFee && (
              <span className="pm-error">{errors.monthlyFee}</span>
            )}
          </div>
          <div
            className={`pm-field ${errors.lastPaymentDate ? "has-error" : ""}`}
          >
            <label>Son Ödəniş Tarixi</label>
            <input
              type="date"
              name="lastPaymentDate"
              value={form.lastPaymentDate}
              onChange={handleFormChange}
            />
            {errors.lastPaymentDate && (
              <span className="pm-error">{errors.lastPaymentDate}</span>
            )}
          </div>
        </div>
        <button className="pm-add-btn" onClick={handleAdd}>
          <FaPlus /> Ödəniş Əlavə Et
        </button>
      </div>

      {/* SEARCH */}
      <div className="pm-search-row">
        <div className="pm-search-box">
          <FaSearch className="pm-search-icon" />
          <input
            type="text"
            placeholder="User code və ya ad ilə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="pm-count">{filteredKeys.length} istifadəçi</span>
      </div>

      {/* LIST */}
      <div className="pm-list">
        {filteredKeys.length === 0 && (
          <div className="pm-empty">Heç bir nəticə tapılmadı</div>
        )}
        {filteredKeys.map((code) => {
          const entries = grouped[code];
          const isExpanded = expandedUsers[code];
          const latest = entries.reduce((a, b) =>
            new Date(a.lastPaymentDate) > new Date(b.lastPaymentDate) ? a : b,
          );
          const daysLeft = getDaysUntilNext(latest.lastPaymentDate);
          const totalPaid = entries.reduce((s, e) => s + e.paidAmount, 0);

          return (
            <div className="pm-user-block" key={code}>
              {/* USER ROW (HEADER) */}
              <div
                className={`pm-user-row ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleExpand(code)}
              >
                <div className="pm-user-row__left">
                  <div className="pm-avatar">
                    {entries[0].fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="pm-user-row__info">
                    <span className="pm-user-name">{entries[0].fullName}</span>
                    <span className="pm-user-code">{code}</span>
                  </div>
                </div>

                <div className="pm-user-row__meta">
                  <div className="pm-meta-item">
                    <span className="pm-meta-label">Paket</span>
                    <span
                      className={`pm-pkg pkg-${latest.package.toLowerCase()}`}
                    >
                      {latest.package}
                    </span>
                  </div>
                  <div className="pm-meta-item">
                    <span className="pm-meta-label">Aylıq</span>
                    <span className="pm-meta-val">{latest.monthlyFee} ₼</span>
                  </div>
                  <div className="pm-meta-item">
                    <span className="pm-meta-label">Cəmi Ödəniş</span>
                    <span className="pm-meta-val gold">{totalPaid} ₼</span>
                  </div>
                  <div className="pm-meta-item">
                    <span className="pm-meta-label">Növbəti Ödəniş</span>
                    <StatusBadge days={daysLeft} />
                  </div>
                  <div className="pm-meta-item">
                    <span className="pm-meta-label">Ödəniş Sayı</span>
                    <span className="pm-count-badge">{entries.length}</span>
                  </div>
                </div>

                <div className="pm-chevron">
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* EXPANDED: PAYMENT HISTORY */}
              {isExpanded && (
                <div className="pm-history">
                  <div className="pm-history-header">
                    <span>№</span>
                    <span>Paket</span>
                    <span>Edilən Ödəniş</span>
                    <span>Aylıq Ödəniş</span>
                    <span>Son Ödəniş</span>
                    <span>Növbəti Ödəniş</span>
                    <span>Qalan Müddət</span>
                    <span></span>
                  </div>
                  {entries
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.lastPaymentDate) -
                        new Date(a.lastPaymentDate),
                    )
                    .map((entry, idx) => {
                      const days = getDaysUntilNext(entry.lastPaymentDate);
                      return (
                        <div className="pm-history-row" key={entry.id}>
                          <span className="pm-history-idx">{idx + 1}</span>
                          <span
                            className={`pm-pkg pkg-${entry.package.toLowerCase()}`}
                          >
                            {entry.package}
                          </span>
                          <span className="pm-paid">{entry.paidAmount} ₼</span>
                          <span className="pm-monthly">
                            {entry.monthlyFee} ₼
                          </span>
                          <span className="pm-date">
                            {formatDate(entry.lastPaymentDate)}
                          </span>
                          <span className="pm-next-date">
                            {getNextDate(entry.lastPaymentDate)}
                          </span>
                          <span>
                            <StatusBadge days={days} />
                          </span>
                          <button
                            className="pm-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry.id);
                            }}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
