import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({children}) => {
    const [leaders, setLeaders] = useState([]);
    const [projects, setProjects] = useState([]);
    const projectAPI = "http://localhost:5001/project";

    // Fetch project leaders from backend
    const fetchLeaders = async () => {
        try{
            const response = await fetch(`${projectAPI}/leaders`, {
                method: "GET",
                credentials: "include"
            });

            if(!response.ok){
                throw new Error("Failed to fetch leaders");
            }

            const data = await response.json();
            setLeaders(data);
        }
        catch (error) {
            console.error("Error fetching leaders:", error.message);
        }
    }

    //Fetch projects from backend
    const fetchProjects = async () => {
        try{
            const response = await fetch(`${projectAPI}/`,{
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();
            setProjects(data);
        }
        catch (error) {
            console.error("Error fetching projects:", error.message);
        }
    }

    //Create new project
    const createProject = async (projectData) => {
        try {
            const response = await fetch(`${projectAPI}/createProject`, {
                method: "POST",
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Send token
                body: projectData, // ✅ Use FormData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Project creation failed");
            }
    
            const newProject = await response.json();
            setProjects((prevProjects) => [...prevProjects, newProject.project]);
    
            return true;
        } catch (error) {
            console.error("Error creating project:", error.message);
            return false;
        }
    };
    
    
    

    //edit project
    const updateProject = async (updatedProject) => {
        try {
          const response = await fetch(`${projectAPI}/updateProject/${updatedProject._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedProject),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Project update failed");
          }
          const data = await response.json();
          setProjects((prevProjects) =>
            prevProjects.map((project) => (project._id === data._id ? data : project))
          );
          return true;
        } catch (error) {
          console.error("Error updating project:", error.message);
          return false;
        }
      };

    useEffect(() =>{
        fetchLeaders();
        fetchProjects();
    }, []);

    return(
        <ProjectContext.Provider value={{leaders, projects, fetchProjects, createProject, updateProject}}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProject = () => useContext(ProjectContext);

