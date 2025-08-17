import React, { useState, useRef } from "react";
import {
  Toolbar as MuiToolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext";
import "./Toolbar.css";

const Toolbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
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
    <MuiToolbar className="toolbar">
      <IconButton
        edge="start"
        color="inherit"
        onClick={onToggleSidebar}
      >
        <MenuIcon />
      </IconButton>
      <div className="toolbar-header-and-btn">
        <div className="toolbar-title">
          Tech Patashala
        </div>
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
      </div>
    </MuiToolbar>
  );
};

export default Toolbar;