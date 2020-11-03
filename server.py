from flask import Flask, render_template, jsonify, request

import os
import secrets
import requests

app = Flask(__name__)

app.secret_key = "" #need a secret key if i wanna use flask and session 

@app.route('/')
def render_homepage():

    return render_template('homepage.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')