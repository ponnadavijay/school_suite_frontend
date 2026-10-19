import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import Roles from "./roles/Roles";
import Permissions from "./permissions/Permissions";
import Tenants from "./tenants/Tenants";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const AdminHub: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Top Navigation Bar */}
      <Paper
        elevation={0}
        sx={{
          px: 3,
          pt: 2.5,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2A1989 0%, #4338ca 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(42, 25, 137, 0.25)",
            }}
          >
            <DashboardCustomizeIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e1b4b" }}>
              School Administration Console
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Comprehensive control center for Tenants, Roles, and Permission matrices
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: 48,
              px: 2.5,
              gap: 1,
            },
            "& .Mui-selected": {
              color: "var(--primary-purple-600) !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--primary-purple-600)",
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="School Tenants" />
          <Tab icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" label="Roles Management" />
          <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Permissions & Access" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <CustomTabPanel value={tabIndex} index={0}>
        <Tenants />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <Roles />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        <Permissions />
      </CustomTabPanel>
    </Box>
  );
};

export default AdminHub;
