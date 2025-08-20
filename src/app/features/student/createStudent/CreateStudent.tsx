import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import "./CreateStudent.css";

interface CreateStudentProps {
    onClose: () => void;
    onStudentCreated: (student: any) => void;
}

const CreateStudent: React.FC<CreateStudentProps> = ({
    onClose,
    onStudentCreated,
}) => {
    const { user } = useAuth();
    const { mutate: registerStudent, isPending, isError, error } = useRegisterStudent();

    const [formData, setFormData] = useState({
        name: "",
        parent: "",
        class_room: "",
        role: "",
        organization: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user && user.organization) {
            setFormData((prev) => ({
                ...prev,
                organization: user.organization.toString(),
                role: "4",
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
            "parent",
            "class_room",
            "role",
            "organization"
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = "This field is required";
            }
        });

        if (formData.name && formData.name.length > 200) {
            newErrors.name = "Name must be less than 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const studentPayload = {
            name: formData.name,
            parent: Number(formData.parent),
            class_room: Number(formData.class_room),
            role: Number(formData.role),
            organization: Number(formData.organization),
        };

        registerStudent(studentPayload, {
            onSuccess: (data) => {
                console.log("Student Registered Successfully:", data);
                onStudentCreated(data);
                onClose();
            },
            onError: (err) => {
                console.error("Failed to register student:", err);
            },
        });
    };

    return (
        <Box className="create-student-container">
            <Box className="create-student-header">
                <div>Register New Student</div>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                id="create-student-form"
                className="create-student-form"
            >
                {[
                    { label: "Full Name", name: "name", type: "text", maxLength: 200 },
                    { label: "Parent ID", name: "parent", type: "number" },
                    { label: "Class Room ID", name: "class_room", type: "number" },
                    { label: "Role ID", name: "role", type: "number", disabled: true },
                    { label: "Organization ID", name: "organization", type: "number", disabled: true },
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
                            disabled={field.disabled || false}
                            inputProps={field.maxLength ? { maxLength: field.maxLength } : undefined}
                            fullWidth
                        />
                    </Box>
                ))}
            </Box>
            <Box className="create-student-footer">
                <Button variant="outlined" onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    form="create-student-form"
                    disabled={isPending}
                >
                    {isPending ? "Registering..." : "Register Student"}
                </Button>
            </Box>
            {isError && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error?.message || "Failed to register student"}
                </Typography>
            )}
        </Box>
    );
};

export default CreateStudent;