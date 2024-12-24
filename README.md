# Narretiviea  

Steps to get it working on your own device  
the model here used is  
## OpenHermes-2.5-Mistral-7B-GGUF 
https://ollama.com/library/openhermes  
https://huggingface.co/teknium/OpenHermes-2.5-Mistral-7B  

after you clone this repo or download zip and extract it  
you will have a folder Narretiviea-main  
containing these files  

`\models`  
`\static`    
`\templates`  
`app.py`  
`README.md`  

so download the model from the [Links](#openhermes-25-mistral-7b-gguf) given above

and put the model folder inside models.

your models folder should look like this:
or you can also specify the model path in app.py -> llm

- `\Narretiviea-main`
  - `\models`
    - `\OpenHermes-2.5-Mistral-7B-GGUF`
      - `\.git` (if downloaded using Git)
      - `.gitattributes` (if downloaded using Git)
      - `config.json` (if downloaded using Git)
      - `openhermes-2.5-mistral-7b.Q4_K_M.gguf`
      - `openhermes-2.5-mistral-7b.Q8_0.gguf`
      - `README.md` (if downloaded using Git)

- `\static`
- `\templates`
- `app.py`
- `README.md`

for database I am using [Mongo DB](https://www.mongodb.com/)
you can just run it or specify the database in app.config["MONGO_URI"]
app.py something like mongodb://localhost:27017/myDatabase

```bash
pip install -r requirements.txt
```

now open the folder in your terminal and run the app.py file.

python app.py
