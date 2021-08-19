from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from .emotionDetection import getEmotion

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    """
    Returns 200 to test root endpoint

    :return: 200
    """
    return "Works", 200


@app.route("/imageToEmotion", methods=["POST"])
@cross_origin()
def imageToEmotion():
    """
    Returns an emotion based on an image

    :param image: jpg file
    :return: 200 [emotion, score]
    :return: 500 if model fails to detect / interval server error
    """
    try:
        image = request.files.get("image")
        result = getEmotion(image)
        if result:
            return jsonify(result), 200
        else:
            return "No result available", 500
    except Exception as e:
        return str(e), 500


if __name__ == "__main__":
    app.run()
