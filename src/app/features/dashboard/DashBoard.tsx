import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Toolbar from "../toolbar/Toolbar";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onItemClick={handleNavigate}
        currentPath={location.pathname}
      />

      <div className="main-content">
        <Toolbar
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <div className="dashboard-content-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
