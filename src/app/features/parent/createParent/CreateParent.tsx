import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import "./CreateParent.css";
import { useCreateParent } from "../parentApi/parentApi";

interface CreateParentProps {
  onClose: () => void;
  onParentCreated: (parent: any) => void;
}

const relationOptions = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Sister", label: "Sister" },
  { value: "Brother", label: "Brother" },
  { value: "Guardian", label: "Guardian" },
];

const CreateParent: React.FC<CreateParentProps> = ({ onClose, onParentCreated }) => {
  const { user } = useAuth();
  const { mutate: createParent, isPending, isError, error } = useCreateParent();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relation: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    pincode: "",
    mobile_no: "",
    whatsapp_no: "",
    organization: "",
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.organization) {
      setFormData(prev => ({
        ...prev,
        organization: user.organization.toString(),
        role: "5", // Assuming 5 is the parent role
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "name", "email", "relation", "address_1", "city", 
      "state", "pincode", "mobile_no", "whatsapp_no"
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.mobile_no && !/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Must be 10 digits";
    }
    if (formData.whatsapp_no && !/^\d{10}$/.test(formData.whatsapp_no)) {
      newErrors.whatsapp_no = "Must be 10 digits";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      organization: Number(formData.organization),
      role: Number(formData.role),
      pincode: Number(formData.pincode),
    };

    createParent(payload, {
      onSuccess: (data) => {
        onParentCreated(data);
        onClose();
      },
    });
  };

  return (
    <Box className="create-parent-container">
      <Box className="create-parent-header">
        <Typography variant="h6">Create New Parent</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} className="create-parent-form">
        {[
          { label: "Full Name", name: "name", type: "text", maxLength: 200 },
          { label: "Email", name: "email", type: "email", maxLength: 254 },
          { 
            label: "Relation", 
            name: "relation", 
            type: "select",
            options: relationOptions 
          },
          { label: "Mobile Number", name: "mobile_no", type: "text", maxLength: 10 },
          { label: "WhatsApp Number", name: "whatsapp_no", type: "text", maxLength: 10 },
          { label: "Address Line 1", name: "address_1", type: "text", maxLength: 200 },
          { label: "Address Line 2", name: "address_2", type: "text", maxLength: 200, required: false },
          { label: "City", name: "city", type: "text", maxLength: 200 },
          { label: "State", name: "state", type: "text", maxLength: 200 },
          { label: "Pincode", name: "pincode", type: "text", maxLength: 6 },
        ].map((field) => (
          <Box key={field.name} mb={2}>
            {field.type === "select" ? (
              <TextField
                select
                label={field.label}
                name={field.name}
                value={formData[field.name as keyof typeof formData] || ""}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name] || ""}
                fullWidth
                required
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData] || ""}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name] || ""}
                required={field.required !== false}
                inputProps={{ maxLength: field.maxLength }}
                fullWidth
              />
            )}
          </Box>
        ))}
      </Box>

      <Box className="create-parent-footer">
        <Button variant="outlined" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          form="create-parent-form"
        >
          {isPending ? "Creating..." : "Create Parent"}
        </Button>
      </Box>

      {isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error?.message || "Failed to create parent"}
        </Typography>
      )}
    </Box>
  );
};

export default CreateParent;