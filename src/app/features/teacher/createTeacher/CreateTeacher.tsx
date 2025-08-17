import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import "./CreateTeacher.css";
import { useCreateTeacher } from "../teacherApi/TeacherApi";

interface CreateTeacherProps {
    onClose: () => void;
    onTeacherCreated: (teacher: any) => void;
}

const CreateTeacher: React.FC<CreateTeacherProps> = ({
    onClose,
    onTeacherCreated,
}) => {
    const { user } = useAuth();
    const { mutate: createTeacher, isPending, isError, error } = useCreateTeacher();

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
    if (user && user.organization && user.organization !== 0) {
        setFormData((prev) => ({
            ...prev,
            organization: user.organization.toString(),
            role: user.role.toString(),
        }));
    }
}, [user]);

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
            "role",
            "city",
            "state",
            "pincode",
            "email",
        ];

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

        if (!validate()) return;

        const newTeacherPayload = {
            ...formData,
            organization: user?.organization ?? 0,
            role: Number(formData.role),
            pincode: parseInt(formData.pincode),
        };

        createTeacher(newTeacherPayload, {
            onSuccess: (data) => {
                console.log("Teacher Created Successfully:", data);
                onTeacherCreated(data);
                onClose();
            },
            onError: (err) => {
                console.error("Failed to create teacher:", err);
            },
        });
    };


    return (
        <Box className="create-teacher-container">
            <Box className="create-teacher-header">
                <Typography variant="h6">Create New Teacher</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                component="form"
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
                    { label: "Role", name: "role", type: "text" },
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
                            fullWidth
                        />
                    </Box>
                ))}
            </Box>
            <Box className="create-teacher-footer">
                <Button variant="outlined" onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    form="create-teacher-form"
                    disabled={isPending}
                >
                    {isPending ? "Creating..." : "Create Teacher"}
                </Button>
            </Box>
            {isError && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error?.message || "Failed to create teacher"}
                </Typography>
            )}
        </Box>
    );
};

export default CreateTeacher;
