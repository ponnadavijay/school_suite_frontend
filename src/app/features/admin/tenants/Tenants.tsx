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
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import {
  Tenant,
  TenantCreateModel,
  TenantUpdateModel,
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "../adminApi/AdminApi";
import CreateTenant from "./createTenant/CreateTenant";
import "./Tenants.css";

const Tenants: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  // React Query hooks
  const {
    data: tenants = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTenants();

  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  // Unique countries list
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    tenants.forEach((t) => {
      if (t.country) set.add(t.country);
    });
    return Array.from(set);
  }, [tenants]);

  const handleOpenCreateDrawer = () => {
    setEditTenant(null);
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (tenant: Tenant) => {
    setEditTenant(tenant);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditTenant(null);
  };

  const handleSubmitTenant = async (data: TenantCreateModel | TenantUpdateModel) => {
    try {
      if (editTenant) {
        await updateTenantMutation.mutateAsync(data as TenantUpdateModel);
        toast.success("School tenant profile updated successfully! 🎉");
      } else {
        await createTenantMutation.mutateAsync(data as TenantCreateModel);
        toast.success("New school tenant created successfully! 🎉");
      }
      refetch();
      handleCloseDrawer();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to save tenant information.";
      toast.error(`Error: ${errMsg} ❌`);
    }
  };

  const handleOpenDeleteDialog = (tenant: Tenant) => {
    setTenantToDelete(tenant);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTenantToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!tenantToDelete) return;
    const tenantId = tenantToDelete.id || tenantToDelete.tenant_id;
    if (!tenantId) {
      toast.error("Tenant identifier is missing.");
      return;
    }

    try {
      await deleteTenantMutation.mutateAsync(tenantId);
      toast.success(
        `School tenant "${tenantToDelete.name}" deleted successfully! 🗑️`
      );
      refetch();
      handleCloseDeleteDialog();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Could not delete tenant.";
      toast.error(`Delete failed: ${errMsg} ❌`);
    }
  };

  // Filtered tenants
  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    return tenants.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (t.name || "").toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.contact || "").toLowerCase().includes(q) ||
        (t.address || "").toLowerCase().includes(q) ||
        (t.country || "").toLowerCase().includes(q);

      const matchesCountry =
        selectedCountryFilter === "ALL" ||
        t.country?.toLowerCase() === selectedCountryFilter.toLowerCase();

      return matchesSearch && matchesCountry;
    });
  }, [tenants, searchQuery, selectedCountryFilter]);

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredTenants.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTenants, page, rowsPerPage]);

  return (
    <Box className="tenants-container">
      {/* Header Banner */}
      <Box className="page-header-banner">
        <Box>
          <Typography variant="h4" className="page-header-title">
            <SchoolIcon sx={{ fontSize: 36 }} />
            School Tenants & Branches
          </Typography>
          <Typography className="page-header-subtitle">
            Manage multi-tenant campuses, institutions, and administrative boundaries
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} alignItems="center">
          <Tooltip title="Refresh Tenants">
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
            Register School Tenant
          </Button>
        </Box>
      </Box>

      {/* KPI Stats Cards */}
      <Box className="tenants-stats-grid">
        <Box className="tenants-stat-card">
          <Box className="tenants-stat-info">
            <Typography className="tenants-stat-value">{tenants.length}</Typography>
            <Typography className="tenants-stat-label">Registered Institutions</Typography>
          </Box>
          <Box className="tenants-stat-icon-wrapper tenant-card-purple">
            <SchoolIcon />
          </Box>
        </Box>

        <Box className="tenants-stat-card">
          <Box className="tenants-stat-info">
            <Typography className="tenants-stat-value">
              {uniqueCountries.length || 1}
            </Typography>
            <Typography className="tenants-stat-label">Countries Represented</Typography>
          </Box>
          <Box className="tenants-stat-icon-wrapper tenant-card-emerald">
            <PublicIcon />
          </Box>
        </Box>

        <Box className="tenants-stat-card">
          <Box className="tenants-stat-info">
            <Typography className="tenants-stat-value">{filteredTenants.length}</Typography>
            <Typography className="tenants-stat-label">Showing In View</Typography>
          </Box>
          <Box className="tenants-stat-icon-wrapper tenant-card-cyan">
            <BusinessIcon />
          </Box>
        </Box>
      </Box>

      {/* Tenants Table Card */}
      <Paper className="tenants-table-card" elevation={0}>
        {/* Table Toolbar */}
        <Box className="tenants-table-toolbar">
          <Box className="tenants-toolbar-left">
            <TextField
              size="small"
              placeholder="Search school name, email, contact, city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="tenants-search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {uniqueCountries.length > 0 && (
              <FormControl size="small" className="tenants-country-filter">
                <InputLabel id="tenant-country-filter-label">Filter Country</InputLabel>
                <Select
                  labelId="tenant-country-filter-label"
                  label="Filter Country"
                  value={selectedCountryFilter}
                  onChange={(e) => {
                    setSelectedCountryFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="ALL">All Countries</MenuItem>
                  {uniqueCountries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredTenants.length} of {tenants.length} school branches
          </Typography>
        </Box>

        {/* Table Content */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={8}>
            <CircularProgress sx={{ color: "var(--primary-purple-600)" }} />
          </Box>
        ) : isError ? (
          <Box className="tenants-empty-state">
            <Typography color="error" variant="h6">
              Failed to load tenants. Please check connection.
            </Typography>
            <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 1 }}>
              Retry
            </Button>
          </Box>
        ) : filteredTenants.length === 0 ? (
          <Box className="tenants-empty-state">
            <SchoolIcon className="tenants-empty-icon" />
            <Typography variant="h6" color="text.secondary">
              {searchQuery || selectedCountryFilter !== "ALL"
                ? "No schools match your search criteria"
                : "No school tenants registered yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={360}>
              {searchQuery || selectedCountryFilter !== "ALL"
                ? "Try clearing your filters or checking spelling."
                : "Set up multi-tenant campuses and school branches to partition your system."}
            </Typography>
            {!searchQuery && selectedCountryFilter === "ALL" && (
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
                Register First School Tenant
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead className="tenants-table-header">
                  <TableRow>
                    <TableCell className="tenants-table-header-cell" width="90">
                      ID
                    </TableCell>
                    <TableCell className="tenants-table-header-cell">
                      School / Institution Name
                    </TableCell>
                    <TableCell className="tenants-table-header-cell">
                      Contact Information
                    </TableCell>
                    <TableCell className="tenants-table-header-cell">
                      Campus Address
                    </TableCell>
                    <TableCell className="tenants-table-header-cell" width="130">
                      Country
                    </TableCell>
                    <TableCell className="tenants-table-header-cell" width="110">
                      Status
                    </TableCell>
                    <TableCell
                      className="tenants-table-header-cell"
                      align="right"
                      width="120"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTenants.map((t) => {
                    const tenantId = t.id || t.tenant_id;

                    return (
                      <TableRow
                        key={String(tenantId || t.name)}
                        className="tenants-table-row"
                      >
                        <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>
                          #{tenantId || "—"}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box className="tenant-avatar-badge">
                              <SchoolIcon fontSize="small" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                {t.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#64748b", display: "block" }}
                              >
                                Branch Partition
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.4}>
                            <Box display="flex" alignItems="center" gap={0.8}>
                              <EmailIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                              <Typography variant="body2" sx={{ color: "#334155" }}>
                                {t.email}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.8}>
                              <PhoneIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                              <Typography variant="body2" sx={{ color: "#64748b" }}>
                                {t.contact}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#475569", maxWidth: 220 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={t.address}
                          >
                            {t.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t.country}
                            size="small"
                            icon={<PublicIcon style={{ fontSize: "14px" }} />}
                            sx={{
                              backgroundColor: "#f0fdf4",
                              color: "#166534",
                              fontWeight: 500,
                              fontSize: "0.78rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            size="small"
                            sx={{
                              backgroundColor: "#ecfdf5",
                              color: "#059669",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Tooltip title="Edit School Details in Drawer">
                              <span>
                                <IconButton
                                  size="small"
                                  className="action-btn-edit"
                                  onClick={() => handleOpenEditDrawer(t)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete School Tenant">
                              <span>
                                <IconButton
                                  size="small"
                                  className="action-btn-delete"
                                  onClick={() => handleOpenDeleteDialog(t)}
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
              count={filteredTenants.length}
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
            width: { xs: "100%", sm: 480 },
            maxWidth: "100vw",
            boxShadow: "-4px 0 24px rgba(42, 25, 137, 0.18)",
            borderLeft: "1px solid rgba(42, 25, 137, 0.12)",
          },
        }}
      >
        <CreateTenant
          onClose={handleCloseDrawer}
          onSubmit={handleSubmitTenant}
          tenantData={editTenant}
          isLoading={createTenantMutation.isPending || updateTenantMutation.isPending}
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
          Delete Tenant Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569" }}>
            Are you sure you want to delete school tenant{" "}
            <strong>"{tenantToDelete?.name}"</strong>? All associated school data will be affected.
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
            disabled={deleteTenantMutation.isPending}
            sx={{ textTransform: "none", fontWeight: 600, px: 2.5 }}
          >
            {deleteTenantMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Yes, Delete Tenant"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tenants;
