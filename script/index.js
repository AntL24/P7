import { displayRecipes } from './DOMelements.js';
import { recipes } from "../recipes.js";
import { searchAlgorithm } from "./inputSearchAlgorithm.js";

//Default gallery
displayRecipes(recipes);

//Listen to input and call search function when 3 characters are entered
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        if (searchInput.value.length >= 3) {
            console.log("Search input: " + searchInput.value)
            //Call search function
            const searchResults = searchAlgorithm(searchInput.value, recipes);
            console.log("Search results: " + searchResults);
            //Display search results
            displayRecipes(searchResults);
        }
    });
});
