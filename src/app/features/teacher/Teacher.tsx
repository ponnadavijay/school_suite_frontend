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
  IconButton
} from "@mui/material";
import CreateTeacher from "./createTeacher/CreateTeacher";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./Teacher.css";
import { useGetAllTeachers } from "./teacherApi/TeacherApi";
import { useAuth } from "../../context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Teacher: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<any>(null);
  const { user } = useAuth();
  const organizationId = user?.organization;
  const navigate = useNavigate();


  const { data: teachers = [], isLoading, isError } = useGetAllTeachers(organizationId);

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

  return (
    <Box className="teacher-page">
      <Box className="teacher-header">
        <Typography variant="h4" gutterBottom>
          Teachers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
        >
          Create Teacher
        </Button>
      </Box>

      <div>
        {isLoading && <Typography>Loading...</Typography>}
        {isError && <Typography color="error">Failed to load teachers</Typography>}

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
          onTeacherCreated={() => { }}
          teacherData={editTeacher}
        />
      </Drawer>
    </Box>
  );
};

export default Teacher;
