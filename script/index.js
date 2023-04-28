import { displayRecipes } from './DOMelements.js';
import { recipes } from "../recipes.js";
import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { addMenuClickListener, defaultDisplayTags, handleTagSearchInput } from './filterMenu.js';

//Default gallery
displayRecipes(recipes);

//Initialize page with full gallery and tag menus.
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", handleSearchInput);

    defaultDisplayTags('ingredients', recipes);
    defaultDisplayTags('appliance', recipes);
    defaultDisplayTags('tools', recipes);
});


//Get all tags from the DOM
function getTags () {
    const tagElements = document.querySelectorAll(".tag");
    const tags = [];

    tagElements.forEach(tag => {
        const tagData = {
            category: tag.classList[0].split("-")[0],
            name: tag.querySelector(".tag-text").textContent
        };
        tags.push(tagData);
    });
    return tags;
}

//Main search function: filters recipes based on input and tags. Updates gallery and tag menus.
function handleSearchInput(input) {
    const tags = getTags();
    let filteredRecipes = recipes;
    //Use algorithms to filter recipes based on input and tags (the "if there are any or not" will be handled by the algorithm)
    const searchResults = searchAlgorithm(input.target.value, filteredRecipes, tags);
    // No result error message
        if (searchResults.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "Aucune recette ne correspond à vos critères.";
            noResults.classList.add("no-results");
            noResults.id = "no-results";

            const recipesGrid = document.querySelector(".recipes-grid");
            recipesGrid.innerHTML = "";
            recipesGrid.appendChild(noResults);
            return;
        }
    
    // Update gallery and tag menus
    displayRecipes(searchResults);
    defaultDisplayTags('ingredients', recipes, searchResults);
    defaultDisplayTags('appliance', recipes, searchResults);
    defaultDisplayTags('tools', recipes, searchResults);
}

//Tag menus: hide or show based on click
addMenuClickListener('menu-ingredients');
addMenuClickListener('menu-appliance');
addMenuClickListener('menu-tools');

//Update tag menus on input
document.getElementById("input-ingredients-input").addEventListener("input", (event) => {
    const tags = getTags();
    //Get search input value
    const searchInput = document.getElementById("searchInput");
    const filteredRecipes = searchAlgorithm(searchInput.value, recipes, tags);
    handleTagSearchInput("ingredients", event.target.value, recipes, filteredRecipes);
});
document.getElementById("input-appliance-input").addEventListener("input", (event) => {
    const tags = getTags();
    const searchInput = document.getElementById("searchInput");
    const filteredRecipes = searchAlgorithm(searchInput.value, recipes, tags);
    handleTagSearchInput("appliance", event.target.value, recipes, filteredRecipes);
});
document.getElementById("input-tools-input").addEventListener("input", (event) => {
    const tags = getTags();
    const searchInput = document.getElementById("searchInput");
    const filteredRecipes = searchAlgorithm(searchInput.value, recipes, tags);
    handleTagSearchInput("tools", event.target.value, recipes, filteredRecipes);
});
  