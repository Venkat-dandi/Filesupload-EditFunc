import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TaskList = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage and filter by project ID
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const projectTasks = storedTasks.filter(task => task.projectId === Number(projectId));
    setTasks(projectTasks);
  }, [projectId]);

  //const assignedTasks = tasks.filter(task => task.assignedTo === user.username || user.role === "Team Leader");
  const assignedTasks = user?.role === "Member"
  ? tasks.filter(task => task.assignedTo === user.username) // ✅ Only tasks assigned to the logged-in Member
  : tasks; // ✅ Team Leaders see all tasks in the project

  const deleteTask = (taskId) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <div className="p-8 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-4">Tasks for Project {projectId}</h1>

      {assignedTasks.length === 0 ? (
        <p className="text-gray-400">No tasks added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedTasks.map(task => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{task.name}</h2>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-sm mt-2"><strong>Assigned to:</strong> {task.assignedTo}</p>
              <p className="text-sm"><strong>Deadline:</strong> {task.deadline}</p>
              <p className="text-sm"><strong>Status:</strong> {task.status}</p>

              {user.role === "Team Leader" && (
                <>
                  <Link to={`/edit-task/${task.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2 inline-block">
                    Edit Task
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mt-2 inline-block ml-2"
                  >
                    Delete Task
                  </button>
                </>
              )}

              {user.role === "Member" && (
                <div className="mt-2">
                  <label className="block text-sm">Update Status:</label>
                  <select
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
