

const searchInput =
    document.getElementById("searchInput");

const cards =
    document.querySelectorAll(".student-card");

const noResults =
    document.getElementById("noResults");


searchInput.addEventListener("input", () => {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    let found = 0;


    cards.forEach(card => {

        const content =
            card.dataset.search.toLowerCase();

        if (content.includes(search)) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });


    if (found === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

});

