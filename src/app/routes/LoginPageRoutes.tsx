import type { RouteObject } from "react-router";
import LoginPage from "../features/loginPage/LoginPage";

const LoginPageRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
];

export default LoginPageRoutes;
