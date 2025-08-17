import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { Button } from "@mui/material";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  return (
    <div className="landing">
      <div className="toolbar">
        <div className="toolbar-logo">School Management</div>
        <div className="toolbar-actions">
          <Button 
            className="toolbar-button"
            variant="contained"
            onClick={handleLoginClick}
          >
            Sign In
          </Button>
          <Button 
            className="toolbar-button primary"
            variant="contained"
            onClick={handleRegisterClick}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;