import Project from "../models/Project.js";
import TakeOverRequest from "../models/TakeOverRequest.js";

const maskProject = (project, hasAccess) => {
    if (hasAccess) return project;
    return {
        _id: project._id,
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        status: project.status,
        tags: project.tags,
        owner: project.owner,
        hasGithubLink: !!project.githubLink,
        hasGdriveLink: !!project.gdriveLink,
    };
};

const getGrantedProjectIds = async (userId) => {
    const grants = await TakeOverRequest.find({ requesterId: userId, status: "approved", accessGranted: true });
    return grants.map((g) => g.projectId.toString()); 
};

export const getAllProjects = async (req, res) => {
    try {
        const { userId } = req.user;
        const isAdmin = req.user.role === "admin";
        const projects = await Project.find();
        const grantedIds = isAdmin ? [] : await getGrantedProjectIds(userId);

        const data = projects.map((project) => {
            const isOwner = project.owner.toString() === userId;
            const hasAccess = isAdmin || isOwner || grantedIds.includes(project._id.toString());
            return maskProject(project, hasAccess);
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching projects", error: error.message });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const { userId } = req.user;
        const isAdmin = req.user.role === "admin";
        const isOwner = project.owner.toString() === userId;
        let hasAccess = isAdmin || isOwner;
        //check only if the user is not admin or owner, to avoid unnecessary query
        if (!hasAccess) {
            hasAccess = await TakeOverRequest.exists({
                projectId: project._id,
                requesterId: userId,
                status: "approved",
                accessGranted: true,
            });
        }

        res.status(200).json({ success: true, data: maskProject(project, hasAccess) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching project", error: error.message });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.userId });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching my projects", error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const {title, description, techStack, githubLink, gdriveLink, status, tags} = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }const owner = req.user.userId; // Assuming you have user authentication and the user ID is available in req.user
        const project = await Project.create({ title, description, techStack, githubLink, gdriveLink, status, tags, owner });
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating project", error: error.message });
    }
};

// mistake done: order. first find the project, then check if the user is the owner or admin, then update it. therefore, cant use findByIdAndUpdate, instead use findById, check, then save.
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only edit your own projects" });
        }
        const updated =await Project.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating project", error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only delete your own projects" });
        }
        await Project.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting project", error: error.message });
    }
};
