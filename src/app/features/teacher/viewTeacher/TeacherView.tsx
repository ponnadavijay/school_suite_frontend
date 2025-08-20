import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetOneTeacher } from "../teacherApi/TeacherApi";
import "./TeacherView.css";

const TeacherView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const teacherId = Number(id);
  const navigate = useNavigate();

  const { data: teacher, isLoading, isError } = useGetOneTeacher(teacherId);

  if (isLoading) {
    return (
      <div className="teacher-view-loading">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="teacher-view-error">
        <Typography variant="h6" color="error">
          Failed to load teacher details
        </Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="teacher-view-container">
      <Card className="teacher-view-card">
        {/* Header */}
        <div className="teacher-view-header">
          <Typography className="teacher-view-title">Teacher Details</Typography>
          <IconButton
            className="teacher-view-close"
            onClick={() => navigate(-1)}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <CardContent>
          <div className="teacher-view-fields">
            {[
              { label: "Full Name", value: teacher.name },
              { label: "Qualification", value: teacher.qualification },
              { label: "Email", value: teacher.email },
              { label: "Mobile No", value: teacher.mobile_no },
              { label: "WhatsApp No", value: teacher.whatsapp_no },
              { label: "Address Line 1", value: teacher.address_1 },
              { label: "Address Line 2", value: teacher.address_2 },
              { label: "City", value: teacher.city },
              { label: "State", value: teacher.state },
              { label: "Pincode", value: teacher.pincode },
              { label: "Role", value: teacher.role },
              { label: "Organization", value: teacher.organization },
            ].map((field) => (
              <div className="teacher-view-field" key={field.label}>
                <div className="teacher-view-label">{field.label}</div>
                <div className="teacher-view-value">
                  {field.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="teacher-view-actions">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              className="teacher-view-btn"
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                navigate(`/teachers/edit/${teacher.teacher_id}`)
              }
              className="teacher-view-btn"
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherView;
