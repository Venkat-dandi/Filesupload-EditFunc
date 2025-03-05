import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-6 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-6">ManageMate</h2>

      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/projects" className="hover:text-blue-400">Projects</Link>

        {user?.role === "Manager" && (
          <Link to="/add-project" className="hover:text-blue-400">Add Project</Link>
        )}

        {user?.role === "Project Leader" && (
          <Link to="/tasks" className="hover:text-blue-400">Manage Tasks</Link>
        )}

        {user?.role === "Team Member" && (
          <Link to="/tasks" className="hover:text-blue-400">My Tasks</Link>
        )}

        <Link to="/chat" className="hover:text-green-400 font-bold">💬 Chat</Link>
      </nav>

      <button
        onClick={logout}
        className="mt-auto bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
