#!/usr/bin/python3

from flask import Flask, jsonify, render_template, Request
app = Flask(__name__)

@app.route("/api")
def index():
    return """
        Welcome to my website!<br /><br />
        <a href="/hello">Go to hello world</a>
    """

@app.route("/api/hello")
def hello():
    return """
        Hello World!<br /><br />
        <a href="/api">Back to index</a>
    """

@app.route("/api/search", methods=['POST', 'GET'])
def search():
    courses = {
        "CS": "Computer Science",
        "BIO": "Biology",
        "CHEM": "Chemistry"
    }
    return courses


if __name__ == '__main__':
    # Will make the server available externally as well
    app.run(host='0.0.0.0')