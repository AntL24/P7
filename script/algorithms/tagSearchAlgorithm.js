//Alternative search algorithm for tags
function tagSearchAlgorithm(recipes, tags) {
  console.log("Tags in search algorithm: " + JSON.stringify(tags, null, 2));

  recipes = recipes.filter(recipe => {
    return tags.every(tag => {
      console.log("Tag in search algorithm: " + JSON.stringify(tag, null, 2));
      const tagCategory = tag.category;
      const tagText = tag.name.toLowerCase();

      if (tagCategory === "ingredients") {
        return recipe.ingredients.some(ingredient =>
          ingredient.ingredient.toLowerCase().includes(tagText)
        );
      } else if (tagCategory === "appliance") {
        return recipe.appliance.toLowerCase().includes(tagText);
      } else if (tagCategory === "tools") {
        return recipe.ustensils.some(ustensil =>
          ustensil.toLowerCase().includes(tagText)
        );
      }
      return false;
    });
  });

  return recipes;
}

export { tagSearchAlgorithm };
