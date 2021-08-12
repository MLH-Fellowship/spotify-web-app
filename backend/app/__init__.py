import os
from flask.helpers import url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from os import error, stat
from flask import Flask, request, jsonify, url_for, redirect
from flask_pymongo import PyMongo
from . emotionDetection import getEmotion 
import tensorflow as tf

import base64
import datetime
from urllib.parse import urlencode
import requests

app = Flask(__name__)
app.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + ':27017/' + os.environ['MONGODB_DATABASE']

mongo = PyMongo(app)
db = mongo.db

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

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

@app.route("/get-songs")
def getSongs():
    _todos = db.songs.find()

    item = {}
    data = []
    for todo in _todos:
        item = {
            'id': str(todo['_id']),
            'link': todo['link']
        }
        data.append(item)
        
    return jsonify(
        status = True,
        data = data
    )

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


#The following code is done with the help of this link:
# https://www.youtube.com/watch?v=xdq6Gz33khQ
class SpotifyAPI(object):
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
        return {
            "Authorization": f"Basic {client_creds_b64}"
        }
    
    def get_token_data(self):
        return {
            "grant_type": "client_credentials"
        } 
    
    def perform_auth(self):
        token_url = self.token_url
        token_data = self.get_token_data()
        token_headers = self.get_token_headers()
        r = requests.post(token_url, data=token_data, headers=token_headers)
        if r.status_code not in range(200, 299):
            raise Exception("Could not authenticate client.")
            # return False
        data = r.json()
        now = datetime.datetime.now()
        access_token = data['access_token']
        expires_in = data['expires_in'] # seconds
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
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        return headers
        
        
    def get_resource(self, lookup_id, resource_type='albums', version='v1'):
        endpoint = f"https://api.spotify.com/{version}/{resource_type}/{lookup_id}"
        headers = self.get_resource_header()
        r = requests.get(endpoint, headers=headers)
        if r.status_code not in range(200, 299):
            return {}
        return r.json()

    def base_search(self, query_params): # type
        headers = self.get_resource_header()
        endpoint = "https://api.spotify.com/v1/search"
        lookup_url = f"{endpoint}?{query_params}"
        r = requests.get(lookup_url, headers=headers)
        if r.status_code not in range(200, 299):  
            return {}
        return r.json()
    
    def search(self, query=None, operator=None, operator_query=None, search_type='artist' ):
        if query == None:
            raise Exception("A query is required")
        if isinstance(query, dict):
            query = " ".join([f"{k}:{v}" for k,v in query.items()])
        if operator != None and operator_query != None:
            if operator.lower() == "or" or operator.lower() == "not":
                operator = operator.upper()
                if isinstance(operator_query, str):
                    query = f"{query} {operator} {operator_query}"
        query_params = urlencode({"q": query, "type": search_type.lower()})
        print(query_params)
        return self.base_search(query_params)

@app.route("/spotify")
def getPlaylist():
    spotify = SpotifyAPI(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
    spotify.perform_auth()
    return spotify.search({"sad":"lofi"}, search_type='playlist')
   


if __name__ == "__main__":
    app.run()
