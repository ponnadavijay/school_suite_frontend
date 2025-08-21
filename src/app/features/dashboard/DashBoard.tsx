import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, Grid, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useStudents } from "../student/studentApi/StudentApi";
import { useParents } from "../parent/parentApi/parentApi";
import { useGetAllTeachers } from "../teacher/teacherApi/TeacherApi";

const Dashboard: React.FC = () => {
  const { user, organizationId } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0,
    parents: 0,
  });

  // hooks fetching raw arrays from API
  const { data: parentsData } = useParents(organizationId);
  const { data: studentsData } = useStudents(organizationId);
  const { data: teachersData } = useGetAllTeachers(organizationId);

  // safely extract counts
  useEffect(() => {
    setCounts({
      teachers: Array.isArray(teachersData) ? teachersData.length : 0,
      students: Array.isArray(studentsData) ? studentsData.length : 0,
      parents: Array.isArray(parentsData) ? parentsData.length : 0,
    });
  }, [teachersData, studentsData, parentsData]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const cards = [
    {
      title: "Teachers",
      count: counts.teachers,
      icon: <SchoolIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)",
      path: "/teacher",
    },
    {
      title: "Students",
      count: counts.students,
      icon: <PeopleIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)",
      path: "/student",
    },
    {
      title: "Parents",
      count: counts.parents,
      icon: <FamilyRestroomIcon className="card-icon" />,
      bgColor: "var(--primary-purple-500)",
      path: "/parent",
    },
  ];

  return (
    <Box className="home-container">
      <div className="greeting-text">Hello, {user?.email}</div>
      <div className="subtitle-text">
        Track and manage your teachers, students, and attendance.
      </div>

      <div>Key Metrics</div>
      <Grid container spacing={3} className="cards-grid">
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              className="dashboard-card"
              onClick={() => handleCardClick(card.path)}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s",
                },
              }}
            >
              <CardContent className="card-content">
                <div className="card-main-content">
                  <div className="card-text">
                    <div
                      className="card-icon-container"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <div className="card-title">{card.title}</div>
                    <div className="card-value-container">
                      <div className="card-value">{card.count}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
