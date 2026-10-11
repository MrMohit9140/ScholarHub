const express = require("express");

const router = express.Router();

const Opportunity =
    require("../models/opportunity");

const StudentProfile =
    require("../models/scholarprofile");

const requireLogin =
    require("../middleware/auth");

const calculateMatch =
    require("../services/matchingService");

    router.get(
    "/opportunities",
    requireLogin,
    async (req, res) => {

        try {

            const profile =
                await StudentProfile.findOne({
                    userId: req.session.userId
                });

            if (!profile) {

                return res.redirect(
                    "/profile"
                );
            }


            const opportunities =
                await Opportunity.find({
                    verified: true
                });


            const results =
                opportunities
                    .map(opportunity => {

                        const match =
                            calculateMatch(
                                profile,
                                opportunity
                            );

                        return {
                            opportunity,
                            score: match.score,
                            reasons: match.reasons
                        };
                    })

                    .sort(
                        (a, b) =>
                            b.score - a.score
                    );


            res.render(
                "opportunities",
                {
                    results
                }
            );

        } catch (error) {

            console.log(
                "Opportunity error:",
                error
            );

            res.status(500).send(
                "Unable to load opportunities."
            );
        }
    }
);

module.exports = router;