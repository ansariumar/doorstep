const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    duration: {
        type: Number, // e.g., "1 hour", "30 minutes"
    },
    available: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Service', serviceSchema);