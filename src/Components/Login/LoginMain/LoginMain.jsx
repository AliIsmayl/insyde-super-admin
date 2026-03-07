import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./LoginMain.scss";

function LoginMain() {
  const navigate = useNavigate();

  // Input states
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Giriş Funksiyası
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "superadmin" && password === "12345") {
      setErrorMsg("");

      // İstifadəçinin daxil olduğunu lokal yaddaşa (localStorage) yazırıq
      localStorage.setItem("isAuthenticated", "true");

      // Ana səhifəyə yönləndiririk
      navigate("/analys");
    } else {
      setErrorMsg("E-poçt və ya şifrə yanlışdır!");
    }
  };

  return (
    <div className="login-main-modern">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-text">Insyde</div>
          <h2>superadmin xoş gəlmisən 👋</h2>
          <p>Davam etmək üçün idarəetmə panelinə daxil olun.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {errorMsg && <div className="message error-msg">{errorMsg}</div>}

          <div className="input-group">
            <label>İstifadəçi adı və ya E-poçt</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="text"
                placeholder="superadmin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Şifrə</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Daxil ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginMain;
