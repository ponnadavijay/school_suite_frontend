import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import "./Toolbar.css";

interface ToolbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: `calc(100% - ${sidebarOpen ? 240 : 80}px)`,
        ml: `${sidebarOpen ? 240 : 80}px`,
        zIndex: "1100",
        boxShadow: "none",
      }}
    >
      <MuiToolbar className="toolbar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
           onClick={onToggleSidebar}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <div>
          Tech Patashala
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <div className="profile-container">
          <div
            ref={profileButtonRef}
            onClick={handleProfileClick}
            className="profile-button"
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Avatar className="profile-avatar">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className="profile-menu"
            PaperProps={{
              className: "profile-menu-paper"
            }}
          >
            <MenuItem className="profile-menu-header">
              <Box display="flex" alignItems="center">
                <Avatar className="profile-menu-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box ml={2}>
                  <Typography variant="subtitle1" className="profile-menu-email">
                    {user?.email || 'User'}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider className="profile-menu-divider" />
            <MenuItem onClick={handleLogout} className="profile-menu-item">
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </div>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;