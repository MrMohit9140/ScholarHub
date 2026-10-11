function calculateMatch(
    student,
    opportunity
) {

    let score = 0;

    const reasons = [];

    // Education
    if (
        opportunity.educationLevels.length === 0 ||
        opportunity.educationLevels.includes(
            student.education.level
        )
    ) {

        score += 20;

        reasons.push(
            "Your education level matches."
        );
    }


    // Field
    if (
        opportunity.fields.length === 0 ||
        opportunity.fields.includes(
            student.education.field
        )
    ) {

        score += 20;

        reasons.push(
            "Your field matches."
        );
    }


    // State
    if (
        opportunity.states.length === 0 ||
        opportunity.states.includes(
            student.personal.state
        ) ||
        opportunity.states.includes("All India")
    ) {

        score += 10;

        reasons.push(
            "This opportunity is available in your location."
        );
    }


    // Income
    if (
        opportunity.maxIncome == null ||
        student.financial.incomeAmount <=
        opportunity.maxIncome
    ) {

        score += 20;

        reasons.push(
            "Your family income satisfies the requirement."
        );
    }


    // Category
    if (
        opportunity.categories.length === 0 ||
        opportunity.categories.includes(
            student.eligibility.category
        ) ||
        opportunity.categories.includes("All")
    ) {

        score += 10;

        reasons.push(
            "Your category matches."
        );
    }


    // CGPA
    if (
        !opportunity.minCGPA ||
        student.education.cgpa >=
        opportunity.minCGPA
    ) {

        score += 10;

        reasons.push(
            "Your academic score satisfies the requirement."
        );
    }


    // Interests / field
    if (
        student.interests &&
        opportunity.fields
    ) {

        const interestMatch =
            student.interests.some(
                interest =>
                    opportunity.fields.includes(
                        interest
                    )
            );

        if (interestMatch) {

            score += 10;

            reasons.push(
                "This opportunity matches your interests."
            );
        }
    }


    return {
        score,
        reasons
    };
}


module.exports = calculateMatch;