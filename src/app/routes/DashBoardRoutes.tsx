import type { RouteObject } from "react-router";
import DashBoardPage from "../pages/DashBoardPage";

const DashBoardRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashBoardPage />,
  },
];

export default DashBoardRoutes;