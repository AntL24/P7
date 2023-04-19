import { displayRecipes, updateTagSearchResults } from './DOMelements.js';
import { recipes } from "../recipes.js";
import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { addMenuClickListener, defaultDisplayTags } from './filterMenu.js';

//Default gallery
displayRecipes(recipes);

//Listen to input and call search function when 3 characters are entered
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    //Get all tags displayed in the html page
    const tags = document.querySelectorAll(".tag");

    //Add event listener on input, but also on tags added dynamically
    searchInput.addEventListener("input", function () {

        //Get all tags pinned in the html page
        const tagsElements = document.querySelectorAll(".tag");
        const tags = [];
        tagsElements.forEach(tag => {
            const tagObject = {
                category: tag.classList[0].split("-")[0],
                name: tag.querySelector(".tag-text").textContent
            };
            tags.push(tagObject);
        });

        //If search input is valid, call search function
        if (searchInput.value.length >= 3) {
            //Call search function
            const searchResults = searchAlgorithm(searchInput.value, recipes, tags);
            //If no results are found, display message
            if (searchResults.length === 0) {
                //Create no results message
                const noResults = document.createElement("p");
                noResults.textContent = "No results found";
                noResults.classList.add("no-results");
                noResults.id = "no-results";
                //Append message to DOM
                const recipesGrid = document.querySelector(".recipes-grid");
                recipesGrid.innerHTML = "";
                recipesGrid.appendChild(noResults);
                return;
            }
            displayRecipes(searchResults);
        } else {
        //If search input is empty, display default gallery
            displayRecipes(recipes);
        }

    });
  defaultDisplayTags('ingredients', recipes);
  defaultDisplayTags('appliance', recipes);
  defaultDisplayTags('tools', recipes);
});


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