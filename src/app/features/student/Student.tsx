import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  IconButton,
  TextField,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClassIcon from "@mui/icons-material/Class";
import { useAuth } from "../../context/AuthContext";
import CreateStudent from "./createStudent/CreateStudent";
import {
  useDeleteStudent,
  useStudents,
  useRegisterStudent,
  useUpdateStudent,
  useAssignParent,
  useAssignClass,
  useClassrooms,
  useCreateClassroom,
} from "./studentApi/StudentApi";
import { useParents } from "../parent/parentApi/parentApi";
import { useTeachers } from "../teacher/teacherApi/TeacherApi";
import PermissionGate from "../../shared/PermissionGate";
import "./Student.css";
import { toast } from "react-toastify";

const Student: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClassId, setSelectedClassId] = useState<string | number | "">("");

  // Assign Class Dialog State
  const [assignClassOpen, setAssignClassOpen] = useState(false);
  const [selectedStudentForClass, setSelectedStudentForClass] = useState<any>(null);
  const [targetClassId, setTargetClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Assign Parent Dialog State
  const [assignParentOpen, setAssignParentOpen] = useState(false);
  const [selectedStudentForParent, setSelectedStudentForParent] = useState<any>(null);
  const [targetParentId, setTargetParentId] = useState("");
  const [relation, setRelation] = useState("Father");

  // Create Class Dialog State
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const [newClassNo, setNewClassNo] = useState<number | "">("");
  const [newSection, setNewSection] = useState("");
  const [newClassTeacherId, setNewClassTeacherId] = useState("");

  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;

  const { data: students = [], isLoading, isError, refetch, isFetching } = useStudents(organizationId);
  const { data: rawClassrooms = [] } = useClassrooms();
  const { data: rawParents = [] } = useParents();
  const { data: rawTeachers = [] } = useTeachers();

  // Safely normalize classrooms
  const safeClassrooms = useMemo(() => {
    if (Array.isArray(rawClassrooms)) return rawClassrooms;
    if (rawClassrooms && Array.isArray((rawClassrooms as any).data)) return (rawClassrooms as any).data;
    if (rawClassrooms && Array.isArray((rawClassrooms as any).classes)) return (rawClassrooms as any).classes;
    return [];
  }, [rawClassrooms]);

  // Safely normalize parents
  const safeParents = useMemo(() => {
    if (Array.isArray(rawParents)) return rawParents;
    if (rawParents && Array.isArray((rawParents as any).data)) return (rawParents as any).data;
    return [];
  }, [rawParents]);

  // Safely normalize teachers
  const safeTeachers = useMemo(() => {
    if (Array.isArray(rawTeachers)) return rawTeachers;
    if (rawTeachers && Array.isArray((rawTeachers as any).data)) return (rawTeachers as any).data;
    if (rawTeachers && Array.isArray((rawTeachers as any).results)) return (rawTeachers as any).results;
    return [];
  }, [rawTeachers]);

  const { mutateAsync: registerStudent, isPending: isRegistering } = useRegisterStudent();
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent(organizationId);
  const { mutate: deleteStudent } = useDeleteStudent(organizationId);
  const assignParentMutation = useAssignParent();
  const assignClassMutation = useAssignClass();
  const createClassMutation = useCreateClassroom();

  const handleOpenDrawer = () => {
    setEditStudent(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  const handleEditClick = (student: any) => {
    setEditStudent(student);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (admission_no: string | number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(admission_no as number, {
        onSuccess: () => {
          toast.success("Student deleted successfully ✅");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to delete student ❌");
        },
      });
    }
  };

  // Open Assign Class Dialog
  const handleOpenAssignClass = (student: any) => {
    setSelectedStudentForClass(student);
    setTargetClassId(student.class_room?.id || student.class_room?.class_id || "");
    setAssignClassOpen(true);
  };

  const handleCloseAssignClass = () => {
    setAssignClassOpen(false);
    setSelectedStudentForClass(null);
    setTargetClassId("");
  };

  const handleConfirmAssignClass = async () => {
    if (!selectedStudentForClass || !targetClassId) {
      toast.error("Please select a classroom to assign.");
      return;
    }
    const studentId = selectedStudentForClass.u_id || selectedStudentForClass.id || selectedStudentForClass.admission_no;
    try {
      await assignClassMutation.mutateAsync({
        student_id: String(studentId),
        class_id: String(targetClassId),
        year: academicYear || "2026-2027",
      });
      toast.success("Student assigned to classroom successfully! 🎓");
      refetch();
      handleCloseAssignClass();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || "Failed to assign class.";
      toast.error(`Assignment failed: ${msg} ❌`);
    }
  };

  // Open Assign Parent Dialog
  const handleOpenAssignParent = (student: any) => {
    setSelectedStudentForParent(student);
    setTargetParentId(student.parent?.id || student.parent?.parent_id || student.parent?.u_id || "");
    setAssignParentOpen(true);
  };

  const handleCloseAssignParent = () => {
    setAssignParentOpen(false);
    setSelectedStudentForParent(null);
    setTargetParentId("");
  };

  const handleConfirmAssignParent = async () => {
    if (!selectedStudentForParent || !targetParentId) {
      toast.error("Please select a parent to assign.");
      return;
    }
    const studentId = selectedStudentForParent.u_id || selectedStudentForParent.id || selectedStudentForParent.admission_no;

    if (String(studentId) === String(targetParentId)) {
      toast.error("A student cannot be assigned as their own parent. Please select a registered parent.");
      return;
    }

    try {
      await assignParentMutation.mutateAsync({
        student_id: String(studentId),
        parent_id: String(targetParentId),
        relation,
      });
      toast.success("Parent linked to student successfully! 👨‍👩‍👧");
      refetch();
      handleCloseAssignParent();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.detail || err?.response?.data?.message || "Failed to assign parent.";
      if (status === 403) {
        toast.error(`Access Forbidden: Only [admin, teacher, class_teacher] roles can link parents. (${msg}) 🚫`);
      } else {
        toast.error(`Parent link failed: ${msg} ❌`);
      }
    }
  };

  // Create Class Dialog Handlers
  const handleOpenCreateClass = () => {
    setNewClassNo("");
    setNewSection("");
    setNewClassTeacherId("");
    setCreateClassOpen(true);
  };

  const handleCloseCreateClass = () => {
    setCreateClassOpen(false);
  };

  const handleConfirmCreateClass = async () => {
    if (newClassNo === "" || !newSection.trim() || !newClassTeacherId) {
      toast.error("Please fill in Class Number, Section, and select a Class Teacher.");
      return;
    }

    try {
      await createClassMutation.mutateAsync({
        class_no: Number(newClassNo),
        section: newSection.trim().toUpperCase(),
        class_teacher_id: String(newClassTeacherId),
      });
      toast.success(`Class ${newClassNo} - Section ${newSection.trim().toUpperCase()} created successfully! 🏫`);
      handleCloseCreateClass();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || "Failed to create class.";
      toast.error(`Class creation failed: ${msg} ❌`);
    }
  };

  const handleSubmit = async (formData: any) => {
    const payload = {
      name: formData.name,
      parent: formData.parent ? String(formData.parent) : null,
      class_room: formData.class_room ? String(formData.class_room) : null,
      organization: organizationId ? Number(organizationId) : null,
      role: user?.role?.role_id ? Number(user.role.role_id) : null,
    };

    try {
      if (editStudent) {
        await updateStudent({
          admission_no: editStudent.admission_no || editStudent.u_id,
          ...payload,
        });
        toast.success("Student updated successfully ✅");
      } else {
        const res: any = await registerStudent(payload);
        toast.success("Student registered successfully ✅");
        const studentId = res?.u_id || res?.admission_no;
        if (studentId && formData.parent) {
          try {
            await assignParentMutation.mutateAsync({
              student_id: String(studentId),
              parent_id: String(formData.parent),
              relation: "Guardian",
            });
          } catch {}
        }
        if (studentId && formData.class_room) {
          try {
            await assignClassMutation.mutateAsync({
              student_id: String(studentId),
              class_id: String(formData.class_room),
              year: "2026-2027",
            });
          } catch {}
        }
      }
      refetch();
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
  };

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    let list = [...students];
    if (selectedClassId !== "") {
      list = list.filter(
        (student) =>
          String(student.class_room?.class_id) === String(selectedClassId)
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((student) => {
        const name = (student.name || `${student.first_name || ""} ${student.last_name || ""}`).toLowerCase();
        const id = String(student.admission_no || student.u_id || "").toLowerCase();
        const email = (student.email || "").toLowerCase();
        const contact = (student.contact || "").toLowerCase();
        const parentName = (student.parent?.name || "").toLowerCase();
        return (
          name.includes(q) ||
          id.includes(q) ||
          email.includes(q) ||
          contact.includes(q) ||
          parentName.includes(q)
        );
      });
    }
    return list;
  }, [students, searchQuery, selectedClassId]);

  const paginatedStudents = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  return (
    <Box className="student-page">
      {/* Header Banner with Premium Gradient */}
      <Box className="page-header-banner">
        <Box>
          <Typography variant="h4" className="page-header-title">
            <SchoolIcon sx={{ fontSize: 34 }} />
            Student Management
          </Typography>
          <Typography className="page-header-subtitle">
            View student directory, assign classrooms, and link parent contacts
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh Student List">
            <span>
              <IconButton
                onClick={() => refetch()}
                disabled={isFetching}
                className="page-header-icon-btn"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <PermissionGate permission={["class:create", "class", "admin"]}>
            <Button
              variant="outlined"
              startIcon={<ClassIcon />}
              onClick={handleOpenCreateClass}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.4)",
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Create Class
            </Button>
          </PermissionGate>
          <PermissionGate permission={["student:create", "student", "admin"]}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDrawer}
              className="page-header-primary-btn"
            >
              Register Student
            </Button>
          </PermissionGate>
        </Box>
      </Box>

      {/* Filters Toolbar */}
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        flexWrap="wrap"
        mb={3}
        p={2}
        bgcolor="#ffffff"
        borderRadius={3}
        boxShadow="0 2px 8px rgba(0,0,0,0.04)"
      >
        <TextField
          size="small"
          placeholder="Search by student name, ID, email, or contact..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 280 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="class-filter-label">Filter by Class</InputLabel>
          <Select
            labelId="class-filter-label"
            label="Filter by Class"
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All Classes</MenuItem>
            {safeClassrooms.map((cls: any) => {
              const cid = cls.id || cls.class_id;
              return (
                <MenuItem key={cid} value={cid}>
                  Class {cls.class_no} - Section {cls.section}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ ml: "auto", color: "#64748b" }}>
          Showing {filteredStudents.length} of {students.length} students
        </Typography>
      </Box>

      {/* Table Content */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={8}>
            <CircularProgress sx={{ color: "var(--primary-purple-600)" }} />
          </Box>
        ) : isError ? (
          <Box display="flex" flexDirection="column" alignItems="center" p={6}>
            <Typography variant="h6" color="error">
              Failed to load students. Please verify login authentication.
            </Typography>
            <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 1.5 }}>
              Retry
            </Button>
          </Box>
        ) : filteredStudents.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>ID / UUID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Contact / Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Class & Section</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Parent / Guardian</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStudents.map((student: any) => {
                    const studentId = student.u_id || student.admission_no;
                    const displayName =
                      student.name ||
                      `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
                      "Student";

                    return (
                      <TableRow key={String(studentId)} hover>
                        <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                          #{String(studentId).substring(0, 8)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                          {displayName}
                        </TableCell>
                        <TableCell sx={{ color: "#475569", fontSize: "0.85rem" }}>
                          <div>{student.email || "No email"}</div>
                          <div style={{ color: "#64748b" }}>{student.contact || student.whatsapp || "No phone"}</div>
                        </TableCell>
                        <TableCell>
                          {student.class_room ? (
                            <Chip
                              label={`Class ${student.class_room.class_no || ""} - ${student.class_room.section || ""}`}
                              size="small"
                              sx={{ bgcolor: "#ede9fe", color: "var(--primary-purple-600)", fontWeight: 600 }}
                            />
                          ) : (
                            <PermissionGate permission={["class:assign", "student:edit", "student", "admin"]} fallback={<span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Unassigned</span>}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<SchoolIcon fontSize="small" />}
                                onClick={() => handleOpenAssignClass(student)}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "8px" }}
                              >
                                Assign Class
                              </Button>
                            </PermissionGate>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.parent ? (
                            <Chip
                              label={`${student.parent.name || "Linked Parent"} (${student.parent.relation || "Parent"})`}
                              size="small"
                              sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 600 }}
                            />
                          ) : (
                            <PermissionGate permission={["student:assign_parent", "parent", "student", "admin"]} fallback={<span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Unlinked</span>}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                startIcon={<FamilyRestroomIcon fontSize="small" />}
                                onClick={() => handleOpenAssignParent(student)}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "8px" }}
                              >
                                Link Parent
                              </Button>
                            </PermissionGate>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={0.5}>
                            <PermissionGate permission={["class:assign", "student:edit", "student", "admin"]}>
                              <Tooltip title="Assign Class">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenAssignClass(student)}
                                  >
                                    <SchoolIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate permission={["student:assign_parent", "parent", "student", "admin"]}>
                              <Tooltip title="Assign Parent">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleOpenAssignParent(student)}
                                  >
                                    <FamilyRestroomIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate permission={["student:edit", "student", "admin"]}>
                              <Tooltip title="Edit Student">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() => handleEditClick(student)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate permission={["student:delete", "student", "admin"]}>
                              <Tooltip title="Delete Student">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(student.admission_no || student.u_id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </PermissionGate>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredStudents.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" p={6}>
            <Typography variant="body1" color="textSecondary">
              No students found. Use "Register Student" to add student records.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* RIGHT DRAWER for Student Create & Edit (Opposite side from sidebar) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        disableRestoreFocus
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 460 },
            maxWidth: "100vw",
            boxShadow: "-4px 0 24px rgba(42, 25, 137, 0.18)",
            borderLeft: "1px solid rgba(42, 25, 137, 0.12)",
          },
        }}
      >
        <CreateStudent
          onClose={handleCloseDrawer}
          onSubmit={handleSubmit}
          studentData={editStudent}
          isLoading={isRegistering || isUpdating}
        />
      </Drawer>

      {/* Assign Class Dialog: POST /api/v1/student/assign_class */}
      <Dialog
        open={assignClassOpen}
        onClose={handleCloseAssignClass}
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: "14px", minWidth: { xs: "90%", sm: 420 }, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--primary-purple-600)" }}>
          Assign Classroom
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Assigning student:{" "}
              <strong>
                {selectedStudentForClass?.name ||
                  `${selectedStudentForClass?.first_name || ""} ${selectedStudentForClass?.last_name || ""}`}
              </strong>
            </Typography>

            <FormControl fullWidth required size="small">
              <InputLabel id="assign-class-select-label">Classroom</InputLabel>
              <Select
                labelId="assign-class-select-label"
                label="Classroom"
                value={targetClassId}
                onChange={(e) => setTargetClassId(String(e.target.value))}
              >
                {safeClassrooms.map((cls: any) => {
                  const cid = cls.id || cls.class_id;
                  return (
                    <MenuItem key={cid} value={cid}>
                      Class {cls.class_no} - Section {cls.section}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              size="small"
              fullWidth
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-2027"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignClass} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAssignClass}
            variant="contained"
            disabled={assignClassMutation.isPending}
            sx={{
              backgroundColor: "var(--primary-purple-600)",
              "&:hover": { backgroundColor: "var(--primary-purple-700)" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {assignClassMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Confirm Class Assignment"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Parent Dialog: POST /api/v1/student/assign_parent */}
      <Dialog
        open={assignParentOpen}
        onClose={handleCloseAssignParent}
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: "14px", minWidth: { xs: "90%", sm: 420 }, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--primary-purple-600)" }}>
          Link Parent to Student
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Linking student:{" "}
              <strong>
                {selectedStudentForParent?.name ||
                  `${selectedStudentForParent?.first_name || ""} ${selectedStudentForParent?.last_name || ""}`}
              </strong>
            </Typography>

            <FormControl fullWidth required size="small">
              <InputLabel id="assign-parent-select-label">Select Parent</InputLabel>
              <Select
                labelId="assign-parent-select-label"
                label="Select Parent"
                value={targetParentId}
                onChange={(e) => setTargetParentId(String(e.target.value))}
              >
                {safeParents
                  .filter((p: any) => {
                    const pid = String(p.id || p.parent_id || p.u_id || "");
                    const sid = String(selectedStudentForParent?.u_id || selectedStudentForParent?.id || selectedStudentForParent?.admission_no || "");
                    return pid !== "" && pid !== sid;
                  })
                  .map((p: any) => {
                    const pid = p.id || p.parent_id || p.u_id;
                    return (
                      <MenuItem key={pid} value={pid}>
                        {p.name || `${p.first_name || ""} ${p.last_name || ""}`} ({p.email || p.contact || "Parent"})
                      </MenuItem>
                    );
                  })}
                {safeParents.length === 0 && (
                  <MenuItem disabled value="">
                    No registered parents found. Please add parents in Parent Management.
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="relation-select-label">Relationship</InputLabel>
              <Select
                labelId="relation-select-label"
                label="Relationship"
                value={relation}
                onChange={(e) => setRelation(String(e.target.value))}
              >
                <MenuItem value="Father">Father</MenuItem>
                <MenuItem value="Mother">Mother</MenuItem>
                <MenuItem value="Guardian">Guardian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignParent} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAssignParent}
            variant="contained"
            color="success"
            disabled={assignParentMutation.isPending}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {assignParentMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Confirm Parent Link"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Class Dialog: POST /api/v1/class/create_class */}
      <Dialog
        open={createClassOpen}
        onClose={handleCloseCreateClass}
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: "14px", minWidth: { xs: "90%", sm: 440 }, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--primary-purple-600)" }}>
          Create New Class
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Define a new classroom with grade/standard number, section, and designated class teacher.
            </Typography>

            <TextField
              size="small"
              fullWidth
              required
              label="Class Number (Grade)"
              type="number"
              placeholder="e.g. 1, 2, 10"
              value={newClassNo}
              onChange={(e) => setNewClassNo(e.target.value === "" ? "" : Number(e.target.value))}
            />

            <TextField
              size="small"
              fullWidth
              required
              label="Section"
              placeholder="e.g. A, B, C"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
            />

            <FormControl fullWidth required size="small">
              <InputLabel id="create-class-teacher-label">Class Teacher</InputLabel>
              <Select
                labelId="create-class-teacher-label"
                label="Class Teacher"
                value={newClassTeacherId}
                onChange={(e) => setNewClassTeacherId(String(e.target.value))}
              >
                {safeTeachers.map((teacher: any) => {
                  const tid = teacher.teacher_id || teacher.u_id || teacher.id;
                  return (
                    <MenuItem key={tid} value={tid}>
                      {teacher.name || `${teacher.first_name || ""} ${teacher.last_name || ""}`} {teacher.email ? `(${teacher.email})` : ""}
                    </MenuItem>
                  );
                })}
                {safeTeachers.length === 0 && (
                  <MenuItem disabled value="">
                    No teachers found. Please register teachers first.
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseCreateClass} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCreateClass}
            variant="contained"
            disabled={createClassMutation.isPending}
            sx={{
              backgroundColor: "var(--primary-purple-600)",
              "&:hover": { backgroundColor: "var(--primary-purple-700)" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {createClassMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Create Class"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Student;
