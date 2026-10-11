


        //    SHOW / HIDE PASSWORD
     

        const password =
            document.getElementById("password");

        const togglePassword =
            document.getElementById("togglePassword");


        togglePassword.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";

                togglePassword.textContent = "Hide";

            } else {

                password.type = "password";

                togglePassword.textContent = "Show";

            }

        });



        //    LOGIN BUTTON ANIMATION
        

        const loginForm =
            document.getElementById("loginForm");

        const submitButton =
            document.querySelector(".submit-btn");


        loginForm.addEventListener("submit", () => {

            submitButton.classList.add("loading");

            submitButton.querySelector("span:first-child")
                .textContent = "Signing in...";

        });
