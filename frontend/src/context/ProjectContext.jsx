import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ✅ Store logged-in user
    const [leaders, setLeaders] = useState([]);
    const [projects, setProjects] = useState([]);
    const projectAPI = "http://localhost:5001/project";

    // ✅ Fetch authenticated user
    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:5001/auth/me", {
                method: "GET",
                credentials: "include",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Failed to fetch user");

            const userData = await response.json();
            console.log("✅ Authenticated user:", userData);
            setUser(userData); // ✅ Store user
        } catch (error) {
            console.error("❌ Error fetching user:", error);
        }
    };

    // Fetch project leaders from backend
    const fetchLeaders = async () => {
        try {
            const response = await fetch(`${projectAPI}/leaders`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch leaders");

            const data = await response.json();
            setLeaders(data);
        } catch (error) {
            console.error("❌ Error fetching leaders:", error.message);
        }
    };

    // Fetch projects from backend
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${projectAPI}/`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch projects");

            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("❌ Error fetching projects:", error.message);
        }
    };

    // ✅ Fetch all data on component mount
    useEffect(() => {
        fetchUser().then(() => {
            fetchLeaders();
            fetchProjects();
        });
    }, []);

    return (
        <ProjectContext.Provider value={{ user, setUser, leaders, projects, fetchProjects }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);