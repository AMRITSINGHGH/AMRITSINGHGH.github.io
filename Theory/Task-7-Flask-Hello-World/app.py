from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello World from Flask!"


@app.route("/about")
def about():
    return "<h1>About Flask</h1><p>This page is created using Python Flask.</p>"


if __name__ == "__main__":
    app.run(debug=True)
