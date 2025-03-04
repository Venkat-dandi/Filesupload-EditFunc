const Task = require("../models/Task");

const createTask = async (req, res) => {
    try{
        if(req.user.role !== "Project Leader"){
            return res.status(401).json({message: "Access Denied"});
        }

        const {title, description, projectId, assignedTo, deadline} = req.body;
        const task = new Task({title, description, projectId, assignedTo, deadline});

        await task.save();
        res.status(201).json({message: "Task created successfully", task});
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}

const getTasks = async (req, res) => {
    try{
        let tasks;
        if(req.user.role === "Manager"){
            tasks = await Task.find().populate("assignedTo projectId");
        }
        else if(req.user.role === "Project Leader"){
            tasks = await Task.find({projectId: req.body.projectId}).populate("assignedTo");
        }
        else{
            tasks = await Task.find({assignedTo: req.user.id});
        }

        res.status(201).json(tasks);
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}

module.exports = {createTask, getTasks};