import Meeting from "../models/MeetingLog.js";
import Project from "../models/Project.js";

export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching meetings", error: error.message });
    }
};

export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Meeting ID is required" });
        }
        const meeting = await Meeting.findById(id);
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }
        res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching meeting", error: error.message });
    }
};

export const getMeetingsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        const meetings = await Meeting.find({ projectId });
        if (!meetings) {
            return res.status(404).json({ success: false, message: "No meetings found for this project" });
        }
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching meetings", error: error.message });
    }
};

export const createMeeting = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only create meetings for your own projects" });
        }
        const { meetingTitle, meetingDate, attendees, notes } = req.body;
        if (!meetingTitle || !notes || !meetingDate ) {
            return res.status(400).json({ success: false, message: "Meeting title, description, date are required" });
        }
        const meeting = await Meeting.create({ projectId, meetingTitle, meetingDate, attendees, notes });
        res.status(201).json({ success: true, data: meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating meeting", error: error.message });
    }
};

export const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById(id);
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }
        const project = await Project.findById(meeting.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only edit meetings on your own projects" });
        }
        const updated = await Meeting.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating meeting", error: error.message });
    }
};

export const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById(id);
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }
        const project = await Project.findById(meeting.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (req.user.userId !== project.owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only delete meetings on your own projects" });
        }
        await Meeting.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Meeting deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting meeting", error: error.message });
    }
};