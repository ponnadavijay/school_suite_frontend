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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";
import CreateStudent from "./createStudent/CreateStudent";
import { useDeleteStudent, useStudents } from "./studentApi/StudentApi";
import "./Student.css";

const Student: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");

  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useStudents(organizationId);

  const { mutate: deleteStudent } = useDeleteStudent(organizationId);

  const handleOpenDrawer = () => {
    setEditStudent(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  const handleEditClick = (student: any) => {
    setEditStudent(student);
    setDrawerOpen(true);
  };

  const handleStudentCreated = () => {
    refetch();
    handleCloseDrawer();
  };

  const handleDeleteClick = (admission_no: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(admission_no, {
        onSuccess: () => refetch(),
        onError: (err) => console.error("Delete failed:", err),
      });
    }
  };

  const filteredStudents = useMemo(() => {
    if (!students) return [];

    let list = [...students];
    if (selectedClassId !== "") {
      list = list.filter(
        (student) => student.class_room?.class_id === selectedClassId
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (student) =>
          student.name.toLowerCase().includes(q) ||
          String(student.admission_no).includes(q) ||
          student.parent?.name?.toLowerCase().includes(q) ||
          student.parent?.mobile_no?.includes(q)
      );
    }
    return list;
  }, [students, searchQuery, selectedClassId]);

  const paginatedStudents = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  const classOptions = useMemo(() => {
    if (!students) return [];
    const uniqueClasses = new Map();
    students.forEach((s: any) => {
      if (s.class_room) {
        uniqueClasses.set(s.class_room.class_id, s.class_room);
      }
    });
    return Array.from(uniqueClasses.values());
  }, [students]);

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

      <div className="student-filters">
        <TextField
          size="small"
          label="Search By Student"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          className="search-field"
        />

        <FormControl size="small" className="class-filter">
          <InputLabel id="class-filter-label">Filter by Class</InputLabel>
          <Select
            labelId="class-filter-label"
            label="Filter by Class"
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value as number | "");
              setPage(0);
            }}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classOptions.map((cls: any) => (
              <MenuItem key={cls.class_id} value={cls.class_id}>
                Class {cls.class_no}-{cls.class_section}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        ) : filteredStudents.length ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Admission No</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Parent Name</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Class Room</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStudents.map((student: any) => (
                    <TableRow key={student.admission_no}>
                      <TableCell>{student.admission_no}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        {student.parent?.name} ({student.parent?.relation})
                      </TableCell>
                      <TableCell>{student.parent?.mobile_no}</TableCell>
                      <TableCell>
                        {student.class_room?.class_no}
                        {student.class_room?.class_section
                          ? `-${student.class_room?.class_section}`
                          : ""}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(student)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeleteClick(student.admission_no)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
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
