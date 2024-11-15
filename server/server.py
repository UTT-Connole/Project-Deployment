from flask import Flask, request, jsonify, make_response
from database import RecipeDatabase

app = Flask(__name__)
db = RecipeDatabase()

# Applying CORS headers to every response
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# CRUD routes
@app.route("/recipes", methods=["GET"])
def list_recipes():
    recipes = db.get_all_recipes()
    return jsonify(recipes), 200

@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def retrieve_recipe(recipe_id):
    recipe = db.get_recipe(recipe_id)
    if recipe:
        return jsonify(recipe), 200
    return jsonify({"error": "Recipe not found"}), 404

@app.route("/recipes", methods=["POST"])
def create_recipe():
    data = request.get_json()
    if db.create_recipe(
        data['title'], 
        data['ingredients'], 
        data['instructions'], 
        int(data['cook_time']),
        int(data['prep_time']), 
        int(data['servings']),
        data['difficulty_level'],
        data['cuisine'],
        data['nutrition_facts'],
        float(data['rating'])
    ):
        return jsonify({"message": "Recipe created successfully"}), 201
    return jsonify({"error": "Failed to create recipe"}), 400

@app.route("/recipes/<int:recipe_id>", methods=["PUT"])
def replace_recipe(recipe_id):
    data = request.get_json()
    # Pass individual fields to match the parameters in update_recipe
    if db.update_recipe(
        recipe_id,
        data['title'], 
        data['ingredients'], 
        data['instructions'], 
        int(data['cook_time']),
        int(data['prep_time']), 
        int(data['servings']),
        data['difficulty_level'],
        data['cuisine'],
        data['nutrition_facts'],
        float(data['rating'])
    ):
        return jsonify({"message": "Recipe updated successfully"}), 200
    return jsonify({"error": "Failed to update recipe"}), 400

@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    if db.delete_recipe(recipe_id):
        return jsonify({"message": "Recipe deleted successfully"}), 200
    return jsonify({"error": "Failed to delete recipe"}), 404

# Handling OPTIONS requests for preflight
@app.route('/recipes', methods=['OPTIONS'])
@app.route('/recipes/<int:recipe_id>', methods=['OPTIONS'])
def handle_options(recipe_id=None):
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response, 204

if __name__ == "__main__":
    app.run(port=8080, debug=True)