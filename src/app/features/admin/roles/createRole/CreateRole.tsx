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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import DescriptionIcon from "@mui/icons-material/Description";
import { Role, RoleCreateModel, RoleUpdateModel } from "../../adminApi/AdminApi";
import "./CreateRole.css";

interface CreateRoleProps {
  onClose: () => void;
  onSubmit: (data: RoleCreateModel | RoleUpdateModel) => void | Promise<void>;
  roleData?: Role | null;
  isLoading?: boolean;
}

const COMMON_ROLE_PRESETS = [
  "Principal",
  "Vice Principal",
  "Teacher",
  "Head of Department",
  "Librarian",
  "Accountant",
  "Admin",
  "Transport Manager",
  "Counselor",
];

const CreateRole: React.FC<CreateRoleProps> = ({
  onClose,
  onSubmit,
  roleData,
  isLoading = false,
}) => {
  const isEditMode = Boolean(roleData);

  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (roleData) {
      setFormData({
        role_name: roleData.role_name || "",
        description: roleData.description || "",
      });
    } else {
      setFormData({
        role_name: "",
        description: "",
      });
    }
    setErrors({});
  }, [roleData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectPreset = (roleName: string) => {
    setFormData((prev) => ({ ...prev, role_name: roleName }));
    if (errors.role_name) {
      setErrors((prev) => ({ ...prev, role_name: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.role_name.trim()) {
      newErrors.role_name = "Role name is required";
    } else if (formData.role_name.trim().length < 2) {
      newErrors.role_name = "Role name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && roleData) {
      const roleId = roleData.role_id || roleData.id;
      onSubmit({
        role_id: roleId!,
        role_name: formData.role_name.trim(),
        description: formData.description.trim(),
      });
    } else {
      onSubmit({
        role_name: formData.role_name.trim(),
        description: formData.description.trim(),
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="role-drawer-container"
    >
      {/* Header */}
      <Box className="role-drawer-header">
        <Box className="role-drawer-header-content">
          <Box className="role-drawer-icon-box">
            <AdminPanelSettingsIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography className="role-drawer-title">
              {isEditMode ? "Edit User Role" : "Create New Role"}
            </Typography>
            <Typography className="role-drawer-subtitle">
              {isEditMode
                ? "Update permissions and details for this role"
                : "Define a new access role for staff or students"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          className="role-drawer-close-btn"
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box className="role-drawer-body">
        {/* Role Name */}
        <Box>
          <TextField
            fullWidth
            label="Role Name"
            name="role_name"
            value={formData.role_name}
            onChange={handleChange}
            error={Boolean(errors.role_name)}
            helperText={errors.role_name}
            placeholder="e.g. Senior Teacher, Examination Officer"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: "var(--primary-purple-600)" }} />
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
                Suggested Roles:
              </Typography>
              <Box className="role-quick-tags">
                {COMMON_ROLE_PRESETS.map((preset) => (
                  <Chip
                    key={preset}
                    label={preset}
                    size="small"
                    variant={
                      formData.role_name === preset ? "filled" : "outlined"
                    }
                    color={
                      formData.role_name === preset ? "primary" : "default"
                    }
                    onClick={() => handleSelectPreset(preset)}
                    className="role-quick-chip"
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

        {/* Description */}
        <TextField
          fullWidth
          label="Role Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="Briefly describe the responsibilities and scope of this role..."
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
            Role Assignment Tip
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.82rem">
            Once saved, permissions can be mapped specifically to this role in the
            Permissions Console.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box className="role-drawer-footer">
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
            minWidth: 120,
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : isEditMode ? (
            "Update Role"
          ) : (
            "Save Role"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateRole;
