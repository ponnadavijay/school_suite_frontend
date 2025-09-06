import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Box,
  styled,
  useTheme,
} from "@mui/material";
import Dashboard from "../../../assets/dashboard.svg";
import Student from "../../../assets/Users.svg";
import Users from "../../../assets/student.svg";
import Parent from "../../../assets/parent.svg";
import Toolbar from "../toolbar/Toolbar";
import "./Sidebar.css";
import { Outlet } from "react-router-dom";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onItemClick: (path: string) => void;
  currentPath: string;
  onToggleSidebar: () => void;
}

const drawerWidthOpen = 240;
const drawerWidthClosed = 80;

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onItemClick,
  currentPath,
  onToggleSidebar
}) => {
  const theme = useTheme();

  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      icon: <img src={Dashboard} alt="Dashboard" />,
      path: "/dashboard"
    },
    {
      label: "Teachers",
      icon: <img src={Users} alt="Teachers" />,
      path: "/teacher"
    },
    {
      label: "Parents",
      icon: <img src={Parent} alt="Parents" />,
      path: "/parent"
    },
    {
      label: "Students",
      icon: <img src={Student} alt="Students" />,
      path: "/student"
    },
  ];

  const handleClick = (path: string) => {
    onItemClick(path);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          whiteSpace: "nowrap",
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          "& .MuiDrawer-paper": {
            width: isOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        <SidebarHeader>
          {isOpen ? (
            <Box display="flex" alignItems="center" ml={1}>
              <div className="toolbar-title" >
                Tech Patashala
              </div>
            </Box>
          ) : null}
        </SidebarHeader>

        <Divider />

        <List className="sidebar-list">
          {sidebarItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Tooltip
                key={item.label}
                title={isOpen ? "" : item.label}
                placement="right"
                arrow
              >
                <ListItem
                  button
                  onClick={() => handleClick(item.path)}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                >
                  <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary={item.label}
                      className="sidebar-text"
                    />
                  )}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>

      <div
        className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          marginLeft: isOpen ? drawerWidthOpen : drawerWidthClosed,
          width: `calc(100% - ${isOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          height: '100vh',
        }}
      >
        <div className="toolbar-container">
          <Toolbar
            sidebarOpen={isOpen}
            onToggleSidebar={onToggleSidebar}
          />
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;