import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import {
  Tenant,
  TenantCreateModel,
  TenantUpdateModel,
} from "../../adminApi/AdminApi";
import "./CreateTenant.css";

interface CreateTenantProps {
  onClose: () => void;
  onSubmit: (data: TenantCreateModel | TenantUpdateModel) => void | Promise<void>;
  tenantData?: Tenant | null;
  isLoading?: boolean;
}

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Canada",
  "Australia",
  "Singapore",
  "Malaysia",
  "Germany",
  "Saudi Arabia",
];

const CreateTenant: React.FC<CreateTenantProps> = ({
  onClose,
  onSubmit,
  tenantData,
  isLoading = false,
}) => {
  const isEditMode = Boolean(tenantData);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
    country: "India",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tenantData) {
      setFormData({
        name: tenantData.name || "",
        address: tenantData.address || "",
        email: tenantData.email || "",
        contact: tenantData.contact || "",
        country: tenantData.country || "India",
      });
    } else {
      setFormData({
        name: "",
        address: "",
        email: "",
        contact: "",
        country: "India",
      });
    }
    setErrors({});
  }, [tenantData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "School/Tenant name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Campus address is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && tenantData) {
      const tenantId = tenantData.id || tenantData.tenant_id;
      onSubmit({
        id: tenantId!,
        name: formData.name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        country: formData.country.trim(),
      });
    } else {
      onSubmit({
        name: formData.name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        country: formData.country.trim(),
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="tenant-drawer-container">
      {/* Header */}
      <Box className="tenant-drawer-header">
        <Box className="tenant-drawer-header-content">
          <Box className="tenant-drawer-icon-box">
            <SchoolIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography className="tenant-drawer-title">
              {isEditMode ? "Edit Institution Tenant" : "Register School Tenant"}
            </Typography>
            <Typography className="tenant-drawer-subtitle">
              {isEditMode
                ? "Update organization contact and branch details"
                : "Setup multi-tenant school partition and branch profile"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} className="tenant-drawer-close-btn" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box className="tenant-drawer-body">
        {/* School Name */}
        <TextField
          fullWidth
          label="School / Institution Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          placeholder="e.g. Cambridge International School"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Official Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          placeholder="e.g. principal@cambridgeschool.org"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Contact Number */}
        <TextField
          fullWidth
          label="Official Phone / Contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          error={Boolean(errors.contact)}
          helperText={errors.contact}
          placeholder="e.g. +91 9876543210"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Country */}
        <TextField
          select
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={Boolean(errors.country)}
          helperText={errors.country}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PublicIcon sx={{ color: "var(--primary-purple-600)" }} />
              </InputAdornment>
            ),
          }}
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        {/* Address */}
        <TextField
          fullWidth
          label="School Campus Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={Boolean(errors.address)}
          helperText={errors.address}
          multiline
          rows={3}
          placeholder="Building, Street, City, State, Postal Code..."
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                <LocationOnIcon sx={{ color: "var(--primary-purple-600)" }} />
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
            Multi-Tenancy Isolation
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.82rem">
            Each tenant institution operates on an isolated data partition. Teachers,
            students, and records will be linked exclusively to this branch.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box className="tenant-drawer-footer">
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
            "Update Institution"
          ) : (
            "Save Tenant"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTenant;
