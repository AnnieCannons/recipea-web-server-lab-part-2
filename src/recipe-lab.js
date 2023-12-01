//imports modules(set of functions/ code commands that are pre-written/built in) needed to run the app
const express = require("express");
const fs = require("fs").promises;

const app = express();

app.listen(3000, () => {
    console.log("Server listening on port 3000.");
})

app.use(express.json());

// Accesses all recipes
const getAllRecipes = async() => {
    const recipes = await fs.readFile("../data/recipea-data.json", "utf8");

    return recipes;
};

// Accesses one recipe
const getRecipe = async(id) => {
    const data = await fs.readFile("../data/recipea-data.json", "utf8");

   const recipes = JSON.parse(data);
   return recipes.find((recipe, i) => i === id);
};

// Deletes one recipe
const deleteRecipe = async(id) => {
    const data = await fs.readFile("../data/recipea-data.json", "utf8");
    const recipes = JSON.parse(data).filter((recipe, i) => i !==id);
    const jsonRecipes = JSON.stringify(recipes, null, 2);
    await fs.writeFile("../data/recipea-data.json", jsonRecipes);
}

// Creates a new recipe
const createRecipe = async(name, cookingMethod, ingredients) => {
    const recipeArray = await fs.readFile("../data/recipea-data.json", "utf8");
    const recipeList = JSON.parse(recipeArray);
    const newRecipe = {
        name: name,
        cookingMethod: cookingMethod, 
        ingredients: ingredients
    }
    recipeList.push(newRecipe);
    const jsonAddRecipe = JSON.stringify(recipeList, null, 2);
    await fs.writeFile("../data/recipea-data.json", jsonAddRecipe);
}

// Updates an existing recipe
const updateRecipe = async(id, updatedRecipe) => {
const data = await fs.readFile("../data/recipea-data.json", "utf8");
const recipe = JSON.parse(data).map((recipe, i) => {
  return i === id ? updatedRecipe : recipe;
});
const jsonVersion = JSON.stringify(recipe, null, 2);
await fs.writeFile("../data/recipea-data.json", jsonVersion, "utf8");
};



//API CALLS

// API Call for finding all recipes
app.get("/find-all-recipes", async(req, res) => {
    const recipes = await getAllRecipes();
    res.send(recipes);
});

app.get("/find-recipe/:id", async(req, res) => {
    const recipe = await getRecipe(Number(req.params.id));
    res.send(JSON.stringify(recipe));
});

app.delete("/delete-recipe/:id", async (req, res) => {
    await deleteRecipe(Number(req.params.id));
    res.send("Successfully deleted recipe.");
  });

app.post("/create-recipe", async(req, res) => {
    await createRecipe(req.body.name, req.body.cookingMethod, req.body.ingredients);
    res.send("Recipe successfully written to the file!");
})

app.put("/update-recipe/:id", async(req, res) => {
    const updatedRecipe = {
        name: req.body.name,
        cookingMethod: req.body.cookingMethod,
        ingredients: req.body.ingredients,
      };
      await updateRecipe(Number(req.params.id), updatedRecipe);
      res.send(updatedRecipe);
    });
