import type { RouteObject } from "react-router";
import AdminPage from "../pages/AdminPage";
import RolesPage from "../pages/RolesPage";
import PermissionsPage from "../pages/PermissionsPage";
import TenantsPage from "../pages/TenantsPage";

const AdminRoutes: RouteObject[] = [
  {
    index: true,
    element: <AdminPage />,
  },
  {
    path: "roles",
    element: <RolesPage />,
  },
  {
    path: "permissions",
    element: <PermissionsPage />,
  },
  {
    path: "tenants",
    element: <TenantsPage />,
  },
];

export default AdminRoutes;
