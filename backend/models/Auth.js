const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: /\S+@\S+\.\S+/, 
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'worker', 'contractor', 'admin'],
            default: 'user'
        },
    },
    { timestamps: true }
);

// Hash password before saving
AuthSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

AuthSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

module.exports = mongoose.model('Auth', AuthSchema);
