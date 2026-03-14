import json
from flask import Flask, jsonify

app = Flask(__name__)

DATA_FILE = "data.json"


@app.route("/")
def get_scraped_data():
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Scraped data file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health_check():
    return jsonify({"status": "OK"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)