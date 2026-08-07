import mongoose from 'mongoose';

const meetingLogSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    meetingTitle: {
        type: String,
        required: true,
        trim: true,
    },
    meetingDate: {
        type: Date,
        required: true,
    },
    attendees: {
        type: [String],
        default: [],
    },
    notes: {
        type: String,
        required: true,
    },
},{ timestamps: true });

//Group meeting logs by projectId, and within each project, arrange them by meetingDate from newest to oldest
meetingLogSchema.index({ projectId: 1, meetingDate: -1 });

const MeetingLog = mongoose.model('MeetingLog', meetingLogSchema);

export default MeetingLog;