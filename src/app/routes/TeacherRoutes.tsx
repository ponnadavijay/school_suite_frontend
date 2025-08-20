import type { RouteObject } from "react-router";
import TeacherPage from "../pages/TeacherPage";
import CreateTeacher from "../features/teacher/createTeacher/CreateTeacher";
import TeacherView from "../features/teacher/viewTeacher/TeacherView";

const TeacherRoutes: RouteObject[] = [
  {
    index: true,
    element: <TeacherPage />
  },
  {
    path: "create-teacher",
    element: <CreateTeacher />
  },
  {
    path: "/teacher/view/:id",
    element: <TeacherView />
  },
];

export default TeacherRoutes;
