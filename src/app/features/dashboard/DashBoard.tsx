import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import Toolbar from "../toolbar/Toolbar";

const drawerWidthOpen = 240;
const drawerWidthClosed = 80;

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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar
        isOpen={sidebarOpen}
        onItemClick={handleNavigate}
        currentPath={location.pathname}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;