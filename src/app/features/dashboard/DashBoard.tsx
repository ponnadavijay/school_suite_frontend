import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClassIcon from "@mui/icons-material/Class";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useStudents } from "../student/studentApi/StudentApi";
import { useParents } from "../parent/parentApi/parentApi";
import { useGetAllTeachers } from "../teacher/teacherApi/TeacherApi";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    teachersTotal: 0,
    teachersPresent: 0,
    teachersAbsent: 0,
    studentsTotal: 0,
    studentsPresent: 0,
    studentsAbsent: 0,
    parents: 0,
  });

  const [classSectionWise, setClassSectionWise] = useState<
    {
      classId: number;
      className: string;
      section: string;
      total: number;
      present: number;
      absent: number;
    }[]
  >([]);

  // Track expanded selections
  const [expandedClass, setExpandedClass] = useState<number | null>(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("1-A");

  const { data: students, refetch: refetchStudents } = useStudents(organizationId);
  const { data: parents, refetch: refetchParents } = useParents();
  const { data: teachers, refetch: refetchTeachers } = useGetAllTeachers();

  const handleRefreshAll = () => {
    refetchStudents();
    refetchParents();
    refetchTeachers();
  };

  // Formatted Date & Day
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  useEffect(() => {
    const defaults: {
      classId: number;
      className: string;
      section: string;
      total: number;
      present: number;
      absent: number;
    }[] = [];

    for (let classNo = 1; classNo <= 10; classNo++) {
      ["A", "B", "C", "D"].forEach((section) => {
        defaults.push({
          classId: classNo,
          className: `Class ${classNo}`,
          section,
          total: 0,
          present: 0,
          absent: 0,
        });
      });
    }

    const grouped: Record<string, any> = {};

    if (Array.isArray(students)) {
      const total = students.length;
      const present = students.filter((s: any) => s.is_present).length;
      const absent = total - present;

      students.forEach((s: any) => {
        if (!s || !s.class_room) return;
        const classNo = s.class_room.class_no || "Unassigned";
        const section = s.class_room.section || "A";
        const key = `${classNo}-${section}`;
        if (!grouped[key]) {
          grouped[key] = {
            classId: classNo,
            className: `Class ${classNo}`,
            section: section,
            total: 0,
            present: 0,
            absent: 0,
          };
        }
        grouped[key].total += 1;
        if (s.is_present) grouped[key].present += 1;
        else grouped[key].absent += 1;
      });

      setCounts((prev) => ({
        ...prev,
        studentsTotal: total,
        studentsPresent: present,
        studentsAbsent: absent,
        parents: Array.isArray(parents) ? parents.length : 0,
      }));
    }

    if (Array.isArray(teachers)) {
      const total = teachers.length;
      const present = teachers.filter((t: any) => t.is_present).length;
      const absent = total - present;

      setCounts((prev) => ({
        ...prev,
        teachersTotal: total,
        teachersPresent: present,
        teachersAbsent: absent,
      }));
    }

    const merged = defaults.map((def) => {
      const key = `${def.classId}-${def.section}`;
      return grouped[key] ? grouped[key] : def;
    });

    setClassSectionWise(merged);
  }, [students, teachers, parents]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const classList = Array.from({ length: 10 }, (_, i) => ({
    classId: i + 1,
    className: `${getOrdinal(i + 1)} Class`,
  }));

  // Selected Class & Section attendance object
  const currentSectionData = useMemo(() => {
    if (!expandedSection) return null;
    return classSectionWise.find(
      (c) => `${c.classId}-${c.section}` === expandedSection
    );
  }, [classSectionWise, expandedSection]);

  const studentAttendanceRate = counts.studentsTotal > 0
    ? Math.round((counts.studentsPresent / counts.studentsTotal) * 100)
    : 100;

  const teacherAttendanceRate = counts.teachersTotal > 0
    ? Math.round((counts.teachersPresent / counts.teachersTotal) * 100)
    : 100;

  return (
    <div className="dashboard-container">
      {/* Dashboard Premium Header Banner */}
      <Box className="page-header-banner" sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" className="page-header-title">
            <SchoolIcon sx={{ fontSize: 36 }} />
            {user?.organization?.org_name || "Tech Patashala"} Command Center
          </Typography>
          <Typography className="page-header-subtitle">
            Welcome back, {user?.first_name || user?.username || "Principal"}! Here is today's real-time academic & attendance overview.
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.8,
              py: 0.6,
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#ffffff",
              mt: 1.2,
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 16 }} />
            {todayFormatted}
          </Box>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh Dashboard Stats">
            <IconButton
              onClick={handleRefreshAll}
              className="page-header-icon-btn"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => navigate("/student")}
            className="page-header-primary-btn"
            endIcon={<ArrowForwardIcon fontSize="small" />}
          >
            Manage Students
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Section */}
      <Box className="dashboard-section-header">
        <Typography className="dashboard-section-title">
          Key Operational Metrics
        </Typography>
        <Chip
          label="Live Real-Time Data"
          size="small"
          sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 600, fontSize: "0.75rem" }}
        />
      </Box>

      <div className="dashboard-kpi-grid">
        {[
          {
            title: "Total Teachers",
            count: counts.teachersTotal,
            icon: <SchoolIcon />,
            themeClass: "theme-purple-icon",
            footerText: `${teacherAttendanceRate}% Teacher Attendance`,
            path: "/teacher",
          },
          {
            title: "Present Teachers",
            count: counts.teachersPresent,
            icon: <CheckCircleIcon />,
            themeClass: "theme-green-icon",
            footerText: "On duty today",
            path: "/teacher",
          },
          {
            title: "Absent Teachers",
            count: counts.teachersAbsent,
            icon: <CancelIcon />,
            themeClass: "theme-red-icon",
            footerText: counts.teachersAbsent === 0 ? "Perfect attendance" : "On leave",
            path: "/teacher",
          },
          {
            title: "Total Students",
            count: counts.studentsTotal,
            icon: <PeopleIcon />,
            themeClass: "theme-blue-icon",
            footerText: `${studentAttendanceRate}% Student Attendance`,
            path: "/student",
          },
          {
            title: "Present Students",
            count: counts.studentsPresent,
            icon: <CheckCircleIcon />,
            themeClass: "theme-green-icon",
            footerText: "In classrooms",
            path: "/student",
          },
          {
            title: "Absent Students",
            count: counts.studentsAbsent,
            icon: <CancelIcon />,
            themeClass: "theme-red-icon",
            footerText: "Absent today",
            path: "/student",
          },
          {
            title: "Total Parents",
            count: counts.parents,
            icon: <FamilyRestroomIcon />,
            themeClass: "theme-purple-icon",
            footerText: "Registered contacts",
            path: "/parent",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="dashboard-kpi-card"
            onClick={() => handleCardClick(card.path)}
          >
            <div>
              <div className="kpi-card-header">
                <span className="kpi-title">{card.title}</span>
                <div className={`kpi-icon-box ${card.themeClass}`}>
                  {card.icon}
                </div>
              </div>
              <div className="kpi-count">{card.count}</div>
            </div>
            <div className="kpi-footer">
              <span>{card.footerText}</span>
              <ArrowForwardIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Class & Section-wise Attendance Section */}
      <Box className="attendance-panel">
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1 }}>
              <ClassIcon sx={{ color: "var(--primary-purple-600)" }} />
              Class & Section-wise Attendance Breakdown
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select standard class and section to inspect detailed attendance ratios
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("/student/attandance")}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          >
            Open Attendance Register
          </Button>
        </Box>

        {/* Class Selection Pills */}
        <div className="class-pill-scroll">
          {classList.map((cls) => {
            const isActive = expandedClass === cls.classId;
            return (
              <Button
                key={cls.classId}
                variant={isActive ? "contained" : "outlined"}
                onClick={() => {
                  setExpandedClass(cls.classId);
                  setExpandedSection(`${cls.classId}-A`);
                }}
                className={`class-pill-btn ${isActive ? "active" : ""}`}
              >
                {cls.className}
              </Button>
            );
          })}
        </div>

        {/* Section Tabs */}
        {expandedClass && (
          <Box mt={2}>
            <div className="section-pill-container">
              {["A", "B", "C", "D"].map((sec) => {
                const key = `${expandedClass}-${sec}`;
                const isActive = expandedSection === key;
                return (
                  <Button
                    key={key}
                    variant={isActive ? "contained" : "outlined"}
                    onClick={() => setExpandedSection(key)}
                    className={`section-pill-btn ${isActive ? "active" : ""}`}
                  >
                    Section {sec}
                  </Button>
                );
              })}
            </div>

            {/* Attendance Analytics for Selected Section */}
            {currentSectionData && (
              <Box sx={{ p: 2.5, bgcolor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Attendance for Class {currentSectionData.classId} - Section {currentSectionData.section}
                  </Typography>
                  {currentSectionData.total > 0 && (
                    <Chip
                      label={`${Math.round((currentSectionData.present / currentSectionData.total) * 100)}% Present`}
                      size="small"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#059669",
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                {/* Progress Bar */}
                {currentSectionData.total > 0 && (
                  <Box mb={2}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round((currentSectionData.present / currentSectionData.total) * 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#fee2e2",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#10b981",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                )}

                <div className="section-summary-cards">
                  <div className="section-stat-card">
                    <div>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        TOTAL ENROLLED
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#1e293b">
                        {currentSectionData.total}
                      </Typography>
                    </div>
                    <PeopleIcon sx={{ color: "var(--primary-purple-600)", fontSize: 28 }} />
                  </div>

                  <div className="section-stat-card">
                    <div>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        PRESENT
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#059669">
                        {currentSectionData.present}
                      </Typography>
                    </div>
                    <CheckCircleIcon sx={{ color: "#059669", fontSize: 28 }} />
                  </div>

                  <div className="section-stat-card">
                    <div>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        ABSENT
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#dc2626">
                        {currentSectionData.absent}
                      </Typography>
                    </div>
                    <CancelIcon sx={{ color: "#dc2626", fontSize: 28 }} />
                  </div>
                </div>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
