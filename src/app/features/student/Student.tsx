import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Container,

} from "@mui/material";
import CreateStudent from "./createStudent/CreateStudent";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import "./Student.css";

const Student: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);
  const { user } = useAuth();

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setEditStudent(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleEditClick = (student: any) => {
    setEditStudent(student);
    setDrawerOpen(true);
  };

  return (
    <Box className="teacher-page">
      <div className="teacher-header">
        <Typography variant="h4" gutterBottom>
          Students
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
        >
          Register Student
        </Button>
      </div>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Student table commented out since we don't have data */}
        {/* <TableContainer component={Paper}>
          <Table sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>ID</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Name</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Parent ID</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Class Room</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No student data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
        
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          Student data will appear here once the API is connected
        </Typography>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <CreateStudent
          onClose={handleCloseDrawer}
          onStudentCreated={() => window.location.reload()}
          studentData={editStudent}
        />
      </Drawer>
    </Box>
  );
};

export default Student;