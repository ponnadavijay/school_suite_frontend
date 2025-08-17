import type { RouteObject } from "react-router";
import StudentPage from "../pages/StudentPage";
import CreateStudent from "../features/student/createStudent/CreateStudent";

const StudentRoutes: RouteObject[] = [
  {
    index: true,
    element: <StudentPage />
  },
  {
    path: "create-student",
    element: <CreateStudent />
  },
];

export default StudentRoutes;
