import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  TextField,
  TablePagination,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTeacher from "./createTeacher/CreateTeacher";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCreateTeacher, useUpdateTeacher, useGetAllTeachers } from "./teacherApi/TeacherApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Teacher.css";

const Teacher: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;
  const navigate = useNavigate();

  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();

  const {
    data: teachers = [],
    isLoading,
    isError,
    refetch: refetchTeachers,
  } = useGetAllTeachers(organizationId);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setEditTeacher(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleEditClick = (teacher: any) => {
    setEditTeacher(teacher);
    setDrawerOpen(true);
  };

  const handleSubmit = async (teacherData: any) => {
    try {
      if (editTeacher) {
        await updateTeacherMutation.mutateAsync({
          teacher_id: editTeacher.teacher_id,
          ...teacherData,
        });
        toast.success("Teacher updated successfully ✅");
      } else {
        await createTeacherMutation.mutateAsync({
          ...teacherData,
          organization: organizationId,
        });
        toast.success("Teacher created successfully ✅");
      }
      refetchTeachers();
      handleCloseDrawer();
    } catch (error: any) {
      const res = error?.response?.data;
      let message = res?.message || "An error occurred ❌";
      if (res?.data && typeof res.data === "string") {
        try {
          const parsed = JSON.parse(res.data.replace(/'/g, '"'));
          if (parsed.email) {
            message = parsed.email[0];
          }
        } catch { }
      }
      toast.error(message);
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchQuery) return teachers;
    return teachers.filter(
      (teacher: any) =>
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  const paginatedTeachers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredTeachers.slice(start, start + rowsPerPage);
  }, [filteredTeachers, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="teacher-page">
      <div className="teacher-header-container">
        <Box className="teacher-header">
          <div className="list-header-title">Teachers</div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDrawer}
            disabled={isLoading}
          >
            Register Teacher
          </Button>
        </Box>

        <Box sx={{ my: 2, display: "flex", justifyContent: "flex-start" }}>
          <TextField
            label="Search By Teacher"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
      </div>

      <div>
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography variant="h6">
              Session expired, please relogin!
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && filteredTeachers.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher ID</TableCell>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Qualification</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>ActionS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTeachers.map((teacher: any) => (
                    <TableRow key={teacher.teacher_id}>
                      <TableCell>{teacher.teacher_id}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.qualification}</TableCell>
                      <TableCell>{teacher.mobile_no}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/teacher/view/${teacher.teacher_id}`)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleEditClick(teacher)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredTeachers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        )}

        {!isLoading && !isError && filteredTeachers.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography
              variant="body1"
              color="textSecondary"
            >
              No Teachers data please register teacher.
            </Typography>
          </Box>
        )}
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <CreateTeacher
          onClose={handleCloseDrawer}
          onSubmit={handleSubmit}
          teacherData={editTeacher}
          isLoading={
            editTeacher ? updateTeacherMutation.isLoading : createTeacherMutation.isLoading
          }
        />
      </Drawer>
    </Box>
  );
};

export default Teacher;
