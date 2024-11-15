import sqlite3

class RecipeDatabase:
    def __init__(self, db_name="recipe_database.db"):
        self.db_name = db_name
        self._initialize_database()

    def _initialize_database(self):
        connection = self.connect()
        cursor = connection.cursor()
        # Define the database schema for the Recipe table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Recipe (
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
            )
        ''')
        connection.commit()
        connection.close()

    def connect(self):
        """Creates and returns a connection to the database."""
        return sqlite3.connect(self.db_name)

    def get_all_recipes(self):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Recipe")
        rows = cursor.fetchall()
        connection.close()
        
        # Convert the result to a list of dictionaries for JSON compatibility
        recipes = [
            {
                "id": row[0],
                "title": row[1],
                "ingredients": row[2],
                "instructions": row[3],
                "cook_time": row[4],
                "prep_time": row[5],
                "servings": row[6],
                "difficulty_level": row[7],
                "cuisine": row[8],
                "nutrition_facts": row[9],
                "rating": row[10]
            } for row in rows
        ]
        return recipes

    # The rest of the CRUD methods follow as before (no changes):
    def get_recipe(self, recipe_id):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Recipe WHERE id = ?", (recipe_id,))
        row = cursor.fetchone()
        connection.close()
        
        if row:
            return {
                "id": row[0],
                "title": row[1],
                "ingredients": row[2],
                "instructions": row[3],
                "cook_time": row[4],
                "prep_time": row[5],
                "servings": row[6],
                "difficulty_level": row[7],
                "cuisine": row[8],
                "nutrition_facts": row[9],
                "rating": row[10]
            }
        else:
            return None

    def create_recipe(self, title, ingredients, instructions, cook_time, prep_time, servings, difficulty_level, cuisine, nutrition_facts, rating):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute('''
            INSERT INTO Recipe (title, ingredients, instructions, cook_time, prep_time, servings, difficulty_level, cuisine, nutrition_facts, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (title, ingredients, instructions, cook_time, prep_time, servings, difficulty_level, cuisine, nutrition_facts, rating))
        connection.commit()
        new_id = cursor.lastrowid
        connection.close()
        return new_id

    def update_recipe(self, recipe_id, title, ingredients, instructions, cook_time, prep_time, servings, difficulty_level, cuisine, nutrition_facts, rating):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute('''
            UPDATE Recipe
            SET title = ?, ingredients = ?, instructions = ?, cook_time = ?, prep_time = ?, servings = ?, difficulty_level = ?, cuisine = ?, nutrition_facts = ?, rating = ?
            WHERE id = ?
        ''', (title, ingredients, instructions, cook_time, prep_time, servings, difficulty_level, cuisine, nutrition_facts, rating, recipe_id))
        connection.commit()
        connection.close()
        return cursor.rowcount > 0

    def delete_recipe(self, recipe_id):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM Recipe WHERE id = ?", (recipe_id,))
        connection.commit()
        connection.close()
        return cursor.rowcount > 0