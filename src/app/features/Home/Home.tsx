import { useLocation, useNavigate } from "react-router-dom";
import { JSX, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ProductTour from "../tour/ProductTour";

function Home(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onItemClick={handleSidebarItemClick}
        currentPath={location.pathname}
      />
      <ProductTour />
    </>
  );
}

export default Home;