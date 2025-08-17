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
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Dashboard from "../../../assets/dashboard.svg";
import Student from "../../../assets/Users.svg";
import Users from "../../../assets/student.svg";
import "./Sidebar.css";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onItemClick: (path: string) => void;
  currentPath: string;
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
  currentPath 
}) => {
  const theme = useTheme();
  
  const sidebarItems: SidebarItem[] = [
    { 
      label: "Dashboard", 
      icon: <img src={Dashboard} />,
      path: "/dashboard" 
    },
    // { 
    //   label: "Attendance", 
    //   icon: <AssignmentIcon />, 
    //   path: "/attendance" 
    // },
    { 
      label: "Teachers", 
      icon: <img src={Users} />,
      path: "/teacher" 
    },
    { 
      label: "Parents", 
      icon: <img src={Users} />,
      path: "/parent"
    },
    { 
      label: "Students", 
      icon: <img src={Student} />,
      path: "/student" 
    },
  ];

  const handleClick = (path: string) => {
    onItemClick(path);
  };

  return (
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
  );
};

export default Sidebar;