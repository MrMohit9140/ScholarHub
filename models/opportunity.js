const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "scholarship",
                "internship",
                "course",
                "competition",
                "hackathon",
                "fellowship",
                "leadership"
            ],
            required: true
        },

        provider: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        educationLevels: [String],

        fields: [String],

        courses: [String],

        states: [String],

        categories: [String],

        minPercentage: {
            type: Number,
            default: 0
        },

        minCGPA: {
            type: Number,
            default: 0
        },

        maxIncome: {
            type: Number,
            default: null
        },

        startDate: Date,

        deadline: Date,

        officialLink: {
            type: String,
            required: true
        },

        requiredDocuments: [String],

        source: String,

        verified: {
            type: Boolean,
            default: false
        },

        featured: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Opportunity",
    opportunitySchema
);