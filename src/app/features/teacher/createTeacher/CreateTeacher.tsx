import React, { useState, useEffect } from "react";
import { Box, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import "./CreateTeacher.css";

interface CreateTeacherProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  teacherData?: any;
  isLoading?: boolean;
}

const CreateTeacher: React.FC<CreateTeacherProps> = ({
  onClose,
  onSubmit,
  teacherData,
  isLoading
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    mobile_no: "",
    whatsapp_no: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    role: "",
    organization: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacherData) {
      setFormData({
        name: teacherData.name || "",
        qualification: teacherData.qualification || "",
        mobile_no: teacherData.mobile_no || "",
        whatsapp_no: teacherData.whatsapp_no || "",
        address_1: teacherData.address_1 || "",
        address_2: teacherData.address_2 || "",
        city: teacherData.city || "",
        state: teacherData.state || "",
        pincode: teacherData.pincode?.toString() || "",
        email: teacherData.email || "",
        role: teacherData.role?.toString() || "",
        organization: teacherData.organization?.toString() || "",
      });
    } else if (user?.organization) {
      setFormData((prev) => ({
        ...prev,
        organization: user.organization.toString(),
        role: user.role.toString(),
      }));
    }
  }, [teacherData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      role: Number(formData.role),
      pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
      organization: Number(formData.organization || user?.organization || 0),
    };
    onSubmit(payload);
  };

  const isEditMode = !!teacherData;

  return (
    <Box className="create-teacher-container">
      <Box className="create-teacher-header">
        <div>
          {isEditMode ? "Edit Teacher" : "Create New Teacher"}
        </div>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <form
        onSubmit={handleSubmit}
        id="create-teacher-form"
        className="create-teacher-form"
      >
        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Qualification", name: "qualification", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Mobile Number", name: "mobile_no", type: "text", maxLength: 10 },
          { label: "WhatsApp Number", name: "whatsapp_no", type: "text", maxLength: 10 },
          { label: "Address Line 1", name: "address_1", type: "text" },
          { label: "Address Line 2", name: "address_2", type: "text" },
          { label: "Role", name: "role", type: "text", disabled: isEditMode },
          { label: "City", name: "city", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Pincode", name: "pincode", type: "text", maxLength: 6 },
        ].map((field) => (
          <Box key={field.name} mb={2}>
            <TextField
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleChange}
              error={!!errors[field.name]}
              helperText={errors[field.name] || ""}
              required
              inputProps={field.maxLength ? { maxLength: field.maxLength } : undefined}
              disabled={field.disabled}
              fullWidth
            />
          </Box>
        ))}
      </form>
      <Box className="create-teacher-footer">
        <Button variant="outlined" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="create-teacher-form"
          disabled={isLoading}
        >
          {isEditMode
            ? isLoading
              ? "Updating..."
              : "Update Teacher"
            : isLoading
              ? "Creating..."
              : "Create Teacher"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTeacher;