from pymongo import MongoClient
from bson import ObjectId
from flask import Flask, render_template, request, jsonify, url_for, redirect
from transformers import pipeline

from ctransformers import AutoModelForCausalLM

# Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
llm = AutoModelForCausalLM.from_pretrained("models\OpenHermes-2.5-Mistral-7B-GGUF", model_file="openhermes-2.5-mistral-7b.Q4_K_M.gguf", model_type="mistral", gpu_layers=32)

# print(llm("once upon a time" ))

# superhero, action, drama, horror, thriller, sci_fi

from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase" # ADD yours
mongo = PyMongo(app)

story_gen = pipeline("text-generation", "models\gpt2-genre-story-generator", device=0)

@app.route('/')
def index():
    mongo.db.inventory.insert_one({"a": 1})
    return render_template("index.html")

@app.route('/editor')
def editor():
    return render_template('editor.html')

def updateStory(story, genre):
    print(story )
    # generated_output = story_gen(f"<BOS> <{genre}> {story}")
    generated_output = llm(story)   
    generated_text = generated_output
    # generated_output = story_gen(
    # f"<BOS> <{genre}> {story}",
    # max_new_tokens=100,  # Generate new tokens
    # do_sample=True,      # Enable sampling for randomness
    # temperature=0.7,     # Controls randomness
    # top_k=50,            # Limits the sampling pool to the top 50 tokens
    # top_p=0.95,          # Use nucleus sampling (probability threshold for diversity)
    # no_repeat_ngram_size=2,  # Avoid repeating 2-grams
    # pad_token_id=story_gen.tokenizer.pad_token_id  # Specify pad token id if necessary
    # )

    # generated_text = generated_output[0]['generated_text']  # Extract the generated text from the pipeline output
    # clean_text = generated_text.replace("<BOS> <horror>", "").strip()
    
    print(generated_text)
    print(genre)
    return generated_text  # Return the generated text

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    story = data.get('story')
    gen = data.get('extraInfo')
    # Process or use the data here we're simply returning it
    story = updateStory(story,gen)
    print(gen)
    return jsonify(message=f"{story}")

@app.route('/publish', methods=['GET', 'POST'])
def publish():
    if request.method == 'GET':
        title = request.args.get('title', 'Untitled')
        author = request.args.get('author', 'Anonymous')
        story = request.args.get('story', '')

        return render_template('publish.html', title=title, author=author, story=story)

    if request.method == 'POST':
        data = request.json
        title = data.get('title', 'Untitled')
        author = data.get('author', 'Anonymous')
        story = data.get('story', '')

        # Save to MongoDB
        mongo.db.stories.insert_one({
            "title": title,
            "author": author,
            "story": story
        })

        return jsonify(message="Story saved successfully!", status="success")

@app.route('/library', methods=['GET'])
def library():
    books = mongo.db.stories.find({}, {"title": 1, "author": 1, "rating": 1})  # Retrieve title, author, and rating
    books_list = [{"_id": str(book["_id"]), "title": book["title"], "author": book["author"], "rating": book.get("rating", 0)} for book in books]
    return render_template('library.html', books=books_list)

@app.route('/book/<id>', methods=['GET', 'POST'])
def book_details(id):
    if request.method == 'GET':
        book = mongo.db.stories.find_one({"_id": ObjectId(id)})
        if not book:
            return "Book not found", 404
        book_data = {
            "_id": str(book["_id"]),
            "title": book["title"],
            "author": book["author"],
            "story": book["story"],
            "rating": book.get("rating", 0)
        }
        return render_template('book.html', book=book_data)

    if request.method == 'POST':  # Update Rating
        data = request.json
        rating = data.get("rating", 0)
        mongo.db.stories.update_one({"_id": ObjectId(id)}, {"$set": {"rating": rating}})
        return jsonify(message="Rating updated successfully!", status="success")

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
