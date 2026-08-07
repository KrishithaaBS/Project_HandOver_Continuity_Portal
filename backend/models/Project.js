import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String],
        default: [],
    },
    githubLink: {
        type: String,
    },
    gdriveLink: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'On Hold', 'Looking for maintainer', 'Archived'],
        default: 'Active',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
},{ timestamps: true });

// Create indexes for status and tags fields to optimize queries
projectSchema.index({ status: 1 });
projectSchema.index({ tags: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;