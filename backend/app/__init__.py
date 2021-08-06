import os
from flask.helpers import url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from os import error
from flask import Flask, request, jsonify, url_for, redirect
from . emotionDetection import getEmotion 
import tensorflow as tf

app = Flask(__name__)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

print(CLIENT_ID)
print(CLIENT_SECRET)

@app.route("/")
def home():
    return "Works"


@app.route("/health")
def health():
    return "Works"
  
@app.route("/login")
def login():
    auth_url = createSpotifyOAuth().get_authorize_url()
    return redirect(auth_url)

@app.route("/authorize")
def authorize():
    return 'authorize'

def createSpotifyOAuth():
    return SpotifyOAuth(
        client_id=''.join(CLIENT_ID),
        client_secret=''.join(CLIENT_SECRET),
        redirect_uri=url_for('authorize', _external=True),
        scope='playlist-modify-public user-library-read user-library-modify user-read-email user-read-private',
    )
    
@app.route("/imageToEmotion", methods=['POST'])
def imageToEmotion():
    """
    Detect emotion in image
    ___ 
    post:
        form-data:
        - image : jpg file

        response:
            200:
                content: [emotion, score]
            500 if model fails to detect / interval server errore 


    """
    try:
        image = request.files.get('image')
        result = getEmotion(image)
        if result:
            return jsonify(result), 200
        else:
            return "No result available", 500
    except Exception as e:
            return str(e), 500


<<<<<<< HEAD

=======
>>>>>>> 387422779537708efec19d68036e3bfc3c96b469
if __name__ == "__main__":
    app.run()
