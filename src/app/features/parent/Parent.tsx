import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Container,
} from "@mui/material";
import CreateParent from "./createParent/CreateParent";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import "./Parent.css";

const Parent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editParent, setEditParent] = useState<any>(null);
  const { user } = useAuth();

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setEditParent(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleEditClick = (parent: any) => {
    setEditParent(parent);
    setDrawerOpen(true);
  };

  return (
    <Box className="teacher-page">
     <div className="teacher-header">
        <Typography variant="h4" gutterBottom>
          Parents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDrawer}
        >
          Register Parent
        </Button>
      </div>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Parent table commented out since we don't have data */}
        {/* <TableContainer component={Paper}>
          <Table sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>ID</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Name</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Email</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Relation</TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No parent data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
        
        <Typography variant="body1" color="textSecondary" sx={{ 
          textAlign: 'center', 
          mt: 4 
        }}>
          Parent data will appear here once the API is connected
        </Typography>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <CreateParent
          onClose={handleCloseDrawer}
          onParentCreated={() => window.location.reload()}
          parentData={editParent}
        />
      </Drawer>
    </Box>
  );
};

export default Parent;