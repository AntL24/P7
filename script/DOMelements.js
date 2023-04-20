import { searchAlgorithm } from "./algorithms/inputSearchAlgorithm.js";
import { defaultDisplayTags } from "./filterMenu.js";
import { updateAllCategories } from "./filterMenu.js";
//Recipe card constructor 
function createRecipeCard(recipe) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
  
    const recipeCardImage = document.createElement("div");
    recipeCardImage.classList.add("recipe-card-image");
    const img = document.createElement("img");
    // img.src = `../Limonada-de-Coco-(2).jpg;
    img.src = `../Limonada-de-Coco-(2).jpg`;
    recipeCardImage.appendChild(img);

  
    const recipeCardContent = document.createElement("div");
    recipeCardContent.classList.add("recipe-card-content");
  
    const titleAndTime = document.createElement("div");
    titleAndTime.classList.add("title-and-time");
    const h3 = document.createElement("h3");
    h3.classList.add("recipe-card-title");
    h3.textContent = recipe.name;
    const span = document.createElement("span");
    span.classList.add("recipe-card-time");
    span.innerHTML = `<i class="far fa-clock"></i> ${recipe.time} min`;
    titleAndTime.appendChild(h3);
    titleAndTime.appendChild(span);
  
    const ingredientsAndInstructions = document.createElement("div");
    ingredientsAndInstructions.classList.add("ingredients-and-instructions");
  
    const recipeIngredients = document.createElement("div");
    recipeIngredients.classList.add("recipe-ingredients");

    //Create a paragraph for each ingredient
    recipe.ingredients.forEach(ingredient => {
        const p = document.createElement("p");
        let ingredientText = `<span>${ingredient.ingredient}`;
        if (ingredient.hasOwnProperty("quantity") || ingredient.hasOwnProperty("unit")) {
          ingredientText += ":</span>";
        } else {
          ingredientText += "</span>";
        }
        if (ingredient.hasOwnProperty("quantity")) {
          ingredientText += ` ${ingredient.quantity}`;
        }
        if (ingredient.hasOwnProperty("unit")) {
          ingredientText += ` ${ingredient.unit}`;
        }
        p.innerHTML = ingredientText;
        recipeIngredients.appendChild(p);
    });
  
    const instructions = document.createElement("div");
    instructions.classList.add("instructions");
    const instructionsP = document.createElement("p");
    instructionsP.classList.add("ellipsis"); 
    const instructionsSpan = document.createElement("span"); 
    instructionsSpan.textContent = recipe.description; 
    instructionsP.appendChild(instructionsSpan);
    instructions.appendChild(instructionsP);
  
    ingredientsAndInstructions.appendChild(recipeIngredients);
    ingredientsAndInstructions.appendChild(instructions);
  
    recipeCardContent.appendChild(titleAndTime);
    recipeCardContent.appendChild(ingredientsAndInstructions);
  
    recipeCard.appendChild(recipeCardImage);
    recipeCard.appendChild(recipeCardContent);
  
    //returns the recipe card to be added to the DOM
    return recipeCard;
}

//Display gallery of recipes
function displayRecipes(recipes) {
    const recipesGrid = document.querySelector(".recipes-grid");
    recipesGrid.innerHTML = "";
    recipes.forEach(recipe => {
      const recipeCard = createRecipeCard(recipe);
      recipesGrid.appendChild(recipeCard);
    });
}

//Refresh gallery of recipes
function refreshGallery(recipes) {
  console.log("Refreshing gallery");

  //Get all tags displayed in the html page
  const searchInput = document.getElementById("searchInput");
  const tagsElements = document.querySelectorAll(".tag");
  const tags = [];

  tagsElements.forEach(tag => {
      const tagObject = {
          category: tag.classList[0].split("-")[0],
          name: tag.querySelector(".tag-text").textContent
      };
      tags.push(tagObject);
  });
      //Call search function and assign results to variable
      const searchResults = searchAlgorithm(searchInput.value, recipes, tags);
      // console.log("Refreshing, Search results: " + JSON.stringify(searchResults, null, 2));
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
      //Display search results
      displayRecipes(searchResults);
      updateAllCategories(recipes, searchResults);
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
      //Update tag search results when removing a tag (click on icon)
      // updateTagSearchResults(category, event.target.parentElement.querySelector(".tag-text").textContent, recipes);
      // defaultDisplayTags(category, recipes, recipes);
      //Update gallery when removing a tag (click on icon)
      refreshGallery(recipes);
    });
  
    //If tag already exists in selected tags list, don't add it again
    if (selectedTags.innerHTML.includes(event.target.textContent)) {
      console.log("Tag already exists")
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
    console.log("Tag added", category, event.target.textContent);
    //Update tag search results when adding a tag (click on tag)
    // updateTagSearchResults(category, event.target.textContent, recipes);
    // defaultDisplayTags(category, recipes, recipes);
    
  }

//Display tags results in category menu search
function updateTagSearchResults(category, searchTerm, recipes, filteredRecipes) {
  const searchResultsElement = document.getElementById(`search-results-${category}`);
  searchResultsElement.innerHTML = ""; // Clear previous search results
  searchResultsElement.style.display = "grid";
  searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";
  //Minimum requirement to search 3 characters is met
  if (searchTerm.length >= 3) {
    
  tagsSearchUpdate(category, searchTerm, recipes, filteredRecipes);
    } else {
      defaultDisplayTags(category, recipes, filteredRecipes);
    }
}

function tagsSearchUpdate(category, searchTerm, recipes, filteredRecipes) {

    const searchResultsElement = document.getElementById(`search-results-${category}`);

    // Initialize variable to store filtered tags
    let filteredTags;

    // Get tags based on category search (ingredients, appliance, tools)
    if (category === "ingredients") {
      filteredTags = filteredRecipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient));
    } else if (category === "appliance") {
      filteredTags = filteredRecipes.map(recipe => recipe.appliance);
    } else if (category === "tools") {
      filteredTags = filteredRecipes.flatMap(recipe => recipe.ustensils);
    }

    //If searchTerm exist, filter tags to remove duplicates and to only keep tags that include the search term,
    //and to only keep tags that are present in the filtered recipes

    if (searchTerm) {
      filteredTags = Array.from(new Set(filteredTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))));
      //Only keep tags that are present in the filtered recipes
      filteredTags = filteredTags.filter(tag => filteredRecipes.some(recipe => {
        if (category === "ingredients") {
          return recipe.ingredients.some(ingredient => ingredient.ingredient === tag);
        }
        if (category === "appliance") {
          return recipe.appliance === tag;
        }
        if (category === "tools") {
          return recipe.ustensils.includes(tag);
        }
      }));
    
    } else {
      console.log("No search term")
      filteredTags = Array.from(new Set(filteredTags));
    }

    // Manipulate DOM to display tags according to category input search
    filteredTags.forEach(tag => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      tagElement.classList.add("tag-container");
      searchResultsElement.appendChild(tagElement);
      tagElement.addEventListener("click", (event) => handleTagClick(event, category, recipes));
    });

    // Add style for category tag search results : 3 tags per row
    searchResultsElement.style.display = "grid";
    searchResultsElement.style.gridTemplateColumns = "repeat(3, 1fr)";

    // If no tags match the category search input, display a message
    if (filteredTags.length === 0) {
      searchResultsElement.style.gridTemplateColumns = "1fr";
      searchResultsElement.innerHTML = '<p class="no-match"><i>Aucun résultat ne correspond à votre recherche</i></p>';
  }
}


export {displayRecipes, updateTagSearchResults, handleTagClick, refreshGallery};
