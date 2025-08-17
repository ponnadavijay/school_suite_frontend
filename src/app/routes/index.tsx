import type { RouteObject } from "react-router";
import LoginPageRoutes from "./LoginPageRoutes";
import RegistrationRoutes from "./RegistrationRoutes";
import DashBoardRoutes from "./DashBoardRoutes";
import TeacherRoutes from "./TeacherRoutes";
import DashBoardPage from "../pages/DashBoardPage";
import LoginPage from "../features/loginPage/LoginPage";
import StudentRoutes from "./StudentRoutes";
import ParentRoutes from "./ParentRoutes";
import PrivateRoute from "./PrivateRoute";

const createRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      children: [
        { index: true, element: <LoginPage /> },
        ...RegistrationRoutes,
        ...LoginPageRoutes,
      ],
    },
    {
      path: "dashboard",
      element: (
        <PrivateRoute>
          <DashBoardPage />
        </PrivateRoute>
      ),
      children: DashBoardRoutes,
    },
    {
      path: "teacher",
      element: (
        <PrivateRoute>
          <DashBoardPage />
        </PrivateRoute>
      ),
      children: TeacherRoutes,
    },
    {
      path: "student",
      element: (
        <PrivateRoute>
          <DashBoardPage />
        </PrivateRoute>
      ),
      children: StudentRoutes,
    },
    {
      path: "parent",
      element: (
        <PrivateRoute>
          <DashBoardPage />
        </PrivateRoute>
      ),
      children: ParentRoutes,
    },
  ];
};

export default createRoutes;