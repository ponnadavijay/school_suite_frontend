import React, { useState } from "react";
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
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTeacher from "./createTeacher/CreateTeacher";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./Teacher.css";
import { useTeachers, useCreateTeacher, useUpdateTeacher } from "./teacherApi/TeacherApi";
import { useAuth } from "../../context/AuthContext";

const Teacher: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<any>(null);
  const { user } = useAuth();
  const organizationId = user?.organization;

  const { 
    data: teachers = [], 
    isLoading, 
    isError,
    refetch: refetchTeachers 
  } = useTeachers(organizationId);

  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();

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
        // Update existing teacher
        await updateTeacherMutation.mutateAsync({
          teacher_id: editTeacher.teacher_id,
          ...teacherData
        });
        toast.success("Teacher updated successfully!");
      } else {
        // Create new teacher
        await createTeacherMutation.mutateAsync({
          ...teacherData,
          organization: organizationId
        });
        toast.success("Teacher created successfully!");
      }
      refetchTeachers();
      handleCloseDrawer();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Box className="teacher-page">
      <Box className="teacher-header">
        <div className="list-header-title">
          Teachers
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
          disabled={isLoading}
        >
          Create Teacher
        </Button>
      </Box>

      <Box>
        {isLoading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Typography color="error" p={2}>
            Failed to load teachers
          </Typography>
        )}

        {!isLoading && teachers.length === 0 && (
          <Typography p={2}>No teachers found</Typography>
        )}

        {!isLoading && teachers.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>ID</TableCell>
                  <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Name</TableCell>
                  <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Email</TableCell>
                  <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Qualification</TableCell>
                  <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>{teacher.teacher_id}</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>{teacher.name}</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>{teacher.email}</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                      {teacher.qualification || "-"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditClick(teacher)}
                        disabled={updateTeacherMutation.isLoading}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

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
          isLoading={editTeacher ? updateTeacherMutation.isLoading : createTeacherMutation.isLoading}
        />
      </Drawer>
    </Box>
  );
};

export default Teacher;