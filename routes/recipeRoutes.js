const express = require('express');
const router = express.Router();
const { getRecipes, addRecipe } = require('../controllers/recipeController');

// GET all recipes
router.get('/', getRecipes);

// POST new recipe
router.post('/', addRecipe);

module.exports = router;