const express = require("express");
const fs = require("fs").promises;

const app = express();
const filePath = "../data/recipea-data.json";

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
})

app.use(express.json());

const getRecipes = async () => {
  const recipes = await fs.readFile(filePath, "utf8");
  return recipes;
};

const getRecipe = async (id) => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data)[id];
};


const deleteRecipe = async (id) => {
  const data = await fs.readFile(filePath, "utf8");
  const recipes = JSON.parse(data).filter((recipe) => recipe.id !== id);
  const jsonRecipes = JSON.stringify(recipes, null, 2);
  await fs.writeFile(filePath, jsonRecipes);
};


const createRecipe = async (newRecipe) => {
  const data = await fs.readFile(filePath, "utf8");
  const recipe = [...JSON.parse(data), newRecipe];
  const jsonVersion = JSON.stringify(recipe, null, 2);
  await fs.writeFile(filePath, jsonVersion, "utf8");
};

const updateRecipe = async (id, updatedRecipe) => {
  const data = await fs.readFile(filePath, "utf8");
  const recipe = JSON.parse(data).map((recipe, i) => {
    return i === id ? updatedRecipe : recipe;
  });

  const jsonVersion = JSON.stringify(recipe, null, 2);
  await fs.writeFile(filePath, jsonVersion, "utf8");
}

app.get("/find-recipes", async (req, res) => {
  const recipes = await getRecipes();
  res.send(recipes);
});

app.get("/find-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  const recipe = await getRecipe(id);
  const jsonRecipe = JSON.stringify(recipe, null, 2);
  res.send(jsonRecipe);
});

app.delete("/trash-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  await deleteRecipe(id);
  res.send("Recipe with id " + id + " has been deleted.");
});

app.post("/create-recipe", async (req, res) => {
  await createRecipe({name: req.body.name, cookingMethod: req.body.cookingMethod, ingredients: req.body.ingredients});
  res.send("Recipe successfully written to the file!");
});

app.put("/update-recipe/:id", async (req, res) => {
  const updatedRecipe = {
    name: req.body.name,
    cookingMethod: req.body.cookingMethod,
    ingredients: req.body.ingredients
  };

  await updateRecipe(Number(req.params.id), updatedRecipe);
  res.send(updatedRecipe);
});