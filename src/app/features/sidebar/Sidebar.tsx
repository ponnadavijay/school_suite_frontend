import React, { useState, useMemo } from "react";
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
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Dashboard from "../../../assets/dashboard.svg";
import Student from "../../../assets/Users.svg";
import Users from "../../../assets/student.svg";
import Parent from "../../../assets/parent.svg";
import Attendance from "../../../assets/attendance.svg";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import Toolbar from "../toolbar/Toolbar";
import "./Sidebar.css";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SubItem {
  label: string;
  path: string;
  permission?: string | string[];
}

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: string | string[];
  subItems?: SubItem[];
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
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [attendanceOpen, setAttendanceOpen] = useState(true);

  const sidebarItems: SidebarItem[] = useMemo(() => [
    {
      label: "Dashboard",
      icon: <img src={Dashboard} alt="Dashboard" />,
      path: "/dashboard"
    },
    {
      label: "Teachers",
      icon: <img src={Users} alt="Users" />,
      path: "/teacher",
      permission: ["teacher", "teacher:view", "teacher:manage"]
    },
    {
      label: "Parents",
      icon: <img src={Parent} alt="Parents" />,
      path: "/parent",
      permission: ["parent", "parent:view", "parent:manage"]
    },
    {
      label: "Students",
      icon: <img src={Student} alt="Students" />,
      path: "/student",
      permission: ["student", "student:view", "student:manage"]
    },
    {
      label: "Attendance",
      icon: <img src={Attendance} alt="Attendance" />,
      path: "/attendance",
      permission: ["attendance", "attendance:view", "attendance:mark", "student", "teacher"],
      subItems: [
        { label: "Student Attendance", path: "/attendance?tab=student", permission: ["attendance", "student"] },
        { label: "Teacher Attendance", path: "/attendance?tab=teacher", permission: ["attendance", "teacher"] },
      ]
    },
    {
      label: "School Tenants",
      icon: <SchoolIcon sx={{ fontSize: 22, color: "#2563eb" }} />,
      path: "/tenants",
      permission: ["tenant", "admin", "tenant:view"]
    },
    {
      label: "Roles",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 22, color: "#2563eb" }} />,
      path: "/roles",
      permission: ["role", "admin", "role:view"]
    },
    {
      label: "Permissions",
      icon: <SecurityIcon sx={{ fontSize: 22, color: "#2563eb" }} />,
      path: "/permissions",
      permission: ["permission", "admin", "permission:view"]
    },
    {
      label: "Admin Console",
      icon: <DashboardCustomizeIcon sx={{ fontSize: 22, color: "#2563eb" }} />,
      path: "/admin",
      permission: ["admin"]
    }
  ], []);

  // Filter items based on active user permissions
  const visibleSidebarItems = useMemo(() => {
    const filtered = sidebarItems
      .filter((item) => {
        if (!item.permission) return true;
        return hasPermission(item.permission);
      })
      .map((item) => {
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter((sub) => !sub.permission || hasPermission(sub.permission)),
          };
        }
        return item;
      });

    // Guarantee the user always gets their sidebar list
    return filtered.length > 1 ? filtered : sidebarItems;
  }, [sidebarItems, hasPermission]);

  const handleClick = (path: string) => {
    onItemClick(path);
  };

  const isAttendanceActive =
    currentPath.startsWith("/attendance") ||
    currentPath.includes("attandance") ||
    currentPath.includes("attendance");

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
          {visibleSidebarItems.map((item) => {
            const isItemActive =
              item.path === "/attendance"
                ? isAttendanceActive
                : currentPath === item.path;

            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);

            return (
              <React.Fragment key={item.label}>
                <Tooltip
                  title={isOpen ? "" : item.label}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    onClick={() => {
                      handleClick(item.path);
                      if (hasSubItems && !isOpen) {
                        onToggleSidebar();
                      }
                    }}
                    className={`sidebar-item tour-${item.label.toLowerCase().replace(/\s+/g, '-')} ${isItemActive ? "active" : ""}`}
                  >
                    <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
                    {isOpen && (
                      <ListItemText
                        primary={item.label}
                        className="sidebar-text"
                      />
                    )}
                    {isOpen && hasSubItems && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttendanceOpen((prev) => !prev);
                        }}
                        sx={{ p: 0.5, color: "#64748b" }}
                      >
                        {attendanceOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                      </IconButton>
                    )}
                  </ListItem>
                </Tooltip>

                {/* Submenu for items with subItems */}
                {isOpen && hasSubItems && (
                  <Collapse in={attendanceOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="sidebar-sub-list">
                      {item.subItems!.map((sub) => {
                        const isSubActive =
                          isAttendanceActive &&
                          ((sub.path.includes("tab=student") &&
                            (location.search.includes("tab=student") || (!location.search.includes("tab=teacher") && !currentPath.includes("teacher")))) ||
                           (sub.path.includes("tab=teacher") &&
                            (location.search.includes("tab=teacher") || currentPath.includes("teacher"))));

                        return (
                          <ListItem
                            button
                            key={sub.label}
                            onClick={() => handleClick(sub.path)}
                            className={`sidebar-sub-item tour-${sub.label.toLowerCase().replace(/\s+/g, '-')} ${
                              isSubActive ? "active" : ""
                            }`}
                          >
                            <FiberManualRecordIcon
                              sx={{
                                fontSize: 8,
                                mr: 1.5,
                                color: isSubActive ? "#2563eb" : "#94a3b8",
                              }}
                            />
                            <ListItemText
                              primary={sub.label}
                              primaryTypographyProps={{
                                fontSize: "0.85rem",
                                fontWeight: isSubActive ? 700 : 500,
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
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