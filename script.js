const mealResult = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealDetails = document.querySelector(".meal-details");
const loader = document.getElementById("loader");

// Event listeners
searchBtn.addEventListener("click", getMealByIngredient);
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getMealByIngredient();
    }
});
recipeCloseBtn.addEventListener("click", () => {
    mealDetails.classList.remove("showRecipe");
});

// Fetch meals by ingredient
async function getMealByIngredient() {
    let ingredient = searchInput.value.trim();
    if (ingredient === "") {
        mealResult.innerHTML = '<p class="notFound">Please enter an ingredient.</p>';
        return;
    }
    
    // Show loader
    loader.style.display = "block";

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    
    // Hide loader
    loader.style.display = "none";

    if (data.meals) {
        mealResult.innerHTML = data.meals.map(meal => `
            <div class="meal-item">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn" data-id="${meal.idMeal}">Get Recipe</a>
                </div>
            </div>
        `).join("");
        document.querySelectorAll(".recipe-btn").forEach(btn => {
            btn.addEventListener("click", getMealDetails);
        });
    } else {
        mealResult.innerHTML = '<p class="notFound">No meals found with that ingredient.</p>';
    }
}

// Fetch meal details
async function getMealDetails(event) {
    let mealID = event.target.getAttribute("data-id");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();
    const meal = data.meals[0];
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-meal-img">
        <p class="recipe-category">${meal.strCategory}</p>
        <h3>Instructions</h3>
        <p class="recipe-instruct">${meal.strInstructions}</p>
        <div class="recipe-link">
            <a href="${meal.strSource}" target="_blank">View Full Recipe</a>
        </div>
    `;
    mealDetails.classList.add("showRecipe");
}
