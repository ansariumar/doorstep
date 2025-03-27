const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },
    bookings: [{
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        time: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            default: 'Pending'
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);