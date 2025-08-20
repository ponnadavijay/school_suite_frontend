import type { RouteObject } from "react-router";
import LoginPageRoutes from "./LoginPageRoutes";
import RegistrationRoutes from "./RegistrationRoutes";
import DashBoardRoutes from "./DashBoardRoutes";
import TeacherRoutes from "./TeacherRoutes";
import LoginPage from "../features/loginPage/LoginPage";
import StudentRoutes from "./StudentRoutes";
import ParentRoutes from "./ParentRoutes";
import Dashboard from "../features/dashboard/DashBoard";
import Home from "../features/Home/Home";
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
      path: "/",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
          children: DashBoardRoutes,
        },
        {
          path: "teacher",
          children: TeacherRoutes,
        },
        {
          path: "student",
          children: StudentRoutes,
        },
        {
          path: "parent",
          children: ParentRoutes,
        },
      ],
    },
  ];
};

export default createRoutes;