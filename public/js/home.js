const searchInput =
            document.getElementById("searchInput");

        const noResults =
            document.getElementById("noResults");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    const searchValue =
                        this.value
                            .toLowerCase()
                            .trim();


                    const cards =
                        document.querySelectorAll(
                            ".user-card"
                        );


                    let visibleCards = 0;


                    cards.forEach(card => {

                        const username =
                            card.dataset.username || "";

                        const name =
                            card.dataset.name || "";


                        if (
                            username.includes(searchValue) ||
                            name.includes(searchValue)
                        ) {

                            card.style.display = "block";

                            visibleCards++;

                        } else {

                            card.style.display = "none";

                        }

                    });


                    noResults.style.display =
                        visibleCards === 0
                            ? "block"
                            : "none";

                }
            );

        }



