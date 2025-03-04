import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddTask = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [members, setMembers] = useState([]);
  const [assignedMember, setAssignedMember] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Dummy members list (this should come from a database in a real app)
    setMembers([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName || !description || !assignedMember || !deadline) {
      alert("Please fill all fields!");
      return;
    }

    const newTask = {
      id: Date.now(),
      projectId: Number(projectId), // ✅ Associate task with project
      name: taskName,
      description,
      assignedTo: assignedMember,
      deadline,
      status: "Pending",
    };

    // ✅ Store in localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate(`/tasks/${projectId}`); // ✅ Redirect to View Tasks page
    }, 1000);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      {success && <p className="text-green-500 mb-4">Task added successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Task Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Assign to Member</label>
          <select
            className="w-full p-2 border rounded"
            value={assignedMember}
            onChange={(e) => setAssignedMember(e.target.value)}
            required
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>{member.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
