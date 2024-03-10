from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import time

app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

n_disks = 6
moves = []  


def move_disk(n, origin, destination, auxiliary):
    if n == 1:
        moves.append((origin, destination))
    else:
        move_disk(n - 1, origin, auxiliary, destination)
        moves.append((origin, destination))
        move_disk(n - 1, auxiliary, destination, origin)


@app.route('/hanoi', methods=['POST'])
def solve_hanoi():
    if moves:
        return jsonify({'move': moves.pop(0)})  # Send the first move
    else:
        return jsonify({'move': None})  # No more moves


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


if __name__ == '__main__':
    move_disk(n_disks, 1, 3, 2)
    print(moves)
    app.run()

