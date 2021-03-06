import os
from flask.helpers import url_for
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS
from flask import Flask, request, jsonify, url_for, redirect
from flask_pymongo import PyMongo
import base64
from base64 import b64encode
import datetime
from urllib.parse import urlencode
import requests
import json
import random
import six

app = Flask(__name__)
app.config["MONGO_URI"] = (
    "mongodb://"
    + os.environ["MONGODB_USERNAME"]
    + ":"
    + os.environ["MONGODB_PASSWORD"]
    + "@"
    + os.environ["MONGODB_HOSTNAME"]
    + ":27017/"
    + os.environ["MONGODB_DATABASE"]
    + "?authSource=admin"
)
mongo = PyMongo(app)
db = mongo.db
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")


@app.route("/")
def home():
    """
    Returns 200 to test root endpoint

    :return: 200
    """
    return "Works", 200


@app.route("/health")
def health():
    """
    Returns 200 to test health endpoint

    :return: 200
    """
    return "Works", 200


@app.route("/login")
def login():
    """
    Returns an Spotify Authorization Token

    :return: Spotify Token
    """
    auth_url = createSpotifyOAuth().get_authorize_url()
    return redirect(auth_url)


@app.route("/authorize")
def authorize():
    return "authorize"


@app.route("/get-songs")
def getSongs():
    try:
        _todos = db.songs.find()

        item = {}
        data = []
        for todo in _todos:
            item = {"id": str(todo["_id"]), "link": todo["link"]}
            data.append(item)

        return jsonify(status=True, data=data)
    except Exception as e:
        return str(e), 500


def createSpotifyOAuth():
    """
    Returns an Spotify Authorization Token

    :return: Spotify Token
    """
    return SpotifyOAuth(
        client_id="".join(CLIENT_ID),
        client_secret="".join(CLIENT_SECRET),
        redirect_uri=url_for("authorize", _external=True),
        scope="playlist-modify-public user-library-read user-library-modify user-read-email user-read-private",
    )


"""
The following code is done with the help of this link:
https://www.youtube.com/watch?v=xdq6Gz33khQ
"""


class SpotifyAPI(object):
    """
    Spotify class to access the API methods
    """

    access_token = None
    access_token_expires = datetime.datetime.now()
    access_token_did_expire = True
    client_id = None
    client_secret = None
    token_url = "https://accounts.spotify.com/api/token"

    def __init__(self, client_id, client_secret, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_id = client_id
        self.client_secret = client_secret

    def get_client_credentials(self):
        """
        Returns a base64 encoded string
        """
        client_id = self.client_id
        client_secret = self.client_secret
        if client_secret == None or client_id == None:
            raise Exception("You must set client_id and client_secret")
        client_creds = f"{client_id}:{client_secret}"
        client_creds_b64 = base64.b64encode(client_creds.encode())
        return client_creds_b64.decode()

    def get_token_headers(self):
        client_creds_b64 = self.get_client_credentials()
        return {"Authorization": f"Basic {client_creds_b64}"}

    def get_token_data(self):
        return {"grant_type": "client_credentials"}

    def perform_auth(self):
        token_url = self.token_url
        token_data = self.get_token_data()
        token_headers = self.get_token_headers()
        r = requests.post(token_url, data=token_data, headers=token_headers)
        if r.status_code not in range(200, 299):
            raise Exception("Could not authenticate client.")
        data = r.json()
        now = datetime.datetime.now()
        access_token = data["access_token"]
        expires_in = data["expires_in"]  # seconds
        expires = now + datetime.timedelta(seconds=expires_in)
        self.access_token = access_token
        self.access_token_expires = expires
        self.access_token_did_expire = expires < now
        return True

    def get_access_token(self):
        token = self.access_token
        expires = self.access_token_expires
        now = datetime.datetime.now()
        if expires < now:
            self.perform_auth()
            return self.get_access_token()
        elif token == None:
            self.perform_auth()
            return self.get_access_token()
        return token

    def get_resource_header(self):
        access_token = self.get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        return headers

    def get_resource(self, lookup_id, resource_type="albums", version="v1"):
        endpoint = f"https://api.spotify.com/{version}/{resource_type}/{lookup_id}"
        headers = self.get_resource_header()
        r = requests.get(endpoint, headers=headers)
        if r.status_code not in range(200, 299):
            return {}
        return r.json()

    def base_search(self, query_params):
        headers = self.get_resource_header()
        endpoint = "https://api.spotify.com/v1/search"
        lookup_url = f"{endpoint}?{query_params}"
        r = requests.get(lookup_url, headers=headers)
        if r.status_code not in range(200, 299):
            return {}
        return r.json()

    def search(
        self, query=None, operator=None, operator_query=None, search_type="artist"
    ):
        if query == None:
            raise Exception("A query is required")
        if isinstance(query, dict):
            query = " ".join([f"{k}:{v}" for k, v in query.items()])
        if operator != None and operator_query != None:
            if operator.lower() == "or" or operator.lower() == "not":
                operator = operator.upper()
                if isinstance(operator_query, str):
                    query = f"{query} {operator} {operator_query}"
        query_params = urlencode({"q": query, "type": search_type.lower()})
        return self.base_search(query_params)


@app.route("/emotionToPlaylist", methods=["POST"])
def getPlaylist():
    """
    Returns a playlist based on the emotion and top genres of the user
    """
    spotify = SpotifyAPI(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
    spotify.perform_auth()
    emotion = request.json["emotion"]
    access_token = request.json["token"]
    auth_headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    response = requests.get(
        "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
        headers=auth_headers,
    )
    artists = response.json()["items"]
    random_artist = random.choice(artists)
    genres = random_artist["genres"]
    random_genre = random.choice(genres)

    return json.dumps(spotify.search({emotion: random_genre}, search_type="playlist"))


@app.route("/getCredentials", methods=["POST"])
def getCredentials():
    """
    Returns access token, refresh token and expires in seconds
    """
    url = "https://accounts.spotify.com/api/token"
    client_id = request.json["client_id"]
    client_secret = request.json["client_secret"]
    code = request.json["code"]
    redirect_uri = request.json["redirect_uri"]
    scopes = [
        "user-top-read",
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "user-library-modify",
        "user-read-currently-playing",
        "user-read-playback-state",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-modify-playback-state",
    ]
    auth_header = b64encode(
        six.text_type(client_id + ":" + client_secret).encode("ascii")
    )
    headers = {"Authorization": "Basic %s" % auth_header.decode("ascii")}
    data = {
        "redirect_uri": redirect_uri,
        "code": code,
        "grant_type": "authorization_code",
        "scopes": scopes,
    }
    r = requests.post(url, data=data, headers=headers, verify=True)
    token_info = r.json()
    return json.dumps(token_info)


if __name__ == "__main__":
    app.run()
