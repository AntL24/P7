//Listen to input and call search function when 3 characters are entered
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        if (searchInput.value.length >= 3) {
            //SearchFunction(searchInput.value);
            console.log("Recherche :", searchInput.value);
        }
    });
});