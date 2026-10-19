import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useAuth } from "../../context/AuthContext";
import { useStudents } from "../student/studentApi/StudentApi";
import { useGetAllTeachers } from "../teacher/teacherApi/TeacherApi";
import StudentAttendance from "../student/studentAttendance/StudentAttendance";
import TeacherAttendance from "../teacher/teacherAttendance/TeacherAttendance";
import "./AttendanceHub.css";

interface AttendanceHubProps {
  defaultTab?: "student" | "teacher";
}

const AttendanceHub: React.FC<AttendanceHubProps> = ({ defaultTab = "student" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;

  // Active tab selection from query params or prop
  const activeTab = (searchParams.get("tab") as "student" | "teacher") || defaultTab;

  const handleTabChange = (tab: "student" | "teacher") => {
    setSearchParams({ tab }, { replace: true });
  };

  // Queries for live metrics in the overview
  const {
    data: students = [],
    refetch: refetchStudents,
    isLoading: isLoadingStudents,
  } = useStudents(organizationId);

  const {
    data: teachers = [],
    refetch: refetchTeachers,
    isLoading: isLoadingTeachers,
  } = useGetAllTeachers(organizationId);

  const handleRefreshAll = () => {
    refetchStudents();
    refetchTeachers();
  };

  // Formatted Date
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Compute Student metrics
  const studentMetrics = useMemo(() => {
    const total = students.length;
    const present = students.filter((s: any) => s.is_present).length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, absent, rate };
  }, [students]);

  // Compute Teacher metrics
  const teacherMetrics = useMemo(() => {
    const total = teachers.length;
    const present = teachers.filter((t: any) => t.is_present).length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, absent, rate };
  }, [teachers]);

  return (
    <div className="attendance-hub-container">
      {/* Header Banner */}
      <Box className="attendance-hub-header">
        <Box>
          <Typography className="attendance-hub-title">
            <EventAvailableIcon sx={{ fontSize: 34 }} />
            Attendance Management Hub
          </Typography>
          <Typography className="attendance-hub-subtitle">
            Record, monitor, and manage daily attendance for students and faculty
          </Typography>
          <Box className="attendance-hub-date-badge" sx={{ mt: 1.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16 }} />
            {todayFormatted}
          </Box>
        </Box>

        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh All Attendance Data">
            <span>
              <IconButton
                onClick={handleRefreshAll}
                disabled={isLoadingStudents || isLoadingTeachers}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)" },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Overview Summary Cards */}
      <div className="attendance-overview-grid">
        <div
          className={`attendance-overview-card ${
            activeTab === "student" ? "active-student" : ""
          }`}
          onClick={() => handleTabChange("student")}
        >
          <div>
            <div className="card-info-title">Student Attendance Rate</div>
            <div className="card-info-rate">{studentMetrics.rate}%</div>
            <div className="card-info-pill">
              <span className="card-pill-present">
                {studentMetrics.present} Present
              </span>
              <span className="card-pill-absent">
                {studentMetrics.absent} Absent
              </span>
              <span style={{ color: "#64748b" }}>
                Total: {studentMetrics.total}
              </span>
            </div>
          </div>
          <div className="card-icon-bubble student">
            <GroupsIcon sx={{ fontSize: 28 }} />
          </div>
        </div>

        <div
          className={`attendance-overview-card ${
            activeTab === "teacher" ? "active-teacher" : ""
          }`}
          onClick={() => handleTabChange("teacher")}
        >
          <div>
            <div className="card-info-title">Teacher Attendance Rate</div>
            <div className="card-info-rate">{teacherMetrics.rate}%</div>
            <div className="card-info-pill">
              <span className="card-pill-present">
                {teacherMetrics.present} Present
              </span>
              <span className="card-pill-absent">
                {teacherMetrics.absent} Absent
              </span>
              <span style={{ color: "#64748b" }}>
                Total: {teacherMetrics.total}
              </span>
            </div>
          </div>
          <div className="card-icon-bubble teacher">
            <SchoolIcon sx={{ fontSize: 28 }} />
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation Control */}
      <div className="attendance-segmented-tabs-container">
        <div className="attendance-segmented-tabs">
          <Button
            className={`attendance-tab-btn tour-student-attendance ${
              activeTab === "student" ? "active" : ""
            }`}
            onClick={() => handleTabChange("student")}
            startIcon={<GroupsIcon />}
          >
            Student Attendance
            <span className="attendance-tab-badge">
              {studentMetrics.total}
            </span>
          </Button>

          <Button
            className={`attendance-tab-btn tour-teacher-attendance ${
              activeTab === "teacher" ? "active" : ""
            }`}
            onClick={() => handleTabChange("teacher")}
            startIcon={<SchoolIcon />}
          >
            Teacher Attendance
            <span className="attendance-tab-badge">
              {teacherMetrics.total}
            </span>
          </Button>
        </div>

        <Box display="flex" alignItems="center" gap={1}>
          <AssignmentIndIcon sx={{ color: "#64748b", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
            {activeTab === "student" ? "Classroom-wise Registry" : "Faculty Register"}
          </Typography>
        </Box>
      </div>

      {/* Active Tab Component Render */}
      <div className="attendance-panel-container" key={activeTab}>
        {activeTab === "student" ? (
          <StudentAttendance />
        ) : (
          <TeacherAttendance />
        )}
      </div>
    </div>
  );
};

export default AttendanceHub;
