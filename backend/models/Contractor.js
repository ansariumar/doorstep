const mongoose = require("mongoose");

const ContractorSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    companyName: { type: String, required: true },
    managedWorkers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Worker" 
    }],
    ongoingProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    }],
}, { timestamps: true });

module.exports = mongoose.model("Contractor", ContractorSchema);
