import type { RouteObject } from "react-router";
import StudentPage from "../pages/StudentPage";
import CreateStudent from "../features/student/createStudent/CreateStudent";
import AttendancePage from "../pages/AttendancePage";

const StudentRoutes: RouteObject[] = [
  {
    index: true,
    element: <StudentPage />
  },
  {
    path: "create-student",
    element: <CreateStudent />
  },
  {
    path: "attandance",
    element: <AttendancePage defaultTab="student" />
  },
  {
    path: "attendance",
    element: <AttendancePage defaultTab="student" />
  },
];

export default StudentRoutes;
