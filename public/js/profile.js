document.addEventListener("DOMContentLoaded", () => {

    const steps = document.querySelectorAll(".form-step");

    const stepIndicators =
        document.querySelectorAll(".step");

    const nextButtons =
        document.querySelectorAll(".next-btn");

    const previousButtons =
        document.querySelectorAll(".previous-btn");

    const progressFill =
        document.querySelector(".progress-fill");

    const progressPercentage =
        document.querySelector(".progress-percentage");

    let currentStep = 0;


    /* =========================
       SHOW STEP
    ========================= */

    function showStep(index) {

        steps.forEach((step, i) => {

            step.classList.toggle(
                "active",
                i === index
            );

        });


        stepIndicators.forEach((step, i) => {

            step.classList.remove(
                "active",
                "completed"
            );

            if (i === index) {

                step.classList.add("active");

            } else if (i < index) {

                step.classList.add("completed");

            }

        });


        const percentage =
            ((index + 1) / steps.length) * 100;

        progressFill.style.width =
            `${percentage}%`;

        progressPercentage.textContent =
            `${Math.round(percentage)}%`;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* =========================
       VALIDATION
    ========================= */

    function validateStep() {

        const current =
            steps[currentStep];

        const requiredInputs =
            current.querySelectorAll(
                "[required]"
            );

        let valid = true;


        requiredInputs.forEach(input => {

            removeError(input);


            if (!input.value.trim()) {

                showError(
                    input,
                    "This field is required."
                );

                valid = false;
            }

        });


        // CGPA validation

        const cgpa =
            current.querySelector(
                'input[name="cgpa"]'
            );

        if (
            cgpa &&
            cgpa.value &&
            (
                Number(cgpa.value) < 0 ||
                Number(cgpa.value) > 10
            )
        ) {

            showError(
                cgpa,
                "CGPA must be between 0 and 10."
            );

            valid = false;
        }


        // Percentage validation

        const percentage =
            current.querySelector(
                'input[name="percentage"]'
            );

        if (
            percentage &&
            percentage.value &&
            (
                Number(percentage.value) < 0 ||
                Number(percentage.value) > 100
            )
        ) {

            showError(
                percentage,
                "Percentage must be between 0 and 100."
            );

            valid = false;
        }


        return valid;
    }


    /* =========================
       ERROR FUNCTIONS
    ========================= */

    function showError(input, message) {

        input.classList.add(
            "input-error"
        );

        const error =
            document.createElement("div");

        error.className =
            "field-error";

        error.textContent =
            message;

        input.parentElement.appendChild(
            error
        );
    }


    function removeError(input) {

        input.classList.remove(
            "input-error"
        );

        const oldError =
            input.parentElement.querySelector(
                ".field-error"
            );

        if (oldError) {
            oldError.remove();
        }
    }


    /* =========================
       NEXT BUTTON
    ========================= */

    nextButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!validateStep()) {
                    return;
                }

                if (
                    currentStep <
                    steps.length - 1
                ) {

                    currentStep++;

                    showStep(
                        currentStep
                    );
                }

            }
        );

    });


    /* =========================
       PREVIOUS BUTTON
    ========================= */

    previousButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (currentStep > 0) {

                    currentStep--;

                    showStep(
                        currentStep
                    );

                }

            }
        );

    });


    /* =========================
       REMOVE ERROR WHILE TYPING
    ========================= */

    document
        .querySelectorAll(
            "input, select"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {
                    removeError(input);
                }
            );

            input.addEventListener(
                "change",
                () => {
                    removeError(input);
                }
            );

        });


    /* =========================
       INITIAL STEP
    ========================= */

    showStep(0);

});