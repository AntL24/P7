import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { refreshGallery, makeTagSuggestions} from "./DOMelements.js";

//Show menu when clicking on the icon
function toggleMenu(menuItem) {
  const inputElement = menuItem.querySelector('input[type="text"]');
  const searchResults = menuItem.querySelector(".search-results");
  const iconElement = menuItem.querySelector("i");
  const buttonElement = menuItem.querySelector("button");

  if (iconElement.classList.contains("fa-chevron-down")) {
    searchResults.style.display = "grid";
    inputElement.style.display = "block";
    buttonElement.style.display = "none";
    iconElement.classList.replace("fa-chevron-down", "fa-chevron-up");

    //For animation purpose
    //Add rotate-chevron class on icon. Remove no-rotate-chevron class
    iconElement.classList.add("rotate-chevron");
    iconElement.classList.remove("no-rotate-chevron");
  } else {
    buttonElement.style.display = "block";
    searchResults.style.display = "none";
    inputElement.style.display = "none";
    iconElement.classList.replace("fa-chevron-up", "fa-chevron-down");

    //For animation purpose
    //Remove rotate-chevron class on icon. Add no-rotate-chevron class.
    iconElement.classList.replace("rotate-chevron", "no-rotate-chevron");
  }
}

//Place input listeners to make menu elements interactive
function addMenuClickListener(menuId) {
  const menuElement = document.getElementById(menuId);
  const iconElement = menuElement.querySelector("i");

  menuElement.addEventListener("click", function (event) {
    if (iconElement.classList.contains("fa-chevron-up")) {
      event.stopPropagation();
    } else {
      //Open the menu
      toggleMenu(menuElement);
    }
  });

  iconElement.addEventListener("click", function (event) {
    toggleMenu(menuElement);
    event.stopPropagation();
  });

  const inputElement = menuElement.querySelector('input[type="text"]');
  inputElement.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

//Update all tag menus at once
function updateAllCategories(recipes, displayedRecipes = null) {
  const categories = ["ingredients", "appliance", "tools"];
  categories.forEach((category) => {
    defaultDisplayTags(category, recipes, displayedRecipes);
  });
}

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

//Pin tag element and handle click events on tag suggestion elements
function handleTagClick(event, category, recipes) {
  const selectedTags = document.querySelector(".selected-tags");
  const tagElement = document.createElement("div");
  const tagText = document.createElement("span");
  const tagIcon = document.createElement("i");

  //Remove tag from selected tags list when clicking on the icon
  tagIcon.addEventListener("click", (event) => {
    event.target.parentElement.remove();
    //Update gallery when removing a tag (click on icon)
    refreshGallery(recipes);
  });

  //If tag already exists in selected tags list, don't add it again
  if (selectedTags.innerHTML.includes(event.target.textContent)) {
    return;

  //Tag is new, pin it.
  } else {
    //empty the input field
    const inputElement = document.querySelector(
      `#menu-${category} input[type="text"]`
    );
    inputElement.value = "";

    tagElement.classList.add(`${category}-tag`, "tag");
    tagText.classList.add("tag-text");
    tagIcon.classList.add("far", "fa-times-circle");
    tagIcon.setAttribute("aria-hidden", "true");

    tagText.textContent = event.target.textContent;

    tagElement.appendChild(tagText);
    tagElement.appendChild(tagIcon);
    selectedTags.appendChild(tagElement);
  }
  //Refresh gallery when adding a tag (click on tag)
  refreshGallery(recipes);
}

//Display tags in the menus according to the actions of the user
//(except for input in menu, which is handled in updateTagSearchResults)
function defaultDisplayTags(category, recipes, displayedRecipes = null) {
  const searchResultsElement = document.querySelector(
    `#menu-${category} .search-results`
  );

  const tags = getTags();
  let filteredTags = new Set();

  //If displayedRecipes = null, user has not filtered the recipes => use all recipes to display all tags.
  //If displayedRecipes, use them to display the tags.
  const recipesToFilter = displayedRecipes ? displayedRecipes : recipes;
  //No input as recipesToFilter is already filtered when displayedRecipes is not null.
  const filteredRecipes = searchAlgorithm("", recipesToFilter, tags);

  filteredRecipes.forEach((recipe) => {
    if (category === "ingredients") {
      recipe[category].forEach((tag) => {
        filteredTags.add(tag.ingredient.toLowerCase());
      });
    } else if (category === "appliance") {
      const appliance = recipe.appliance;
      filteredTags.add(appliance.toLowerCase());
    } else if (category === "tools") {
      const tools = recipe.ustensils;
      tools.forEach((tool) => {
        filteredTags.add(tool.toLowerCase());
      });
    }
  });

  searchResultsElement.innerHTML = "";
  searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";

  //Use tag search by input if searchTerm is >= 3 characters
  const searchTerm = document.querySelector(`#menu-${category} input`).value;
  if (searchTerm.length >= 3) {
    handleTagSearchInput(category, searchTerm, recipes, filteredRecipes);
    return;
  }

  filteredTags.forEach((tag) => {
    makeTagSuggestions(searchResultsElement, tag, category, recipes);
  });
}

//Update tags on menu input change
function handleTagSearchInput(category, searchTerm, recipes, filteredRecipes) {
  const searchResultsElement = document.getElementById(
    `search-results-${category}`
  );
  //If filtered recipes is empty (meaning there's no match for main search bar input), display all recipes
  if (filteredRecipes.length === 0) {
    filteredRecipes = recipes;
  }
  //Minimum requirement to search 3 characters is met, display resulting tags.
  if (searchTerm.length >= 3) {
    searchResultsElement.innerHTML = ""; // Clear previous search results
    searchResultsElement.style.display = "grid";
    searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";
    tagsSearchByInput(category, searchTerm, recipes, filteredRecipes);
  } else {
    searchResultsElement.style.display = "grid";
    searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";
  //Keep displaying default tags until minimum requirement is met
    defaultDisplayTags(category, recipes, filteredRecipes);
  }
}
//Use input to filter tags and display them
function tagsSearchByInput(category, searchTerm, recipes, filteredRecipes) {
  const searchResultsElement = document.getElementById(
    `search-results-${category}`
  );

  // Initialize variable to store filtered tags
  let filteredTags;

  // Get tags based on search category (ingredients, appliance, tools) and store them in filteredTags
  if (category === "ingredients") {
    filteredTags = filteredRecipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    );
  } else if (category === "appliance") {
    filteredTags = filteredRecipes.map((recipe) => recipe.appliance);
  } else if (category === "tools") {
    filteredTags = filteredRecipes.flatMap((recipe) => recipe.ustensils);
  }
  
  //Filter tags according to tag search input, Set and lowercase to avoid duplicates
  if (searchTerm && searchTerm.length >= 3) {
    filteredTags = Array.from(
        new Set(
          filteredTags.filter((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((tag) => tag.toLowerCase())
        )
      );
  }
  
  // Manipulate DOM to display tags according to category input search
  filteredTags.forEach((tag) => {
    makeTagSuggestions(searchResultsElement, tag, category, recipes);
  });

  // Add style for category tag search results : 3 tags per row
  searchResultsElement.style.display = "grid";
  searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";

  // If no tags match the category search input, display a message
  if (filteredTags.length === 0) {
    searchResultsElement.style.gridTemplateColumns = "1fr";
    searchResultsElement.innerHTML =
      '<p class="no-match"><i>Aucun résultat ne correspond à votre recherche</i></p>';
  }
}

  

export { addMenuClickListener, defaultDisplayTags, updateAllCategories, handleTagSearchInput, handleTagClick, getTags };
