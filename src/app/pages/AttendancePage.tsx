import React from "react";
import AttendanceHub from "../features/attendance/AttendanceHub";

interface AttendancePageProps {
  defaultTab?: "student" | "teacher";
}

const AttendancePage: React.FC<AttendancePageProps> = ({ defaultTab = "student" }) => {
  return (
    <div>
      <AttendanceHub defaultTab={defaultTab} />
    </div>
  );
};

export default AttendancePage;
