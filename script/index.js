import { displayRecipes, updateTagSearchResults } from './DOMelements.js';
import { recipes } from "../recipes.js";
import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { addMenuClickListener } from './filterMenu.js';

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
        } else if (searchInput.value.length === 0) {
            //Display default gallery
            displayRecipes(recipes);
        }
    });
});

//Tag menu animations with event listeners and DOM manipulation
//=> Call function to add event listeners on click for each filter menu
addMenuClickListener('menu-ingredients');
addMenuClickListener('menu-cooking-hardware');
addMenuClickListener('menu-tools');


//Add tagg event listeners to display search results for each tag category
document.getElementById("input-ingredients-input").addEventListener("input", (event) => {
    updateTagSearchResults("ingredients", event.target.value, recipes);
  });
  
  document.getElementById("input-cooking-hardware-input").addEventListener("input", (event) => {
    updateTagSearchResults("appliance", event.target.value, recipes);
  });
  
  document.getElementById("input-tools-input").addEventListener("input", (event) => {
    updateTagSearchResults("tools", event.target.value, recipes);
  });