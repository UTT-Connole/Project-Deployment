# Recipe Management Application

## Overview
This web application manages a collection of recipes, allowing users to create, view, update, and delete recipes. It uses a **Flask server** with a **SQLite database** to manage data, and a **JavaScript-based client application** to interact with the API.

## Features
- **Create a new recipe** with details like title, ingredients, instructions, cooking time, and more.
- **View a list of all recipes** with key details.
- **Edit a recipe** to update its information.
- **Delete a recipe** from the collection.
- **AJAX support** for dynamic interaction without page reloads.
- **Cross-Origin Resource Sharing (CORS)** enabled to allow client-side JavaScript to communicate with the Flask API.

## Resource
- **Resource Name**: Recipe
- **Attributes**:
    - `title`: The title of the recipe (string)
    - `ingredients`: List of ingredients needed (string)
    - `instructions`: Steps to make the recipe (string)
    - `cook_time`: Cooking time in minutes (integer)
    - `prep_time`: Preparation time in minutes (integer)
    - `servings`: Number of servings the recipe makes (integer)
    - `difficulty_level`: Difficulty of the recipe (string, e.g., "Easy", "Medium", "Hard")
    - `cuisine`: Type of cuisine (string, e.g., "Italian", "Mexican")
    - `nutrition_facts`: Nutrition facts of the recipe (string)
    - `rating`: Rating from 0 to 5 (real)

## Database Schema
The following schema represents the `Recipe` resource in SQLite:
```sql
CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cook_time INTEGER,
    prep_time INTEGER,
    servings INTEGER,
    difficulty_level TEXT,
    cuisine TEXT,
    nutrition_facts TEXT,
    rating REAL
);

## Server API Endpoints
Each endpoint in the API adheres to REST principles and uses appropriate HTTP methods and paths:

### List Recipes
- **Method**: `GET`
- **Path**: `/recipes`
- **Description**: Returns a JSON array of all recipes.

### Retrieve Recipe
- **Method**: `GET`
- **Path**: `/recipes/<int:recipe_id>`
- **Description**: Returns a JSON object of a single recipe specified by `recipe_id`.

### Create Recipe
- **Method**: `POST`
- **Path**: `/recipes`
- **Description**: Creates a new recipe in the database using data from the request body.

### Replace Recipe
- **Method**: `PUT`
- **Path**: `/recipes/<int:recipe_id>`
- **Description**: Updates an existing recipe specified by `recipe_id` using data from the request body.

### Delete Recipe
- **Method**: `DELETE`
- **Path**: `/recipes/<int:recipe_id>`
- **Description**: Deletes the recipe specified by `recipe_id`.

## Cross-Origin Resource Sharing (CORS)
CORS is enabled in the server application to allow client requests from different origins. The server uses `Access-Control-Allow-Origin: *` to allow all origins for development purposes.

## Running the Application

### Prerequisites
- Python 3.7+
- Flask
- SQLite3

### Setup

1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Set up Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate
    ```

3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Server**:
    ```bash
    python server/server.py
    ```
    The server will be available at `http://127.0.0.1:8080`.

5. **Run the Client**:
    - Open `index.html` in a web browser, or if using a simple HTTP server, start it in the client directory:
    ```bash
    python -m http.server 3000
    ```
    The client will be available at `http://127.0.0.1:3000`.

## Additional Notes
- **AJAX requests**: The client application interacts with the server through AJAX requests, allowing for dynamic data updates without page reloads.
- **Error Handling**: The server returns appropriate error responses for invalid routes, invalid request methods, and missing resources.