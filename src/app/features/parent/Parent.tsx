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
import { useParents, useCreateParent, useUpdateParent } from "./parentApi/parentApi";
import { toast } from "react-toastify";

const Parent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editParent, setEditParent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;

  const { data: parents = [], isLoading, isError, refetch } = useParents(organizationId);
  const createParentMutation = useCreateParent();
  const updateParentMutation = useUpdateParent();

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

  const handleSubmit = async (formData: any) => {
    const payload = {
      ...formData,
      organization: Number(formData.organization),
      role: formData.role ? Number(formData.role) : null,
      pincode: Number(formData.pincode),
    };

    try {
      if (editParent) {
        await updateParentMutation.mutateAsync({
          parent_id: editParent.id,
          ...payload,
        });
        toast.success("Parent updated successfully 🎉");
      } else {
        await createParentMutation.mutateAsync(payload);
        toast.success("Parent created successfully 🎉");
      }
      await refetch();
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
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

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
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
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDrawer}>
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
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography variant="h6">
              Session expired, please relogin!
            </Typography>
          </Box>
        ) : filteredParents.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Relation</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedParents.map((parent: any) => (
                    <TableRow key={parent.parent_id}>
                      <TableCell>{parent.parent_id}</TableCell>
                      <TableCell>{parent.name}</TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>{parent.relation}</TableCell>
                      <TableCell>{parent.mobile_no}</TableCell>
                      <TableCell>
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
          <Typography align="center" sx={{ mt: 4 }} color="textSecondary">
            No parent data available.
          </Typography>
        )}
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer} PaperProps={{ sx: { width: "400px" } }}>
        <CreateParent
          onClose={handleCloseDrawer}
          onSubmit={handleSubmit}
          parentData={editParent}
          isLoading={createParentMutation.isPending || updateParentMutation.isPending}
        />
      </Drawer>
    </Box>
  );
};

export default Parent;
