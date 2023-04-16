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

//Update results for tag search (may be ingredients, appliance or ustensils)
function updateTagSearchResults(category, searchTerm, recipes) {
  const searchResultsElement = document.getElementById(`search-results-${category}`);
  searchResultsElement.innerHTML = "";//Clear previous search results

  if (searchTerm.length < 3) {
    searchResultsElement.innerHTML = '<p class="choose-keyword"><i>Choisissez un mot-clef pour lancer votre recherche</i></p>';
  } else if (searchTerm.length >= 3) {

    let filteredTags;
    //Get tags based on category
    if (category === "ingredients") {
      filteredTags = recipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient));
    } else if (category === "appliance") {
      filteredTags = recipes.map(recipe => recipe.appliance); 
      console.log("filteredTags", filteredTags)
    } else if (category === "tools") {
      filteredTags = recipes.flatMap(recipe => recipe.ustensils);
    }

    //Filter tags to remove duplicates and to only keep tags that include the search term
    filteredTags = Array.from(new Set(filteredTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))));
    //Manipulate DOM to display tags
    filteredTags.forEach(tag => {
      const tagElement = document.createElement("p");
      tagElement.textContent = tag;
      searchResultsElement.appendChild(tagElement);
    });

    //If no tags match the search term, display a message
    if (filteredTags.length === 0) {
      searchResultsElement.innerHTML = '<p class="no-match"><i>Aucun résultat ne correspond à votre recherche</i></p>';
    }
  }
}

export {displayRecipes, updateTagSearchResults};