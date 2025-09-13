import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import {
  useGetAllTeachers,
  useBulkUpdateTeacherAttendance,
} from "../teacherApi/TeacherApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TeacherAttendance.css";

interface TeacherAttendanceState {
  [key: number]: boolean;
}

const TeacherAttendance: React.FC = () => {
  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;

  const { data: teachers, isLoading, isError, refetch } =
    useGetAllTeachers(organizationId);

  const bulkUpdateMutation = useBulkUpdateTeacherAttendance();

  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [attendanceState, setAttendanceState] =
    useState<TeacherAttendanceState>({});

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (teachers) {
      const initialState: TeacherAttendanceState = {};
      teachers.forEach(
        (teacher: { teacher_id: string | number; is_present: boolean }) => {
          initialState[teacher.teacher_id] = teacher.is_present ?? true;
        }
      );
      setAttendanceState(initialState);
    }
  }, [teachers]);

  const handleAttendanceToggle = (teacherId: number, isPresent: boolean) => {
    setAttendanceState((prev) => ({
      ...prev,
      [teacherId]: isPresent,
    }));
  };

  const presentCount = Object.values(attendanceState).filter(
    (status) => status
  ).length;
  const absentCount = Object.values(attendanceState).filter(
    (status) => !status
  ).length;

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmit = () => {
    if (!teachers) return;

    const attendanceUpdates = Object.entries(attendanceState).map(
      ([teacherId, isPresent]) => ({
        teacher_id: parseInt(teacherId),
        is_present: isPresent,
      })
    );

    bulkUpdateMutation.mutate(
      { attendance_updates: attendanceUpdates },
      {
        onSuccess: () => {
          toast.success("Attendance updated successfully!");
          refetch();
          setConfirmOpen(false);
        },
        onError: (err: any) => {
          toast.error(`Failed to update attendance: ${err.message}`);
          setConfirmOpen(false);
        },
      }
    );
  };

  const filteredTeachers =
    teachers?.filter((teacher: { teacher_id: string | number }) => {
      if (attendanceFilter === "all") return true;
      if (attendanceFilter === "present")
        return attendanceState[teacher.teacher_id];
      if (attendanceFilter === "absent")
        return !attendanceState[teacher.teacher_id];
      return true;
    }) || [];

  return (
    <div className="attendance-container">
      <div className="teacher-attendance-header">
        <div className="teacher-attendance-title">Teacher Attendance</div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenConfirm}
          disabled={bulkUpdateMutation.isLoading}
        >
          {bulkUpdateMutation.isLoading ? "Updating..." : "Submit Attendance"}
        </Button>
      </div>

      <div>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
          >
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
          >
            <Typography variant="h6">
              Session expired, please relogin!
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && (
          <>
            <div className="attendance-summary">
              <div className="attendance-summary-count">
                {attendanceFilter === "all" && "All Teachers"}
                {attendanceFilter === "present" && "Present Teachers"}
                {attendanceFilter === "absent" && "Absent Teachers"}
                {filteredTeachers.length > 0 &&
                  ` (${filteredTeachers.length})`}
              </div>
              {teachers && teachers.length > 0 && (
                <div className="summary-stats">
                  <span className="total">Total: {teachers.length}</span>
                  <span className="present">Present: {presentCount}</span>
                  <span className="absent">Absent: {absentCount}</span>
                </div>
              )}
            </div>

            {filteredTeachers.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Teacher ID</TableCell>
                      <TableCell>Teacher Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile Number</TableCell>
                      <TableCell>Class Incharge</TableCell>
                      <TableCell>Attendance Status</TableCell>
                      <TableCell>Attendance Marking</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.teacher_id}>
                        <TableCell>{teacher.teacher_id}</TableCell>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.mobile_no || "N/A"}</TableCell>
                        <TableCell>
                          {teacher.class_incharge
                            ? `Class ${teacher.class_incharge.class_no} - Section ${teacher.class_incharge.class_section}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              attendanceState[teacher.teacher_id] ? (
                                <CheckCircleIcon />
                              ) : (
                                <CancelIcon />
                              )
                            }
                            label={
                              attendanceState[teacher.teacher_id]
                                ? "Present"
                                : "Absent"
                            }
                            color={
                              attendanceState[teacher.teacher_id]
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
                                  attendanceState[teacher.teacher_id] || false
                                }
                                onChange={(e) =>
                                  handleAttendanceToggle(
                                    teacher.teacher_id,
                                    e.target.checked
                                  )
                                }
                                color="primary"
                                disabled={bulkUpdateMutation.isLoading}
                              />
                            }
                            label={
                              attendanceState[teacher.teacher_id]
                                ? "Present"
                                : "Absent"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Card>
                <CardContent>
                  <div className="no-teachers-text">
                    {attendanceFilter === "all"
                      ? "No teachers found."
                      : `No ${attendanceFilter} teachers found.`}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Attendance Submission</DialogTitle>
        <div className="custom-dialog-content">
          <div>Are you sure you want to submit Teacher Attendance?</div>
          <div className="custom-dialog-stats">
            <div>Present: {presentCount}</div>
            <div>Absent: {absentCount}</div>
            <div>Total Teachers: {teachers?.length || 0}</div>
          </div>
        </div>
        <DialogActions> <Button onClick={handleCloseConfirm} variant="outlined"> Cancel </Button> <Button onClick={handleConfirmSubmit} color="primary" variant="contained" disabled={bulkUpdateMutation.isLoading} > {bulkUpdateMutation.isLoading ? "Submitting..." : "Confirm"} </Button> </DialogActions>
      </Dialog>

    </div>
  );
};

export default TeacherAttendance;
