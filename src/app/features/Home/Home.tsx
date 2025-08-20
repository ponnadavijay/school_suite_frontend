import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";

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
    <Sidebar 
      isOpen={sidebarOpen}
      onToggleSidebar={handleToggleSidebar}
      onItemClick={handleSidebarItemClick}
      currentPath={location.pathname}
    />
  );
}

export default Home;