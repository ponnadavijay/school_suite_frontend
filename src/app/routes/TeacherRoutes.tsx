import type { RouteObject } from "react-router";
import TeacherPage from "../pages/TeacherPage";
import CreateTeacher from "../features/teacher/createTeacher/CreateTeacher";

const TeacherRoutes: RouteObject[] = [
  {
    index: true,
    element: <TeacherPage />
  },
  {
    path: "create-teacher",
    element: <CreateTeacher />
  },
];

export default TeacherRoutes;
