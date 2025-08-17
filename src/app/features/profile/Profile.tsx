// Profile.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Avatar,
    Box
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

interface ProfileProps {
    open: boolean;
    onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ open, onClose }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                    <Avatar sx={{ width: 64, height: 64, mb: 2 }}>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="h6">{user?.email || 'User'}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleLogout} color="primary" variant="contained">
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Profile;