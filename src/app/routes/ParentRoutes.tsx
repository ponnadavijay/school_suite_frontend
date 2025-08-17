import type { RouteObject } from "react-router";
import ParentPage from "../pages/ParentPage";
import CreateParent from "../features/parent/createParent/CreateParent";

const ParentRoutes: RouteObject[] = [
  {
    index: true,
    element: <ParentPage />
  },
  {
    path: "create-parent",
    element: <CreateParent />
  },
];

export default ParentRoutes;
