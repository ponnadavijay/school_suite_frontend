import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useStudents } from "../student/studentApi/StudentApi";
import { useParents } from "../parent/parentApi/parentApi";
import { useGetAllTeachers } from "../teacher/teacherApi/TeacherApi";

const Dashboard: React.FC = () => {
  const { user, organizationId } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    teachersTotal: 0,
    teachersPresent: 0,
    teachersAbsent: 0,
    studentsTotal: 0,
    studentsPresent: 0,
    studentsAbsent: 0,
    parents: 0,
  });

  const [classSectionWise, setClassSectionWise] = useState<
    {
      classId: number;
      className: string;
      section: string;
      total: number;
      present: number;
      absent: number;
    }[]
  >([]);

  const { data: students } = useStudents(organizationId);
  const { data: parents } = useParents(organizationId);
  const { data: teachers } = useGetAllTeachers(organizationId);

  useEffect(() => {
    const defaults: {
      classId: number;
      className: string;
      section: string;
      total: number;
      present: number;
      absent: number;
    }[] = [];

    for (let classNo = 1; classNo <= 10; classNo++) {
      ["A", "B", "C", "D"].forEach((section) => {
        defaults.push({
          classId: classNo,
          className: `Class ${classNo}`,
          section,
          total: 0,
          present: 0,
          absent: 0,
        });
      });
    }

    const grouped: Record<string, any> = {};

    if (Array.isArray(students)) {
      const total = students.length;
      const present = students.filter((s) => s.is_present).length;
      const absent = total - present;

      students.forEach((s: any) => {
        const key = `${s.class_room.class_no}-${s.class_room.class_section}`;
        if (!grouped[key]) {
          grouped[key] = {
            classId: s.class_room.class_no,
            className: `Class ${s.class_room.class_no}`,
            section: s.class_room.class_section,
            total: 0,
            present: 0,
            absent: 0,
          };
        }
        grouped[key].total += 1;
        if (s.is_present) grouped[key].present += 1;
        else grouped[key].absent += 1;
      });

      setCounts((prev) => ({
        ...prev,
        studentsTotal: total,
        studentsPresent: present,
        studentsAbsent: absent,
        parents: Array.isArray(parents) ? parents.length : 0,
      }));
    }

    if (Array.isArray(teachers)) {
      const total = teachers.length;
      const present = teachers.filter((t) => t.is_present).length;
      const absent = total - present;

      setCounts((prev) => ({
        ...prev,
        teachersTotal: total,
        teachersPresent: present,
        teachersAbsent: absent,
      }));
    }

    const merged = defaults.map((def) => {
      const key = `${def.classId}-${def.section}`;
      return grouped[key] ? grouped[key] : def;
    });

    setClassSectionWise(merged);
  }, [students, teachers, parents]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const cards = [
    {
      title: "Total Teachers",
      count: counts.teachersTotal,
      icon: <SchoolIcon className="card-icon" />,
      bgColor: "#2A1989",
      path: "/teacher",
    },
    {
      title: "Present Teachers",
      count: counts.teachersPresent,
      icon: <CheckCircleIcon className="card-icon" />,
      bgColor: "#13b11bff",
      path: "/teacher",
    },
    {
      title: "Absent Teachers",
      count: counts.teachersAbsent,
      icon: <CancelIcon className="card-icon" />,
      bgColor: "#ff202f",
      path: "/teacher",
    },
    {
      title: "Total Students",
      count: counts.studentsTotal,
      icon: <PeopleIcon className="card-icon" />,
      bgColor: "#2A1989",
      path: "/student",
    },
    {
      title: "Present Students",
      count: counts.studentsPresent,
      icon: <CheckCircleIcon className="card-icon" />,
      bgColor: "#13b11bff",
      path: "/student",
    },
    {
      title: "Absent Students",
      count: counts.studentsAbsent,
      icon: <CancelIcon className="card-icon" />,
      bgColor: "#ff202f",
      path: "/student",
    },
    {
      title: "Parents",
      count: counts.parents,
      icon: <FamilyRestroomIcon className="card-icon" />,
      bgColor: "#2A1989",
      path: "/parent",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="greeting-text">Hello, {user?.email}</div>
      <div className="subtitle-text">
        Track and manage your teachers, students, and attendance.
      </div>

      <div className="section-title">Key Metrics</div>
      <div className="cards-container">
        {cards.map((card) => (
          <div
            key={card.title}
            className="dashboard-card"
            onClick={() => handleCardClick(card.path)}
          >
            <CardContent className="card-content">
              <div className="card-main-content">
                <div
                  className="card-icon-container"
                  style={{ backgroundColor: card.bgColor }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    className="card-title"
                    style={{ color: card.bgColor }} // 👈 title same color
                  >
                    {card.title}
                  </div>
                  <div
                    className="card-value"
                    style={{ color: card.bgColor }} // 👈 value same color
                  >
                    {card.count}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      <Divider className="divider" />

      <div className="section-title">Class & Section-wise Attendance</div>
      <div className="class-section-container">
        {classSectionWise.map((cls) => (
          <div key={`${cls.classId}-${cls.section}`} className="class-card">
            <CardContent>
              <div className="class-title">
                {cls.className} - {cls.section}
              </div>
              <div className="total-text">Total: <div className="class-section-value">{cls.total}</div></div>
              <div className="present-text">Present: <div className="class-section-value">{cls.present}</div></div>
              <div className="absent-text">Absent: <div className="class-section-value">{cls.absent}</div></div>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
