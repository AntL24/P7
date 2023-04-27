import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { refreshGallery } from "./DOMelements.js";

//Show menu when clicking on the menu icon
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

// Function to pin tag element and handle click event on tags search elements (close when icon is selected)
function handleTagClick(event, category, recipes) {
  const selectedTags = document.querySelector(".selected-tags");
  const tagElement = document.createElement("div");
  const tagText = document.createElement("span");
  const tagIcon = document.createElement("i");

  //Remove tag from selected tags list when clicking on the icon "far fa-times-circle"
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

//Display tags according to the actions of the user (except for input in menu, which is handled in updateTagSearchResults)
function defaultDisplayTags(category, recipes, displayedRecipes = null) {
  const searchResultsElement = document.querySelector(
    `#menu-${category} .search-results`
  );

  const tagElements = document.querySelectorAll(".tag");
  const tags = [];

  tagElements.forEach((tag) => {
    const tagData = {
      category: tag.classList[0].split("-")[0],
      name: tag.querySelector(".tag-text").textContent,
    };
    tags.push(tagData);
  });

  let filteredTags = new Set();

  //If displayedRecipes is null, it means that the user has not filtered the recipes yet. We sort the whole list of recipes.
  //Else, we need to filter the displayed recipes instead of the whole list of recipes.
  const recipesToFilter = displayedRecipes ? displayedRecipes : recipes;
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

  filteredTags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.textContent = tag;
    tagElement.classList.add("tag-container");
    searchResultsElement.appendChild(tagElement);
    tagElement.addEventListener("click", (event) =>
      handleTagClick(event, category, recipes)
    );
  });
}

//Update all tag menus at once
function updateAllCategories(recipes, displayedRecipes = null) {
  const categories = ["ingredients", "appliance", "tools"];

  categories.forEach((category) => {
    defaultDisplayTags(category, recipes, displayedRecipes);
  });
}

//Update tags on menu input change
function updateTagSearchResults(category, searchTerm, recipes, filteredRecipes) {
  const searchResultsElement = document.getElementById(
    `search-results-${category}`
  );
  searchResultsElement.innerHTML = ""; // Clear previous search results
  searchResultsElement.style.display = "grid";
  searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";
  //If filtered recipes is empty, display all recipes
  if (filteredRecipes.length === 0) {
    filteredRecipes = recipes;
  }
  //Minimum requirement to search 3 characters is met
  if (searchTerm.length >= 3) {
    tagsSearchUpdate(category, searchTerm, recipes, filteredRecipes);
  } else {
    defaultDisplayTags(category, recipes, filteredRecipes);
  }
}

//Use input to filter tags and display them
function tagsSearchUpdate(category, searchTerm, recipes, filteredRecipes) {
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

  if (searchTerm) {
    //Filter tags according to tag search input, Set and lowercase to avoid duplicates
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
    const tagElement = document.createElement("span");
    tagElement.textContent = tag;
    tagElement.classList.add("tag-container");
    searchResultsElement.appendChild(tagElement);
    tagElement.addEventListener("click", (event) =>
      handleTagClick(event, category, recipes)
    );
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

export { addMenuClickListener, defaultDisplayTags, updateAllCategories, updateTagSearchResults, handleTagClick };
