import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = ({ projects, updateProject }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectToEdit = projects.find((project) => project.id === Number(id));

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLeaders([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ]);
    if (projectToEdit) {
      setProjectName(projectToEdit.name || "");
      setDescription(projectToEdit.description || "");
      setSelectedLeader(projectToEdit.assignedTo || "");
      setDeadline(projectToEdit.deadline || "");
    }
  }, [projectToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProject = {
      ...projectToEdit, // Preserve all existing properties
      name: projectName,
      description,
      assignedTo: selectedLeader,
      deadline,
    };

    updateProject(updatedProject);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate("/projects");
    }, 1000);
  };

  if (!projectToEdit) {
    return <p className="text-red-500">Project not found!</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      {success && <p className="text-green-500 mb-4">Project updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          <label className="block text-gray-700">Assign to Project Leader</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedLeader}
            onChange={(e) => setSelectedLeader(e.target.value)}
            required
          >
            <option value="">Select Leader</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.name}>{leader.name}</option>
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
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
