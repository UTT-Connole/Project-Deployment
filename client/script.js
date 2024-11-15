document.addEventListener("DOMContentLoaded", () => {
    const recipeForm = document.getElementById("recipe-form");
    const recipeList = document.getElementById("recipe-list");
    const recipeDisplay = document.createElement("div"); // For displaying selected recipe
    recipeDisplay.id = "recipe-display";
    document.body.appendChild(recipeDisplay); // Add it to the page

    // Function to fetch and display recipes
    function fetchRecipes() {
        fetch("http://127.0.0.1:8080/recipes")
            .then(response => response.json())
            .then(data => {
                const recipeList = document.getElementById("recipe-list");
                recipeList.innerHTML = '<h2>Recipe List</h2>'; // Keep the label at the top
                if (data.length === 0) {
                    recipeList.innerHTML += '<p class="no-recipes-message">Add a recipe to see it appear here on the list.</p>';
                    return;
                }
                data.forEach(recipe => {
                    const recipeEl = document.createElement("div");
                    recipeEl.classList.add("recipe-item");
                    recipeEl.setAttribute("draggable", "true"); // Enable drag functionality
                    recipeEl.dataset.id = recipe.id; // Store the recipe ID in a custom data attribute

                    recipeEl.innerHTML = `
                        <span>${recipe.title}</span>
                        <div class="buttons">
                            <button class="select-btn" title="Select" onclick="selectRecipe(${recipe.id})"></button>
                            <button class="edit-btn" title="Edit" onclick="editRecipe(${recipe.id})"></button>
                            <button class="delete-btn" title="Delete" onclick="deleteRecipe(${recipe.id})"></button>
                        </div>
                    `;
                    recipeList.appendChild(recipeEl);
                    // Add event listeners for drag-and-drop
                    addDragAndDropListeners(recipeEl);
                });
            })
            .catch(error => console.error("Error fetching recipes:", error));
    }

    // Function to display selected recipe details
    window.selectRecipe = function (id) {
        fetch(`http://127.0.0.1:8080/recipes/${id}`)
            .then(response => response.json())
            .then(recipe => {
                const recipeDisplay = document.getElementById("recipe-display");
                recipeDisplay.innerHTML = `
                    <h2>Selected Recipe</h2> <!-- Static Header -->
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong></p>
                    <ul>${recipe.ingredients.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>
                    <p><strong>Instructions:</strong></p>
                    <p>${recipe.instructions}</p>
                    <p><strong>Cook Time:</strong> ${recipe.cook_time} mins</p>
                    <p><strong>Prep Time:</strong> ${recipe.prep_time} mins</p>
                    <p><strong>Servings:</strong> ${recipe.servings}</p>
                    <p><strong>Difficulty:</strong> ${recipe.difficulty_level}</p>
                    <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
                    <p><strong>Nutrition Facts:</strong></p>
                    <ul>${recipe.nutrition_facts.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>
                    <p><strong>Rating:</strong> ${recipe.rating}</p>
                `;
            })
            .catch(error => console.error("Error fetching recipe:", error));
    };
    
    // Function to add or update a recipe
    recipeForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(recipeForm);
        const recipeData = Object.fromEntries(formData.entries());
        recipeData.rating = recipeData.rating ? parseFloat(recipeData.rating) : null;  // Convert rating to float if provided
        const requestMethod = recipeData.id ? "PUT" : "POST";
        const url = recipeData.id ? `http://127.0.0.1:8080/recipes/${recipeData.id}` : "http://127.0.0.1:8080/recipes";

        fetch(url, {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        })
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(() => {
            fetchRecipes(); // Refresh list after saving
            recipeForm.reset();
            document.getElementById("form-title").textContent = "Add Recipe"; // Reset form title
        })
        .catch((error) => console.error("Error saving recipe:", error));
    });

    // Function to delete a recipe
    window.deleteRecipe = function (id) {
        if (confirm("Are you sure you want to delete this recipe?")) {
            fetch(`http://127.0.0.1:8080/recipes/${id}`, {
                method: "DELETE"
            })
                .then(fetchRecipes)
                .catch(error => console.error("Error deleting recipe:", error));
        }
    };

    // Function to populate form with recipe data for editing
    window.editRecipe = function (id) {
        console.log("Fetching recipe ID:", id);  // Log the ID being passed in
        fetch(`http://127.0.0.1:8080/recipes/${id}`)
            .then(response => response.json())
            .then(recipe => {
                document.getElementById("form-title").textContent = "Edit Recipe";
                document.getElementById("title").value = recipe.title;
                document.getElementById("ingredients").value = recipe.ingredients;
                document.getElementById("instructions").value = recipe.instructions;
                document.getElementById("cook-time").value = recipe.cook_time; // Ensuring cook_time maps correctly
                document.getElementById("prep-time").value = recipe.prep_time; // Ensuring prep_time maps correctly
                document.getElementById("servings").value = recipe.servings;
                document.getElementById("difficulty-level").value = recipe.difficulty_level; // Ensuring difficulty_level maps
                document.getElementById("cuisine").value = recipe.cuisine;
                document.getElementById("nutrition-facts").value = recipe.nutrition_facts; // Ensuring nutrition_facts maps
                document.getElementById("rating").value = recipe.rating;
                document.getElementById("id").value = id; // Set the hidden ID field for future requests
            })
            .catch(error => console.error("Error fetching recipe:", error));
    };
    
    

    // Initial fetch to populate the recipe list
    fetchRecipes();
});

