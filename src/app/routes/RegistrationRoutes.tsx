import type { RouteObject } from "react-router";
import Registration from "../features/registration/Registration";

const RegistrationRoutes: RouteObject[] = [
  {
    path: "register",
    element: <Registration />
  },
];

export default RegistrationRoutes;
