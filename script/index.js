import { displayRecipes } from './DOMelements.js';
import {recipes} from "../recipes.js";
import  {searchAlgorithm} from "./inputSearchAlgorithm.js";

//Default gallery
displayRecipes(recipes);

//Listen to input and call search function when 3 characters are entered
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        if (searchInput.value.length >= 3) {
            //Call search function
            searchAlgorithm(searchInput.value);
        }
    });
});
