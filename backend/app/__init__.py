from os import error
from flask import Flask, request, jsonify
from . emotionDetection import getEmotion 
import tensorflow as tf

app = Flask(__name__)

@app.route("/")
def home():
    return "Works"


@app.route("/health")
def health():
    return "Works"

    
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



if __name__ == "__main__":
    app.run()
