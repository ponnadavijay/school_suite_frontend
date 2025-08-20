import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, Grid, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const counts = {
    teachers: 24,
    students: 156,
    parents: 132
  };

  const cards = [
    {
      title: "Teachers",
      count: counts.teachers,
      icon: <SchoolIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)"
    },
    {
      title: "Students",
      count: counts.students,
      icon: <PeopleIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)"
    },
    {
      title: "Parents",
      count: counts.parents,
      icon: <FamilyRestroomIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)"
    }
  ];

  return (
    <Box className="home-container">
      <div className="greeting-text">
        Hello, {user?.email}
      </div>
      <div className="subtitle-text">
        Track and manage your teachers, students, and attendance.
      </div>

      <div>Key Matrics</div>
      <Grid container spacing={3} className="cards-grid">
        {cards.map((card) => (
          <div>
            <Card className="dashboard-card">
              <CardContent className="card-content">
                <div className="card-main-content">
                  <div className="card-text">
                    <div className="card-icon-container" style={{ backgroundColor: card.bgColor }}>
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <div className="card-title">
                      {card.title}
                    </div>
                    <div className="card-value-container">
                      <div className="card-value">{card.count}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
