import type { RouteObject } from "react-router";
import Home from "../features/home/Home";

const DashBoardRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
];

export default DashBoardRoutes;