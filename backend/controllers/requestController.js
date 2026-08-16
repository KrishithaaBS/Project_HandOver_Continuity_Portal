import TakeOverRequest from "../models/TakeOverRequest.js";
import Project from "../models/Project.js";

export const createRequest = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: "A message is required" });
        }

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Create a new takeover request
        const takeoverRequest = await TakeOverRequest.create({
            projectId,
            requestNotes: message,
            requesterId: req.user.userId,
        });

        res.status(201).json({ success: true, data: takeoverRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating takeover request", error: error.message });
    }
};

//owner to view requests for their project
export const getRequests = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only the Project Owner and Admin can view requests for this project" });
        }
        const takeoverRequests = await TakeOverRequest.find({ projectId: projectId }).populate('requesterId', 'username email');
        if (!takeoverRequests) {
            return res.status(404).json({ success: false, message: "No takeover requests found for this project" });
        }
        res.status(200).json({ success: true, data: takeoverRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching takeover requests", error: error.message });
    }
};

export const ViewPendingRequests = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only Admin can view all pending takeover requests" });
        }
        const takeoverRequests = await TakeOverRequest.find({ status: 'pending' }).populate('projectId', 'title').populate('requesterId', 'username email');
        res.status(200).json({ success: true, data: takeoverRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching pending takeover requests", error: error.message });
    }
};

export const ViewMyRequests = async (req, res) => {
    try {
        const takeoverRequests = await TakeOverRequest.find({ requesterId: req.user.userId }).populate('project');
        if (!takeoverRequests) {
            return res.status(404).json({ success: false, message: "No takeover requests found" });
        }
        res.status(200).json({ success: true, data: takeoverRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching takeover requests", error: error.message });
    }
};

export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await TakeOverRequest.findById(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        const project = await Project.findById(request.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only the Project Owner and Admin can edit this request" });
        }
        const { status, responseNotes } = req.body;
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: "This request has already been reviewed" });
        }

        request.status = status;
        request.reviewedBy = req.user.userId;
        request.reviewedAt = new Date();
        request.reviewNotes = responseNotes || '';

        if (status === 'approved') {
            request.accessGranted = true;
            request.accessGrantedAt = new Date();
        }

        await request.save();

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating request", error: error.message });
    }
};



