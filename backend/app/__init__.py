from flask import (
    Flask,
    redirect
)
import os
from flask.helpers import url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth

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

if __name__ == "__main__":
    app.run()
