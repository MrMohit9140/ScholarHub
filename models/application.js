const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        scholarshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scholarship",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Not Applied",
                "Applied",
                "Under Review",
                "Selected",
                "Rejected"
            ],
            default: "Not Applied"
        },

        appliedAt: {
            type: Date
        },

        notes: {
            type: String
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);