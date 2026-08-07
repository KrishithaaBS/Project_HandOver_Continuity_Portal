import mongoose from 'mongoose';

const takeOverRequestSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestNotes: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    reviewNotes: {
        type: String,
        default: '',
    },
    accessGranted: {
        type: Boolean,
        default: false,
    },
    accessGrantedAt: {
        type: Date,
        default: null,
    }
},{ timestamps: true });

const TakeOverRequest = mongoose.model('TakeOverRequest', takeOverRequestSchema);

export default TakeOverRequest;