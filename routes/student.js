const express = require("express");
const router = express.Router();

const StudentProfile = require("../models/scholarprofile");
const requireLogin = require("../middleware/auth");

router.get("/profile", requireLogin, async (req, res) => {

    try {

        const profile = await StudentProfile.findOne({
            userId: req.session.userId
        });

        res.render("profile", {
            profile
        });

    } catch (error) {

        console.log("Profile error:", error);

        res.status(500).send(
            "Unable to load profile."
        );
    }
});

router.post("/profile", requireLogin, async (req, res) => {

    try {

        const {
            dateOfBirth,
            gender,
            state,
            district,
            disability,
            minority,

            educationLevel,
            course,
            field,
            specialization,
            institution,
            institutionType,
            year,
            academicYear,
            percentage,
            cgpa,

            incomeRange,
            incomeAmount,
            incomeCertificateAvailable,

            category,
            firstGenerationStudent,
            singleParent,
            orphan,
            defenceWard,
            girlStudent,
            ruralStudent,

            interests
        } = req.body;


        const profileData = {

            userId: req.session.userId,

            personal: {
                dateOfBirth,
                gender,
                state,
                district,

                disability:
                    disability === "on",

                minority:
                    minority === "on"
            },

            education: {
                level: educationLevel,
                course,
                field,
                specialization,
                institution,
                institutionType,
                year: year
                    ? Number(year)
                    : undefined,

                academicYear,

                percentage: percentage
                    ? Number(percentage)
                    : undefined,

                cgpa: cgpa
                    ? Number(cgpa)
                    : undefined
            },

            financial: {
                incomeRange,

                incomeAmount:
                    incomeAmount
                        ? Number(incomeAmount)
                        : undefined,

                incomeCertificateAvailable:
                    incomeCertificateAvailable === "on"
            },

            eligibility: {

                category,

                firstGenerationStudent:
                    firstGenerationStudent === "on",

                singleParent:
                    singleParent === "on",

                orphan:
                    orphan === "on",

                defenceWard:
                    defenceWard === "on",

                girlStudent:
                    girlStudent === "on",

                ruralStudent:
                    ruralStudent === "on"
            },

            interests:
                Array.isArray(interests)
                    ? interests
                    : interests
                        ? [interests]
                        : []
        };


        await StudentProfile.findOneAndUpdate(

            {
                userId: req.session.userId
            },

            profileData,

            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );


        res.redirect("/dashboard");

    } catch (error) {

        console.log(
            "Save profile error:",
            error
        );

        res.status(500).send(
            "Unable to save profile."
        );
    }
});

module.exports = router;