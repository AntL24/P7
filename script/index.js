import { displayRecipes, updateTagSearchResults } from './DOMelements.js';
import { recipes } from "../recipes.js";
import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { addMenuClickListener, defaultDisplayTags } from './filterMenu.js';

//Default gallery
displayRecipes(recipes);


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", handleSearchInput);

    defaultDisplayTags('ingredients', recipes);
    defaultDisplayTags('appliance', recipes);
    defaultDisplayTags('tools', recipes);
});

function handleSearchInput(input) {
    const tagElements = document.querySelectorAll(".tag");
    const tags = [];

    tagElements.forEach(tag => {
        const tagData = {
            category: tag.classList[0].split("-")[0],
            name: tag.querySelector(".tag-text").textContent
        };
        tags.push(tagData);
    });

    let filteredRecipes = recipes;

    // If there are tags selected, filter the recipes based on those tags
    if (tags.length > 0) {
        filteredRecipes = searchAlgorithm("", filteredRecipes, tags);
    }

    if (input.target.value.length >= 3) {
        const searchResults = searchAlgorithm(input.target.value, filteredRecipes, tags);

        if (searchResults.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No results found";
            noResults.classList.add("no-results");
            noResults.id = "no-results";

            const recipesGrid = document.querySelector(".recipes-grid");
            recipesGrid.innerHTML = "";
            recipesGrid.appendChild(noResults);
            return;
        }

        displayRecipes(searchResults);
        defaultDisplayTags('ingredients', recipes, searchResults);
        defaultDisplayTags('appliance', recipes, searchResults);
        defaultDisplayTags('tools', recipes, searchResults);
    } else {
        // If search input is empty, display filtered gallery based on tags
        displayRecipes(filteredRecipes);
        defaultDisplayTags('ingredients', recipes, filteredRecipes);
        defaultDisplayTags('appliance', recipes, filteredRecipes);
        defaultDisplayTags('tools', recipes, filteredRecipes);
    }
}


//Tag menu animations with event listeners and DOM manipulation to display or hide menus and tags
addMenuClickListener('menu-ingredients', recipes);
addMenuClickListener('menu-appliance', recipes);
addMenuClickListener('menu-tools', recipes);

//Update tag lists when input is entered
document.getElementById("input-ingredients-input").addEventListener("input", (event) => {
    updateTagSearchResults("ingredients", event.target.value, recipes);
});
  
document.getElementById("input-appliance-input").addEventListener("input", (event) => {
    updateTagSearchResults("appliance", event.target.value, recipes);
});
  
document.getElementById("input-tools-input").addEventListener("input", (event) => {
    updateTagSearchResults("tools", event.target.value, recipes);
});