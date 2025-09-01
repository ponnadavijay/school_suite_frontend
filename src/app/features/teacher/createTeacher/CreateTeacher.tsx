import React, { useState, useEffect } from "react";
import { Box, Button, TextField, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import "./CreateTeacher.css";
import { useCreateTeacher, useUpdateTeacher } from "../teacherApi/TeacherApi";
import { toast } from "react-toastify";

interface CreateTeacherProps {
  onClose: () => void;
  onTeacherCreated: (teacher: any) => void;
  teacherData?: any;
}

const CreateTeacher: React.FC<CreateTeacherProps> = ({
  onClose,
  onTeacherCreated,
  teacherData,
}) => {
  const { user } = useAuth();
  const { mutate: createTeacher, isPending: isCreating, error: createError } = useCreateTeacher();
  const { mutate: updateTeacher, isPending: isUpdating, error: updateError } = useUpdateTeacher();

  const isEditMode = !!teacherData;
  const error = isEditMode ? updateError : createError;

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
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    if (apiError) {
      setApiError("");
    }
  }, [formData]);

  useEffect(() => {
    if (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.data) {
            const parsedData =
              typeof errorData.data === "string"
                ? JSON.parse(errorData.data.replace(/'/g, '"'))
                : errorData.data;

            if (parsedData.email) {
              setErrors((prev) => ({ ...prev, email: parsedData.email[0] }));
            } else {
              setApiError("An error occurred. Please try again.");
            }
          } else {
            setApiError(errorData.message || "An error occurred. Please try again.");
          }
        } catch (e) {
          setApiError("An error occurred. Please try again.");
        }
      } else {
        setApiError("An error occurred. Please try again.");
      }
    }
  }, [error]);

  useEffect(() => {
    if (isEditMode && teacherData) {
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
        role: teacherData.role?.toString() || user?.role?.role_id?.toString() || "",
        organization:
          teacherData.organization?.toString() ||
          user?.organization?.org_id?.toString() ||
          "",
      });
    } else if (user?.organization?.org_id) {
      setFormData((prev) => ({
        ...prev,
        organization: user.organization.org_id.toString(),
        role: user.role.role_id.toString(),
      }));
    }
  }, [teacherData, isEditMode, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof typeof formData)[] = [
      "name",
      "qualification",
      "mobile_no",
      "whatsapp_no",
      "address_1",
      "city",
      "state",
      "pincode",
      "email",
    ];

    if (!isEditMode) {
      requiredFields.push("role");
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.mobile_no && !/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Must be 10 digits";
    }
    if (formData.whatsapp_no && !/^\d{10}$/.test(formData.whatsapp_no)) {
      newErrors.whatsapp_no = "Must be 10 digits";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Must be 6 digits";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    const payload = {
      ...formData,
      organization: user?.organization?.org_id ?? 0,
      role: Number(formData.role || user?.role?.role_id),
      pincode: parseInt(formData.pincode),
    };

    if (isEditMode) {
      updateTeacher(
        { teacher_id: teacherData.teacher_id, ...payload },
        {
          onSuccess: (data) => {
            toast.success("Teacher updated successfully ✅");
            onTeacherCreated(data);
            onClose();
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update teacher ❌"
            );
          },
        }
      );
    } else {
      createTeacher(payload, {
        onSuccess: (data) => {
          toast.success("Teacher created successfully ✅");
          onTeacherCreated(data);
          onClose();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create teacher ❌"
          );
        },
      });
    }
  };

  const formFields = [
    { label: "Full Name", name: "name", type: "text" },
    { label: "Qualification", name: "qualification", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Mobile Number", name: "mobile_no", type: "text", maxLength: 10 },
    { label: "WhatsApp Number", name: "whatsapp_no", type: "text", maxLength: 10 },
    { label: "Address Line 1", name: "address_1", type: "text" },
    { label: "Address Line 2", name: "address_2", type: "text" },
    ...(!isEditMode ? [{ label: "Role (ID)", name: "role", type: "text" }] : []),
    { label: "City", name: "city", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "Pincode", name: "pincode", type: "text", maxLength: 6 },
  ];

  return (
    <Box className="create-teacher-container">
      <Box className="create-teacher-header">
        <div>
          {isEditMode ? "Update Teacher" : "Create New Teacher"}
        </div>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        id="create-teacher-form"
        className="create-teacher-form"
      >
        {formFields.map((field) => (
          <Box key={field.name} mb={2}>
            <TextField
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name as keyof typeof formData] || ""}
              onChange={handleChange}
              error={!!errors[field.name]}
              helperText={errors[field.name] || ""}
              required={!isEditMode || field.name !== "role"}
              inputProps={field.maxLength ? { maxLength: field.maxLength } : undefined}
              fullWidth
            />
          </Box>
        ))}
      </Box>
      <Box className="create-teacher-footer">
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="create-teacher-form"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Teacher"
              : "Create Teacher"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTeacher;
