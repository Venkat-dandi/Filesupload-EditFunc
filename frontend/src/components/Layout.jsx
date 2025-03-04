import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    const location = useLocation();
  
    // Hide Sidebar on Login Page and Register
    if (location.pathname === "/" || location.pathname === "/register") {
      return <Outlet />; 
    }
  
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <Outlet /> 
        </div>
      </div>
    );
  };
  
  export default Layout;