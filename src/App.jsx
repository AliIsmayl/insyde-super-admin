import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import ApplicationsPage from "./Pages/ApplicationsPage";
import SettingPage from "./Pages/SettingPage";
import PackagePage from "./Pages/PackagePage";
import AnalysPage from "./Pages/AnalysPage";
import LoginPage from "./Pages/LoginPage";
import UsersPage from "./Pages/UsersPage";
import PaletsPage from "./Pages/PaletsPage";
import ArchivePage from "./Pages/ArchivePage";
import CategoryPage from "./Pages/CategoryPage";
import ScrollToTop from "./Components/ScroolToTop";
import "./App.css";

const PrivateRoutes = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    localStorage.setItem("theme", savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/analys" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/analys" element={<AnalysPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/palets" element={<PaletsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/packages" element={<PackagePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/categorys" element={<CategoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
