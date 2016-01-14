from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return "Hello there!"

if __name__ == "__main__":
    import logging
    logging.basicConfig(filename='flask.log', level=logging.INFO)
    app.run()

