import type { RouteObject } from "react-router";
import StudentPage from "../pages/StudentPage";
import CreateStudent from "../features/student/createStudent/CreateStudent";
import StudentAttendance from "../features/student/studentAttendance/StudentAttendance";

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
    element: <StudentAttendance />
  },
];

export default StudentRoutes;
