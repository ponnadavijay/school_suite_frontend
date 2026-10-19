import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DescriptionIcon from "@mui/icons-material/Description";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  PermissionItem,
  PermCreateModel,
  PermUpdateModel,
  useRoles,
} from "../../adminApi/AdminApi";
import "./CreatePermission.css";

interface CreatePermissionProps {
  onClose: () => void;
  onSubmit: (data: PermCreateModel | PermUpdateModel) => void | Promise<void>;
  permissionData?: PermissionItem | null;
  isLoading?: boolean;
}

const COMMON_PERM_SUGGESTIONS = [
  { key: "student:create", label: "Create Student", desc: "Register new students in classrooms" },
  { key: "student:view", label: "View Students", desc: "Read student profiles and records" },
  { key: "teacher:manage", label: "Manage Teachers", desc: "Create, edit, and assign teachers" },
  { key: "attendance:mark", label: "Mark Attendance", desc: "Record daily teacher and student attendance" },
  { key: "fee:collect", label: "Collect Fees", desc: "Generate invoices and accept payments" },
  { key: "exam:grade", label: "Grade Exams", desc: "Input and publish examination marks" },
  { key: "reports:export", label: "Export Reports", desc: "Download analytics and school summary data" },
];

const CreatePermission: React.FC<CreatePermissionProps> = ({
  onClose,
  onSubmit,
  permissionData,
  isLoading = false,
}) => {
  const isEditMode = Boolean(permissionData);

  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const [formData, setFormData] = useState({
    permission: "",
    perm_description: "",
    role_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (permissionData) {
      setFormData({
        permission: permissionData.permission || "",
        perm_description: permissionData.perm_description || "",
        role_id: permissionData.role_id ? String(permissionData.role_id) : "",
      });
    } else {
      setFormData({
        permission: "",
        perm_description: "",
        role_id: "",
      });
    }
    setErrors({});
  }, [permissionData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectPreset = (preset: typeof COMMON_PERM_SUGGESTIONS[0]) => {
    setFormData((prev) => ({
      ...prev,
      permission: preset.key,
      perm_description: preset.desc,
    }));
    if (errors.permission) setErrors((prev) => ({ ...prev, permission: "" }));
    if (errors.perm_description) setErrors((prev) => ({ ...prev, perm_description: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.permission.trim()) {
      newErrors.permission = "Permission key is required";
    }
    if (!formData.perm_description.trim()) {
      newErrors.perm_description = "Description is required";
    }
    if (!formData.role_id) {
      newErrors.role_id = "Please select an assigned role";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && permissionData) {
      const permId = permissionData.id || permissionData.perm_id;
      onSubmit({
        id: permId!,
        permission: formData.permission.trim(),
        perm_description: formData.perm_description.trim(),
        role_id: formData.role_id,
      });
    } else {
      onSubmit({
        permission: formData.permission.trim(),
        perm_description: formData.perm_description.trim(),
        role_id: formData.role_id,
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="perm-drawer-container">
      {/* Header */}
      <Box className="perm-drawer-header">
        <Box className="perm-drawer-header-content">
          <Box className="perm-drawer-icon-box">
            <SecurityIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography className="perm-drawer-title">
              {isEditMode ? "Edit Permission" : "Add Permission"}
            </Typography>
            <Typography className="perm-drawer-subtitle">
              {isEditMode
                ? "Update role authorization key and action scope"
                : "Grant access permissions to school roles"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} className="perm-drawer-close-btn" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box className="perm-drawer-body">
        {/* Permission Key */}
        <Box>
          <TextField
            fullWidth
            label="Permission Identifier / Key"
            name="permission"
            value={formData.permission}
            onChange={handleChange}
            error={Boolean(errors.permission)}
            helperText={errors.permission || "Format: module:action (e.g. attendance:mark)"}
            placeholder="e.g. student:create"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon sx={{ color: "var(--primary-purple-600)" }} />
                </InputAdornment>
              ),
            }}
          />

          {!isEditMode && (
            <Box mt={1.5}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Quick Suggestions:
              </Typography>
              <Box className="perm-quick-tags">
                {COMMON_PERM_SUGGESTIONS.map((preset) => (
                  <Chip
                    key={preset.key}
                    label={preset.label}
                    size="small"
                    variant={
                      formData.permission === preset.key ? "filled" : "outlined"
                    }
                    color={
                      formData.permission === preset.key ? "primary" : "default"
                    }
                    onClick={() => handleSelectPreset(preset)}
                    className="perm-quick-chip"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      borderColor: "rgba(42, 25, 137, 0.25)",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Target Role Dropdown */}
        <FormControl fullWidth error={Boolean(errors.role_id)} required>
          <InputLabel id="role-select-label">Assigned Role</InputLabel>
          <Select
            labelId="role-select-label"
            label="Assigned Role"
            name="role_id"
            value={formData.role_id}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, role_id: String(e.target.value) }));
              if (errors.role_id) setErrors((prev) => ({ ...prev, role_id: "" }));
            }}
            startAdornment={
              <InputAdornment position="start">
                <AdminPanelSettingsIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            }
          >
            {isLoadingRoles ? (
              <MenuItem disabled>Loading available roles...</MenuItem>
            ) : roles.length === 0 ? (
              <MenuItem disabled>No roles available. Please create a role first.</MenuItem>
            ) : (
              roles.map((r) => {
                const rid = String(r.role_id || r.id);
                return (
                  <MenuItem key={rid} value={rid}>
                    {r.role_name}
                  </MenuItem>
                );
              })
            )}
          </Select>
          {errors.role_id && <FormHelperText>{errors.role_id}</FormHelperText>}
        </FormControl>

        {/* Description */}
        <TextField
          fullWidth
          label="Permission Description"
          name="perm_description"
          value={formData.perm_description}
          onChange={handleChange}
          error={Boolean(errors.perm_description)}
          helperText={errors.perm_description}
          multiline
          rows={3}
          required
          placeholder="Describe what access this permission grants..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                <DescriptionIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            p: 2,
            backgroundColor: "#f4f3fb",
            borderRadius: 2,
            border: "1px dashed rgba(42, 25, 137, 0.25)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "var(--primary-purple-600)", fontWeight: 600, mb: 0.5 }}
          >
            Security Policy Note
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.82rem">
            Users assigned to the selected role will immediately inherit these capabilities
            across the school platform.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box className="perm-drawer-footer">
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          sx={{
            borderColor: "#d1d5db",
            color: "#4b5563",
            "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: "var(--primary-purple-600)",
            "&:hover": { backgroundColor: "var(--primary-purple-700)" },
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            minWidth: 140,
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : isEditMode ? (
            "Update Permission"
          ) : (
            "Save Permission"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePermission;
