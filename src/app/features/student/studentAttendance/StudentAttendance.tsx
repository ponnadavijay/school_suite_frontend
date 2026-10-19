import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../../../context/AuthContext";
import {
  useStudents,
  useClassrooms,
  useBulkUpdateAttendance,
} from "../studentApi/StudentApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StudentAttendance.css";

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;
  const roleId = user?.role?.role_id;

  const {
    data: students,
    isLoading,
    isError,
    refetch: refetchStudents,
  } = useStudents(organizationId);

  const { data: classrooms } = useClassrooms(organizationId);
  const bulkUpdateMutation = useBulkUpdateAttendance();

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const classroomsList = Array.isArray(classrooms) 
    ? classrooms 
    : classrooms?.data || classrooms?.items || [];

  const classNumbers = Array.from(
    new Set(classroomsList?.map((cls: any) => cls.class_no) || [])
  ).sort();

  const sections =
    classroomsList
      ?.filter((cls: any) => cls.class_no === selectedClass)
      .map((cls: any) => cls.section)
      .sort() || [];

  useEffect(() => {
    if (selectedClass && selectedSection && students) {
      let filtered = students.filter((student) => {
        return (
          student.class_room?.class_no === selectedClass &&
          student.class_room?.section === selectedSection
        );
      });

      const initialAttendance: Record<string, string> = {};
      filtered.forEach((s) => {
        initialAttendance[s.admission_no] = "Present";
      });
      setAttendanceMap(initialAttendance);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
      setAttendanceMap({});
    }
  }, [selectedClass, selectedSection, students]);

  const handleAttendanceToggle = (admission_no: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [admission_no]: prev[admission_no] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmitAttendance = () => {
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);

    const payload = filteredStudents.map((student) => ({
      admission_no: student.admission_no,
      name: student.name,
      parent: student.parent?.parent_id,
      class_room: student.class_room?.class_id || 0,
      role: roleId,
      organization: organizationId,
      present_status: attendanceMap[student.admission_no],
    }));

    bulkUpdateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Attendance submitted successfully!");
        refetchStudents();
      },
      onError: (error: any) => {
        toast.error(`Failed to submit attendance: ${error.message}`);
      },
    });
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const presentCount = Object.values(attendanceMap).filter(
    (s) => s === "Present"
  ).length;
  const absentCount = Object.values(attendanceMap).filter(
    (s) => s === "Absent"
  ).length;
  const totalCount = filteredStudents.length;

  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="student-attendance-container">
      {/* Header Banner */}
      <Box className="page-header-banner" sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" className="page-header-title">
            <EventAvailableIcon sx={{ fontSize: 36 }} />
            Student Daily Attendance Register
          </Typography>
          <Typography className="page-header-subtitle">
            Mark and record real-time classroom attendance for enrolled students
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
          <Tooltip title="Refresh Student List">
            <IconButton
              onClick={() => refetchStudents()}
              disabled={isLoading}
              className="page-header-icon-btn"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {selectedClass && selectedSection && (
            <Button
              variant="contained"
              onClick={handleSubmitAttendance}
              disabled={bulkUpdateMutation.isLoading}
              className="page-header-primary-btn"
            >
              {bulkUpdateMutation.isLoading ? "Submitting..." : "Submit Attendance"}
            </Button>
          )}
        </Box>
      </Box>

      <div>
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography variant="h6">Session expired, please relogin!</Typography>
          </Box>
        )}
      </div>
      {!isLoading && !isError && (
        <>
          <div className="attendance-section">
            <div className="attendance-section-title">Classes</div>
            <div className="btn-group">
              {classNumbers.map((classNo) => (
                <Button
                  key={classNo}
                  variant={selectedClass === classNo ? "contained" : "outlined"}
                  onClick={() => {
                    setSelectedClass(classNo);
                    setSelectedSection(null);
                  }}
                >
                  {getOrdinal(classNo)} Class
                </Button>
              ))}
            </div>
          </div>

          {selectedClass && (
            <div className="attendance-section">
              <div className="attendance-section-title">Sections</div>
              <div className="btn-group">
                {sections.map((section) => (
                  <Button
                    key={section}
                    variant={selectedSection === section ? "contained" : "outlined"}
                    onClick={() => setSelectedSection(section)}
                  >
                    Section {section}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedClass && selectedSection && (
            <div className="attendance-section">
              <div className="student-attendance-summary-header">
                <div className="attendance-section-title">
                  Students in Class {selectedClass} - Section {selectedSection}
                </div>
                  <div className="summary-stats">
                  <span className="total">Total: {totalCount}</span>
                  <span className="present">Present: {presentCount}</span>
                  <span className="absent">Absent: {absentCount}</span>
                </div>
              </div>
              {filteredStudents.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Admission No</TableCell>
                          <TableCell>Student Name</TableCell>
                          <TableCell>Parent Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Mark Attendance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.admission_no}>
                            <TableCell>{student.admission_no}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.parent?.name || "N/A"}</TableCell>
                            <TableCell>
                              <Chip
                                icon={
                                  attendanceMap[student.admission_no] === "Present" ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <CancelIcon />
                                  )
                                }
                                label={attendanceMap[student.admission_no]}
                                color={
                                  attendanceMap[student.admission_no] === "Present"
                                    ? "success"
                                    : "error"
                                }
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      attendanceMap[student.admission_no] === "Present"
                                    }
                                    onChange={() =>
                                      handleAttendanceToggle(student.admission_no)
                                    }
                                    color="primary"
                                  />
                                }
                                label={attendanceMap[student.admission_no]}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Card>
                  <CardContent>
                    <div className="no-students-text">
                      No students found in this class and section.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Attendance Submission</DialogTitle>
        <div className="custom-dialog-content">
          <div>
            Are you sure you want to submit attendance for Class {selectedClass} -{" "}
            Section {selectedSection}?
          </div>
          <div className="custom-dialog-stats">
            <div>Total: {totalCount}</div>
            <div>Present: {presentCount}</div>
            <div>Absent: {absentCount}</div>
          </div>
        </div>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentAttendance;
