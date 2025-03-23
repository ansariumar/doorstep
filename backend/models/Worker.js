const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    services:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Service',
    },
    availability: {
        type: Boolean,
        required: true,
        default: 'true'
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, { timestamps: true });


module.exports = mongoose.model('Worker', WorkerSchema);