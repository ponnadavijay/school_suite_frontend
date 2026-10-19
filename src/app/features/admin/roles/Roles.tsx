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
  TablePagination,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import {
  Role,
  RoleCreateModel,
  RoleUpdateModel,
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../adminApi/AdminApi";
import CreateRole from "./createRole/CreateRole";
import "./Roles.css";

const Roles: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // React Query hooks
  const { data: roles = [], isLoading, isError, refetch, isFetching } = useRoles();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const handleOpenCreateDrawer = () => {
    setEditRole(null);
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (role: Role) => {
    setEditRole(role);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditRole(null);
  };

  const handleSubmitRole = async (data: RoleCreateModel | RoleUpdateModel) => {
    try {
      if (editRole) {
        await updateRoleMutation.mutateAsync(data as RoleUpdateModel);
        toast.success("Role updated successfully! 🎉");
      } else {
        await createRoleMutation.mutateAsync(data as RoleCreateModel);
        toast.success("New role created successfully! 🎉");
      }
      refetch();
      handleCloseDrawer();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to save role. Please try again.";
      toast.error(`Error: ${errMsg} ❌`);
    }
  };

  const handleOpenDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    const roleId = roleToDelete.role_id || roleToDelete.id;
    if (!roleId) {
      toast.error("Role identifier is missing.");
      return;
    }

    try {
      await deleteRoleMutation.mutateAsync(roleId);
      toast.success(`Role "${roleToDelete.role_name}" deleted successfully! 🗑️`);
      refetch();
      handleCloseDeleteDialog();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Could not delete role.";
      toast.error(`Delete failed: ${errMsg} ❌`);
    }
  };

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter((r) => {
      const name = (r.role_name || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const id = String(r.role_id || r.id || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || id.includes(q);
    });
  }, [roles, searchQuery]);

  // Paginated Roles
  const paginatedRoles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRoles.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRoles, page, rowsPerPage]);

  return (
    <Box className="roles-container">
      {/* Header Banner */}
      <Box className="page-header-banner">
        <Box>
          <Typography variant="h4" className="page-header-title">
            <AdminPanelSettingsIcon sx={{ fontSize: 36 }} />
            Roles Management
          </Typography>
          <Typography className="page-header-subtitle">
            Configure system access roles, administrative privileges, and staff designations
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh Roles">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              className="page-header-icon-btn"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDrawer}
            className="page-header-primary-btn"
          >
            Create Role
          </Button>
        </Box>
      </Box>

      {/* KPI Stats Cards */}
      <Box className="roles-stats-grid">
        <Box className="roles-stat-card">
          <Box className="roles-stat-info">
            <Typography className="roles-stat-value">{roles.length}</Typography>
            <Typography className="roles-stat-label">Total Defined Roles</Typography>
          </Box>
          <Box className="roles-stat-icon-wrapper roles-card-purple">
            <AdminPanelSettingsIcon />
          </Box>
        </Box>

        <Box className="roles-stat-card">
          <Box className="roles-stat-info">
            <Typography className="roles-stat-value">
              {roles.filter((r) => (r.role_name || "").toLowerCase().includes("admin") || (r.role_name || "").toLowerCase().includes("principal")).length}
            </Typography>
            <Typography className="roles-stat-label">Administrative Roles</Typography>
          </Box>
          <Box className="roles-stat-icon-wrapper roles-card-emerald">
            <SecurityIcon />
          </Box>
        </Box>

        <Box className="roles-stat-card">
          <Box className="roles-stat-info">
            <Typography className="roles-stat-value">{filteredRoles.length}</Typography>
            <Typography className="roles-stat-label">Showing In View</Typography>
          </Box>
          <Box className="roles-stat-icon-wrapper roles-card-blue">
            <GroupIcon />
          </Box>
        </Box>
      </Box>

      {/* Roles Table Card */}
      <Paper className="roles-table-card" elevation={0}>
        {/* Table Toolbar */}
        <Box className="roles-table-toolbar">
          <TextField
            size="small"
            placeholder="Search roles by title or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="roles-search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRoles.length} {filteredRoles.length === 1 ? "role" : "roles"}
          </Typography>
        </Box>

        {/* Table Content */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={8}>
            <CircularProgress sx={{ color: "var(--primary-purple-600)" }} />
          </Box>
        ) : isError ? (
          <Box className="roles-empty-state">
            <Typography color="error" variant="h6">
              Failed to load roles. Please check connection.
            </Typography>
            <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 1 }}>
              Retry
            </Button>
          </Box>
        ) : filteredRoles.length === 0 ? (
          <Box className="roles-empty-state">
            <AdminPanelSettingsIcon className="roles-empty-icon" />
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? "No matching roles found" : "No roles configured yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={360}>
              {searchQuery
                ? "Try adjusting your search query to find the role you are looking for."
                : "Get started by creating your first user role with specific school permissions."}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDrawer}
                sx={{
                  mt: 1,
                  backgroundColor: "var(--primary-purple-600)",
                  "&:hover": { backgroundColor: "var(--primary-purple-700)" },
                  textTransform: "none",
                }}
              >
                Create First Role
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead className="roles-table-header">
                  <TableRow>
                    <TableCell className="roles-table-header-cell" width="100">
                      ID
                    </TableCell>
                    <TableCell className="roles-table-header-cell">Role Name</TableCell>
                    <TableCell className="roles-table-header-cell">Description</TableCell>
                    <TableCell className="roles-table-header-cell" width="140">
                      Scope
                    </TableCell>
                    <TableCell
                      className="roles-table-header-cell"
                      align="right"
                      width="120"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRoles.map((role) => {
                    const roleId = role.role_id || role.id;
                    const isSystemRole =
                      role.role_name.toLowerCase() === "admin" ||
                      role.role_name.toLowerCase() === "principal";

                    return (
                      <TableRow key={String(roleId || role.role_name)} className="roles-table-row">
                        <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                          #{roleId || "—"}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "8px",
                                bgcolor: "#f1edff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--primary-purple-600)",
                              }}
                            >
                              <AdminPanelSettingsIcon fontSize="small" />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                              {role.role_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>
                          {role.description || "System standard privileges"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isSystemRole ? "System Default" : "Custom"}
                            size="small"
                            sx={{
                              backgroundColor: isSystemRole ? "#fef3c7" : "#e0f2fe",
                              color: isSystemRole ? "#b45309" : "#0369a1",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Tooltip title="Edit Role in Drawer">
                              <IconButton
                                size="small"
                                className="action-btn-edit"
                                onClick={() => handleOpenEditDrawer(role)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Role">
                              <IconButton
                                size="small"
                                className="action-btn-delete"
                                onClick={() => handleOpenDeleteDialog(role)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRoles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      {/* RIGHT DRAWER for Create & Edit */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 460 },
            maxWidth: "100vw",
            boxShadow: "-4px 0 24px rgba(42, 25, 137, 0.18)",
            borderLeft: "1px solid rgba(42, 25, 137, 0.12)",
          },
        }}
      >
        <CreateRole
          onClose={handleCloseDrawer}
          onSubmit={handleSubmitRole}
          roleData={editRole}
          isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Delete Role Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569" }}>
            Are you sure you want to delete the role{" "}
            <strong>"{roleToDelete?.role_name}"</strong>? This may affect users who currently have this role assigned.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteRoleMutation.isPending}
            sx={{ textTransform: "none", fontWeight: 600, px: 2.5 }}
          >
            {deleteRoleMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Yes, Delete Role"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;
