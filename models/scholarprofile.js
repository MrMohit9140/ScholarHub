const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        personal: {
            dateOfBirth: Date,

            gender: {
                type: String,
                enum: [
                    "Male",
                    "Female",
                    "Other",
                    "Prefer not to say"
                ]
            },

            state: String,
            district: String,

            nationality: {
                type: String,
                default: "Indian"
            },

            disability: {
                type: Boolean,
                default: false
            },

            minority: {
                type: Boolean,
                default: false
            }
        },

        education: {
            level: {
                type: String,
                enum: [
                    "School",
                    "Class 11-12",
                    "Diploma",
                    "Undergraduate",
                    "Postgraduate",
                    "PhD"
                ]
            },

            course: String,

            field: String,

            specialization: String,

            institution: String,

            institutionType: {
                type: String,
                enum: [
                    "Government",
                    "Private",
                    "Government Aided",
                    "Other"
                ]
            },

            year: Number,

            academicYear: String,

            percentage: {
                type: Number,
                min: 0,
                max: 100
            },

            cgpa: {
                type: Number,
                min: 0,
                max: 10
            }
        },

        financial: {
            incomeRange: String,

            incomeAmount: {
                type: Number,
                min: 0
            },

            incomeCertificateAvailable: {
                type: Boolean,
                default: false
            }
        },

        eligibility: {
            category: {
                type: String,
                enum: [
                    "General",
                    "EWS",
                    "OBC",
                    "SC",
                    "ST",
                    "Other",
                    "Prefer not to say"
                ]
            },

            firstGenerationStudent: {
                type: Boolean,
                default: false
            },

            singleParent: {
                type: Boolean,
                default: false
            },

            orphan: {
                type: Boolean,
                default: false
            },

            defenceWard: {
                type: Boolean,
                default: false
            },

            girlStudent: {
                type: Boolean,
                default: false
            },

            ruralStudent: {
                type: Boolean,
                default: false
            }
        },

        interests: [String]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);