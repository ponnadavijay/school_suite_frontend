import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useStudents } from "../student/studentApi/StudentApi";
import { useParents } from "../parent/parentApi/parentApi";
import { useGetAllTeachers } from "../teacher/teacherApi/TeacherApi";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const organizationId = user?.organization?.org_id;
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

  // track expanded selections
  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  useEffect(() => {
    if (expandedClass) {
      const firstSection = classSectionWise.find(
        (cls) => cls.classId === expandedClass
      );
      if (firstSection) {
        setExpandedSection(`${firstSection.classId}-${firstSection.section}`);
      }
    } else {
      setExpandedSection(null);
    }
  }, [expandedClass, classSectionWise]);

  useEffect(() => {
    if (classSectionWise.length > 0 && !expandedClass) {
      const firstClassId = classSectionWise[0].classId;
      setExpandedClass(firstClassId);
      const firstSection = classSectionWise.find(
        (cls) => cls.classId === firstClassId
      );
      if (firstSection) {
        setExpandedSection(`${firstSection.classId}-${firstSection.section}`);
      }
    }
  }, [classSectionWise, expandedClass]);

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const classList = Array.from({ length: 10 }, (_, i) => ({
    classId: i + 1,
    className: `${getOrdinal(i + 1)} Class`,
  }));

  return (
    <div className="dashboard-container">
      <div className="greeting-text">Hello, {user?.organization?.org_name}</div>
      <div className="subtitle-text">
        Track and manage your teachers, students, and attendance.
      </div>

      <div className="section-title">Key Metrics</div>
      <div className="cards-container">
        {[
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
            title: "Total Parents",
            count: counts.parents,
            icon: <FamilyRestroomIcon className="card-icon" />,
            bgColor: "#2A1989",
            path: "/parent",
          },
        ].map((card) => (
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
                  <div className="card-title" style={{ color: card.bgColor }}>
                    {card.title}
                  </div>
                  <div className="card-value" style={{ color: card.bgColor }}>
                    {card.count}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      <Divider className="divider" />

      <div className="section-sub-title">Class & Section-wise Attendance</div>

      <div className="class-buttons">
        {classList.map((cls) => (
          <Button
            key={cls.classId}
            variant={expandedClass === cls.classId ? "contained" : "outlined"}
            color="primary"
            onClick={() =>
              setExpandedClass(expandedClass === cls.classId ? null : cls.classId)
            }
          >
            {cls.className}
          </Button>
        ))}
      </div>

      {expandedClass && (
        <div>
          <div className="section-buttons">
            {classSectionWise
              .filter((cls) => cls.classId === expandedClass)
              .map((cls) => {
                const key = `${cls.classId}-${cls.section}`;
                const isExpanded = expandedSection === key;
                return (
                  <Button
                    key={key}
                    variant={isExpanded ? "contained" : "outlined"}
                    onClick={() => setExpandedSection(isExpanded ? null : key)}
                    style={{ minWidth: "120px", textTransform: "none" }}
                  >
                    {cls.section} Section
                  </Button>
                );
              })}
          </div>

          {expandedSection && (
            <div className="section-cards-row">
              {(() => {
                const cls = classSectionWise.find(
                  (c) => `${c.classId}-${c.section}` === expandedSection
                );
                if (!cls) return null;
                return [
                  {
                    title: "Total Students",
                    count: cls.total,
                    icon: <PeopleIcon className="card-icon" />,
                    bgColor: "#2A1989",
                  },
                  {
                    title: "Present Students",
                    count: cls.present,
                    icon: <CheckCircleIcon className="card-icon" />,
                    bgColor: "#13b11bff",
                  },
                  {
                    title: "Absent Students",
                    count: cls.absent,
                    icon: <CancelIcon className="card-icon" />,
                    bgColor: "#ff202f",
                  },
                ].map((card) => (
                  <div key={card.title} className="dashboard-card">
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
                            style={{ color: card.bgColor }}
                          >
                            {card.title}
                          </div>
                          <div
                            className="card-value"
                            style={{ color: card.bgColor }}
                          >
                            {card.count}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
