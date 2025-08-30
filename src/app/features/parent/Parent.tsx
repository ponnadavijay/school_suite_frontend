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
  TableContainer,
  Paper,
  IconButton,
  CircularProgress,
  TextField,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import CreateParent from "./createParent/CreateParent";
import "./Parent.css";
import { useParents } from "./parentApi/parentApi";

const Parent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editParent, setEditParent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { user } = useAuth();
  const { data: parents = [], isLoading, isError } = useParents(user?.organization);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setEditParent(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditParent(null);
  };

  const handleEditClick = (parent: any) => {
    setEditParent(parent);
    setDrawerOpen(true);
  };

  const filteredParents = useMemo(() => {
    if (!searchQuery) return parents;
    return parents.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mobile_no?.toString().includes(searchQuery)
    );
  }, [parents, searchQuery]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedParents = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredParents.slice(start, start + rowsPerPage);
  }, [filteredParents, page, rowsPerPage]);

  return (
    <Box className="parent-page">
      <div className="parent-header">
        <div className="list-header-title">Parents</div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
        >
          Register Parent
        </Button>
      </div>

      <Box sx={{ my: 2, display: "flex", justifyContent: "flex-start" }}>
        <TextField
          label="Search By Parent"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <div className="parent-table-container">
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" align="center">
            Failed to load parent data.
          </Typography>
        ) : filteredParents.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>ID</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>Name</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>Email</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>Relation</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>Mobile</TableCell>
                    <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedParents.map((parent: any) => (
                    <TableRow key={parent.parent_id}>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        {parent.parent_id}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        {parent.name}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        {parent.email}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        {parent.relation}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        {parent.mobile_no}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid rgba(224,224,224,1)" }}>
                        <IconButton color="primary" onClick={() => handleEditClick(parent)}>
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
              count={filteredParents.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", mt: 4 }}>
            No parent data available.
          </Typography>
        )}
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <CreateParent
          onClose={handleCloseDrawer}
          onParentCreated={() => window.location.reload()}
          parentData={editParent}
        />
      </Drawer>
    </Box>
  );
};

export default Parent;
