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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ShieldIcon from "@mui/icons-material/Shield";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import {
  PermissionItem,
  PermCreateModel,
  PermUpdateModel,
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  useRoles,
} from "../adminApi/AdminApi";
import CreatePermission from "./createPermission/CreatePermission";
import "./Permissions.css";

const Permissions: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPermission, setEditPermission] = useState<PermissionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PermissionItem | null>(null);

  // React Query hooks
  const {
    data: permissions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePermissions();
  const { data: roles = [] } = useRoles();

  const createPermMutation = useCreatePermission();
  const updatePermMutation = useUpdatePermission();
  const deletePermMutation = useDeletePermission();

  // Role ID to Name lookup map
  const roleMap = useMemo(() => {
    const map = new Map<string, string>();
    roles.forEach((r) => {
      const rid = String(r.role_id || r.id);
      map.set(rid, r.role_name);
    });
    return map;
  }, [roles]);

  const handleOpenCreateDrawer = () => {
    setEditPermission(null);
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: PermissionItem) => {
    setEditPermission(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditPermission(null);
  };

  const handleSubmitPermission = async (data: PermCreateModel | PermUpdateModel) => {
    try {
      if (editPermission) {
        await updatePermMutation.mutateAsync(data as PermUpdateModel);
        toast.success("Permission updated successfully! 🎉");
      } else {
        await createPermMutation.mutateAsync(data as PermCreateModel);
        toast.success("Permission created successfully! 🎉");
      }
      refetch();
      handleCloseDrawer();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to save permission.";
      toast.error(`Error: ${errMsg} ❌`);
    }
  };

  const handleOpenDeleteDialog = (item: PermissionItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const permId = itemToDelete.id || itemToDelete.perm_id;
    if (!permId) {
      toast.error("Permission identifier is missing.");
      return;
    }

    try {
      await deletePermMutation.mutateAsync(permId);
      toast.success(
        `Permission "${itemToDelete.permission}" removed successfully! 🗑️`
      );
      refetch();
      handleCloseDeleteDialog();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Could not delete permission.";
      toast.error(`Delete failed: ${errMsg} ❌`);
    }
  };

  // Filtered permissions
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    return permissions.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (p.permission || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.perm_description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        selectedRoleFilter === "ALL" ||
        String(p.role_id) === String(selectedRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [permissions, searchQuery, selectedRoleFilter]);

  // Paginated permissions
  const paginatedPermissions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPermissions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPermissions, page, rowsPerPage]);

  return (
    <Box className="permissions-container">
      {/* Header Banner */}
      <Box className="page-header-banner">
        <Box>
          <Typography variant="h4" className="page-header-title">
            <SecurityIcon sx={{ fontSize: 36 }} />
            Permissions & Access Controls
          </Typography>
          <Typography className="page-header-subtitle">
            Define system authorization policies, capabilities, and role mappings
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh Permissions">
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDrawer}
            className="page-header-primary-btn"
          >
            Add Permission
          </Button>
        </Box>
      </Box>

      {/* KPI Stats Cards */}
      <Box className="permissions-stats-grid">
        <Box className="permissions-stat-card">
          <Box className="permissions-stat-info">
            <Typography className="permissions-stat-value">
              {permissions.length}
            </Typography>
            <Typography className="permissions-stat-label">
              Total Permissions
            </Typography>
          </Box>
          <Box className="permissions-stat-icon-wrapper perm-card-purple">
            <SecurityIcon />
          </Box>
        </Box>

        <Box className="permissions-stat-card">
          <Box className="permissions-stat-info">
            <Typography className="permissions-stat-value">{roles.length}</Typography>
            <Typography className="permissions-stat-label">Configured Roles</Typography>
          </Box>
          <Box className="permissions-stat-icon-wrapper perm-card-emerald">
            <ShieldIcon />
          </Box>
        </Box>

        <Box className="permissions-stat-card">
          <Box className="permissions-stat-info">
            <Typography className="permissions-stat-value">
              {filteredPermissions.length}
            </Typography>
            <Typography className="permissions-stat-label">Showing In View</Typography>
          </Box>
          <Box className="permissions-stat-icon-wrapper perm-card-amber">
            <VpnKeyIcon />
          </Box>
        </Box>
      </Box>

      {/* Table Card */}
      <Paper className="permissions-table-card" elevation={0}>
        {/* Table Toolbar */}
        <Box className="permissions-table-toolbar">
          <Box className="permissions-toolbar-left">
            <TextField
              size="small"
              placeholder="Search by key or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="permissions-search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" className="permissions-role-filter">
              <InputLabel id="filter-role-label">Filter Role</InputLabel>
              <Select
                labelId="filter-role-label"
                label="Filter Role"
                value={selectedRoleFilter}
                onChange={(e) => {
                  setSelectedRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="ALL">All Assigned Roles</MenuItem>
                {roles.map((r) => {
                  const rid = String(r.role_id || r.id);
                  return (
                    <MenuItem key={rid} value={rid}>
                      {r.role_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredPermissions.length} of {permissions.length} items
          </Typography>
        </Box>

        {/* Table Content */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={8}>
            <CircularProgress sx={{ color: "var(--primary-purple-600)" }} />
          </Box>
        ) : isError ? (
          <Box className="permissions-empty-state">
            <Typography color="error" variant="h6">
              Failed to load permissions. Please check connection.
            </Typography>
            <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 1 }}>
              Retry
            </Button>
          </Box>
        ) : filteredPermissions.length === 0 ? (
          <Box className="permissions-empty-state">
            <SecurityIcon className="permissions-empty-icon" />
            <Typography variant="h6" color="text.secondary">
              {searchQuery || selectedRoleFilter !== "ALL"
                ? "No permissions match your filter"
                : "No permissions set up yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={360}>
              {searchQuery || selectedRoleFilter !== "ALL"
                ? "Try clearing your filters or search keywords."
                : "Define permissions to control what actions teachers, staff, and students can perform."}
            </Typography>
            {!searchQuery && selectedRoleFilter === "ALL" && (
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
                Add First Permission
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead className="permissions-table-header">
                  <TableRow>
                    <TableCell className="permissions-table-header-cell" width="90">
                      ID
                    </TableCell>
                    <TableCell className="permissions-table-header-cell">
                      Permission Key
                    </TableCell>
                    <TableCell className="permissions-table-header-cell">
                      Description
                    </TableCell>
                    <TableCell className="permissions-table-header-cell" width="180">
                      Assigned Role
                    </TableCell>
                    <TableCell
                      className="permissions-table-header-cell"
                      align="right"
                      width="120"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPermissions.map((item) => {
                    const permId = item.id || item.perm_id;
                    const roleName =
                      item.role_name ||
                      (item.role_id ? roleMap.get(String(item.role_id)) : "Unassigned");

                    return (
                      <TableRow
                        key={String(permId || item.permission)}
                        className="permissions-table-row"
                      >
                        <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                          #{permId || "—"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.permission}
                            className="perm-key-badge"
                            size="small"
                            icon={<VpnKeyIcon style={{ fontSize: "14px" }} />}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#334155", fontWeight: 500 }}>
                          {item.perm_description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={roleName || `Role #${item.role_id}`}
                            size="small"
                            sx={{
                              backgroundColor: "#ede9fe",
                              color: "var(--primary-purple-600)",
                              fontWeight: 600,
                              fontSize: "0.78rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Tooltip title="Edit Permission in Drawer">
                              <span>
                                <IconButton
                                  size="small"
                                  className="action-btn-edit"
                                  onClick={() => handleOpenEditDrawer(item)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete Permission">
                              <span>
                                <IconButton
                                  size="small"
                                  className="action-btn-delete"
                                  onClick={() => handleOpenDeleteDialog(item)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </span>
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
              count={filteredPermissions.length}
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
        <CreatePermission
          onClose={handleCloseDrawer}
          onSubmit={handleSubmitPermission}
          permissionData={editPermission}
          isLoading={createPermMutation.isPending || updatePermMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: "14px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Delete Permission Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569" }}>
            Are you sure you want to delete permission{" "}
            <strong>"{itemToDelete?.permission}"</strong>? Roles will lose this capability immediately.
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
            disabled={deletePermMutation.isPending}
            sx={{ textTransform: "none", fontWeight: 600, px: 2.5 }}
          >
            {deletePermMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Yes, Delete Permission"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Permissions;
