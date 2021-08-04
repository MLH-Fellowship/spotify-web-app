from flask import (
    Flask
)

app = Flask(__name__)

@app.route("/")
def home():
    return "Works"


@app.route("/health")
def health():
    return "Works"


if __name__ == "__main__":
    app.run()
