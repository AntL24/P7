import {handleTagClick} from './DOMelements.js';

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

//Show all tags corresponding to the opened menu
function defaultDisplayTags(category, recipes, displayedRecipes = null) {
  const searchResultsElement = document.querySelector(`#menu-${category} .search-results`);

///////////////////////////////////////////////////////////////////////
let filteredTags = new Set();

  // Utilisez displayedRecipes s'il est défini, sinon utilisez toutes les recettes
  const recipesToFilter = displayedRecipes ? displayedRecipes : recipes;
  recipesToFilter.forEach(recipe => {
    if (category === 'ingredients') {
      recipe[category].forEach(tag => {
        filteredTags.add(tag.ingredient.toLowerCase());
      });
    } 
    else if (category === 'appliance') {
        const appliance = recipe.appliance;
        filteredTags.add(appliance.toLowerCase());


    }
    else if (category === 'tools') {
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




  //By default, display all tags corresponding to the category
//   if (category === "ingredients"){
//     const ingredients = recipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient));
//     const uniqueIngredients = Array.from(new Set(ingredients));
//     uniqueIngredients.forEach(tag => {
        
//         const tagElement = document.createElement("span");
//         tagElement.textContent = tag;
//         tagElement.classList.add("tag-container");
//         searchResultsElement.appendChild(tagElement);
//         tagElement.addEventListener("click", (event) => handleTagClick(event, category, recipes));
//     });
//   } else if (category === "appliance") {
//     const appliances = recipes.map(recipe => recipe.appliance);
//     const uniqueAppliances = Array.from(new Set(appliances));
//     uniqueAppliances.forEach(tag => {
//         const tagElement = document.createElement("span");
//         tagElement.textContent = tag;
//         tagElement.classList.add("tag-container");
//         searchResultsElement.appendChild(tagElement);
//         tagElement.addEventListener("click", (event) => handleTagClick(event, category, recipes));
//     });
//   } else if (category === "tools") {
//     const tools = recipes.flatMap(recipe => recipe.ustensils);
//     const uniqueTools = Array.from(new Set(tools));
//     uniqueTools.forEach(tag => {
//         const tagElement = document.createElement("span");
//         tagElement.textContent = tag;
//         tagElement.classList.add("tag-container");
//         searchResultsElement.appendChild(tagElement);
//         tagElement.addEventListener("click", (event) => handleTagClick(event, category, recipes));
//     });
//   }
// }

export {addMenuClickListener, defaultDisplayTags};