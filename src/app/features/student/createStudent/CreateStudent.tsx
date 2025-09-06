import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    IconButton,
    Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context/AuthContext";
import { useParents } from "../../parent/parentApi/parentApi";
import "./CreateStudent.css";

interface CreateStudentProps {
    onClose: () => void;
    onSubmit: (formData: any) => void;
    studentData?: any;
    isLoading?: boolean;
}

const CreateStudent: React.FC<CreateStudentProps> = ({
    onClose,
    onSubmit,
    studentData,
    isLoading,
}) => {
    const { user } = useAuth();
    const organizationId = user?.organization?.org_id;

    const [formData, setFormData] = useState({
        name: "",
        parent: "",
        class_room: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: parents } = useParents(organizationId);

    useEffect(() => {
        if (studentData) {
            setFormData({
                name: studentData.name || "",
                parent: studentData.parent?.parent_id || "",
                class_room: studentData.class_room?.class_id || "",
            });
        }
    }, [studentData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name as string]: value as string }));

        if (errors[name as string]) {
            setErrors((prev) => ({ ...prev, [name as string]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.parent) newErrors.parent = "Parent is required";
        if (!formData.class_room) newErrors.class_room = "Class Room is required";

        if (formData.name && formData.name.length > 200) {
            newErrors.name = "Name must be less than 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit(formData);
    };

    const isEdit = !!studentData;

    return (
        <Box className="create-student-container">
            <Box className="create-student-header">
                <div>{isEdit ? "Update Student" : "Register New Student"}</div>
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
                <Box mb={2}>
                    <TextField
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name || ""}
                        fullWidth
                        required
                        inputProps={{ maxLength: 200 }}
                    />
                </Box>

                <Box mb={2}>
                    <Autocomplete
                        options={parents || []}
                        getOptionLabel={(option: any) => option.name || ""}
                        value={
                            parents?.find((p: any) => String(p.parent_id) === String(formData.parent)) ||
                            null
                        }
                        isOptionEqualToValue={(option: any, value: any) =>
                            String(option.parent_id) === String(value.parent_id)
                        }
                        onChange={(_, newValue) => {
                            setFormData((prev) => ({
                                ...prev,
                                parent: newValue ? newValue.parent_id : null,
                            }));
                            if (errors.parent) {
                                setErrors((prev) => ({ ...prev, parent: "" }));
                            }
                        }}
                        renderOption={(props, option) => (
                            <li {...props}>
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Parent"
                                error={!!errors.parent}
                                helperText={errors.parent || ""}
                                required
                            />
                        )}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Class Room ID"
                        name="class_room"
                        type="number"
                        value={formData.class_room}
                        onChange={handleChange}
                        error={!!errors.class_room}
                        helperText={errors.class_room || ""}
                        fullWidth
                        required
                    />
                </Box>
            </Box>

            <Box className="create-student-footer">
                <Button variant="outlined" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    form="create-student-form"
                    disabled={isLoading}
                >
                    {isLoading ? (isEdit ? "Updating..." : "Registering...") : isEdit ? "Update Student" : "Register Student"}
                </Button>
            </Box>
        </Box>
    );
};

export default CreateStudent;
