const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
    try{
        if(req.user.role !== "Manager"){
            return res.status(401).json({message: "Access Denied. Only accessible to Managers"});
        }

        const {name, description, projectLeader, deadline} = req.body;

        const formattedDeadline = new Date(deadline);

        const project = new Project({name, description, managerId: req.user.id, projectLeader, deadline: formattedDeadline});

        await project.save();
        res.status(201).json({message: "Project created successfully", project});
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}

const getProjects = async (req, res) => {
    try{
        let projects;

        if (req.user.role === "Manager") {
            projects = await Project.find({ managerId: req.user.id }).populate("projectLeader");
        } 
        else if (req.user.role === "Project Leader") {
            projects = await Project.find({ projectLeader: req.user.id }).populate("projectLeader");
        } 
        else {
            return res.status(403).json({ message: "Access Denied" });
        }
        
        res.status(201).json(projects);
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}

const getProjectLeaders = async (req, res) => {
    try{
        if(req.user.role !== "Manager"){
            return res.status(401).json({message: "Access Denied. Only accessible to Managers"});
        }

        const leaders = await User.find({role: "Project Leader"}).select("name _id");
        res.json(leaders);
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}
const updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, projectLeader, deadline } = req.body;
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { name, description, projectLeader, deadline },
        { new: true }
      );
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (err) {
      res.status(500).json({ message: "Server Error", err });
    }
  };

module.exports = {createProject, getProjects, getProjectLeaders, updateProject};