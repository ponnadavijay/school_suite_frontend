import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import CreateStudent from "./createStudent/CreateStudent";
import "./Student.css";
import { useStudents } from "./studentApi/StudentApi";

const Student: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);
  const { user } = useAuth();
  const organizationId = user?.organization;

  const { data: students, isLoading, isError, refetch } = useStudents(organizationId);

  const handleOpenDrawer = () => {
    setEditStudent(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleEditClick = (student: any) => {
    setEditStudent(student);
    setDrawerOpen(true);
  };

  const handleStudentCreated = () => {
    refetch(); // refresh the student list after create or update
    handleCloseDrawer();
  };

  return (
    <Box className="teacher-page">
      <div className="teacher-header">
        <div className="list-header-title">Students</div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
        >
          Register Student
        </Button>
      </div>

      <div>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
            Error fetching student data.
          </Typography>
        ) : students?.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Parent ID</TableCell>
                  <TableCell>Class Room</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.parent}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.roll_no}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(student)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No student data available.
          </Typography>
        )}
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <CreateStudent
          onClose={handleCloseDrawer}
          onStudentCreated={handleStudentCreated}
          studentData={editStudent}
        />
      </Drawer>
    </Box>
  );
};

export default Student;
