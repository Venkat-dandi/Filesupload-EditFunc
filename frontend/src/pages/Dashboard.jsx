import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation(); 
  const successMessage = location.state?.message;
  const [message, setMessage] = useState(location.state?.message);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [message]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-8 ml-64">
        {message && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4 shadow-md w-3/4 text-center">
            {message}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Welcome, {user?.name} 
        </h1>
        <p className="text-lg mb-4 text-gray-700">Role: {user?.role}</p>
  
        {/* Role-based Content */}
        {user?.role === "Manager" && (
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-3/4 text-center">
            <h2 className="text-xl font-semibold mb-2">Project Management</h2>
            <p className="text-gray-300">You can add and assign projects.</p>
          </div>
        )}
  
        {user?.role === "Project Leader" && (
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-3/4 text-center">
            <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
            <p className="text-gray-300">You can view and manage assigned projects.</p>
          </div>
        )}
  
        {user?.role === "Team Member" && (
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-3/4 text-center">
            <h2 className="text-xl font-semibold mb-2">Task List</h2>
            <p className="text-gray-300">You can view and update your tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Dashboard;