// Select the text areas you want to expand
const expandableTextareas = document.querySelectorAll("#ingredients, #instructions, #nutrition-facts");
const formContainer = document.getElementById("recipe-form");

expandableTextareas.forEach(textarea => {
    textarea.addEventListener("focus", () => {
        textarea.style.height = "150px"; // Expand text area on focus
        formContainer.style.height = "auto"; // Allow form container to expand
    });

    textarea.addEventListener("input", () => {
        // Adjust textarea height based on content
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        formContainer.style.height = "auto"; // Adjust form container height
    });

    textarea.addEventListener("blur", () => {
        // Reset textarea and container height on blur
        textarea.style.height = "50px";
        formContainer.style.height = "auto";
    });
});

function addDragAndDropListeners(recipeEl) {
    recipeEl.addEventListener("dragstart", handleDragStart);
    recipeEl.addEventListener("dragover", handleDragOver);
    recipeEl.addEventListener("drop", handleDrop);
    recipeEl.addEventListener("dragend", handleDragEnd);
}

function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    event.target.classList.add("dragging");
}

function handleDragOver(event) {
    event.preventDefault(); // Allow drop
    const draggingElement = document.querySelector(".dragging");
    const recipeList = document.getElementById("recipe-list");
    const afterElement = getDragAfterElement(recipeList, event.clientY);

    if (afterElement === null) {
        recipeList.appendChild(draggingElement);
    } else {
        recipeList.insertBefore(draggingElement, afterElement);
    }
}

function handleDrop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");

    // Remove "dragging" class after drop
    const draggedElement = document.querySelector(`[data-id='${draggedId}']`);
    draggedElement.classList.remove("dragging");

    // Update the order on drop
    updateRecipeOrder();
}

function handleDragEnd() {
    document.querySelectorAll(".recipe-item").forEach(item => item.classList.remove("dragging"));
}

// Helper function to determine where to place the element on drop
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".recipe-item:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Function to update the order in the backend
function updateRecipeOrder() {
    const recipeItems = [...document.querySelectorAll(".recipe-item")];
    const newOrder = recipeItems.map((item, index) => ({
        id: parseInt(item.dataset.id),
        order: index + 1
    }));

    fetch("http://127.0.0.1:8080/recipes/update-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update order");
        return response.json();
    })
    .then(data => console.log(data.message))
    .catch(error => console.error("Error updating recipe order:", error));
}