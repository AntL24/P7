import {handleTagClick} from './DOMelements.js';
import { searchAlgorithm } from './algorithms/inputSearchAlgorithm.js';

//Show menu when clicking on the menu icon
function toggleMenu(menuItem) {
    const inputElement = menuItem.querySelector('input[type="text"]');
    const searchResults = menuItem.querySelector('.search-results');
    const iconElement = menuItem.querySelector('i');
    const buttonElement = menuItem.querySelector('button');
    // const noResults = searchResults.querySelector('.choose-keyword');

    if (iconElement.classList.contains('fa-chevron-down')) {
        searchResults.style.display = 'grid';
        inputElement.style.display = 'block';
        buttonElement.style.display = 'none';
        iconElement.classList.replace('fa-chevron-down', 'fa-chevron-up');
        
        //For animation purpose
        //Add rotate-chevron class on icon. Remove no-rotate-chevron class
        iconElement.classList.add('rotate-chevron');
        iconElement.classList.remove('no-rotate-chevron');
    } else {
        buttonElement.style.display = 'block';
        searchResults.style.display = 'none';
        inputElement.style.display = 'none';
        iconElement.classList.replace('fa-chevron-up', 'fa-chevron-down');
        
        //For animation purpose
        //Remove rotate-chevron class on icon. Add no-rotate-chevron class.
        iconElement.classList.replace('rotate-chevron', 'no-rotate-chevron');
    }
}

//Place input listeners to make menu elements interactive
function addMenuClickListener(menuId, recipes) {
    const menuElement = document.getElementById(menuId);
    const iconElement = menuElement.querySelector('i');

    menuElement.addEventListener('click', function (event) {
        if (iconElement.classList.contains('fa-chevron-up')) {
            event.stopPropagation(); 
        } else {
            //Open the menu
            toggleMenu(menuElement);
            // //Display all tags corresponding to the opened menu
            // defaultDisplayTags(menuId.split("-")[1], recipes);
        }
    });

    iconElement.addEventListener('click', function (event) {
        toggleMenu(menuElement);
        event.stopPropagation();
    });

    const inputElement = menuElement.querySelector('input[type="text"]');
    inputElement.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

function defaultDisplayTags(category, recipes, displayedRecipes = null) {
    const searchResultsElement = document.querySelector(`#menu-${category} .search-results`);

    const tagElements = document.querySelectorAll(".tag");
    const tags = [];

    tagElements.forEach(tag => {
        const tagData = {
            category: tag.classList[0].split("-")[0],
            name: tag.querySelector(".tag-text").textContent
        };
        tags.push(tagData);
    });

    let filteredTags = new Set();

    const recipesToFilter = displayedRecipes ? displayedRecipes : recipes;
    const filteredRecipes = searchAlgorithm("", recipesToFilter, tags);

    filteredRecipes.forEach(recipe => {
        if (category === 'ingredients') {
            recipe[category].forEach(tag => {
                filteredTags.add(tag.ingredient.toLowerCase());
            });
        } else if (category === 'appliance') {
            const appliance = recipe.appliance;
            filteredTags.add(appliance.toLowerCase());
        } else if (category === 'tools') {
            const tools = recipe.ustensils;
            tools.forEach(tool => {
                filteredTags.add(tool.toLowerCase());
            });
        }
    });

    searchResultsElement.innerHTML = "";

    filteredTags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tagElement.classList.add("tag-container");
        searchResultsElement.appendChild(tagElement);
        tagElement.addEventListener("click", (event) => handleTagClick(event, category, recipes));
    });
}


export {addMenuClickListener, defaultDisplayTags};