from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import time

app = Flask(__name__, static_url_path='', static_folder='frontend')
CORS(app)

n_disks = 6
moves = []  


def solveHanoi(n, origin, destination, aux):

    # Função recursiva para resolver o problema das Torre de Hanoi.

    # Argumentos:
    #  - n: O número de discos a serem movidos.
    #  - origin: O pino de origem dos discos.
    #  - destination: O pino de destino dos discos.
    #  - aux: O pino auxiliar.

    # Nenhum valor é retornado explicitamente, mas os movimentos são armazenados na lista 'moves'.

    if n == 1:
        moves.append((origin, destination))
    else:
        solveHanoi(n - 1, origin, aux, destination)
        moves.append((origin, destination))
        solveHanoi(n - 1, aux, destination, origin)


@app.route('/hanoi', methods=['POST'])
def moveHanoi():
    
    # Rota que fornece os movimentos para resolver o problema da Torre de Hanoi.

    # Retorna um objeto JSON contendo o próximo movimento a ser realizado.
    # Se não houver mais movimentos, retorna None.
    
    if moves:
        return jsonify({'move': moves.pop(0)})  # Envia o primeiro movimento
    else:
        return jsonify({'move': None})  # Nao ha mais movimentos


@app.route('/')
def index():

    # Rota principal que executa o algoritmo da Torre de Hanoi e retorna a página inicial.
    
    global moves
    moves = [] # Limpa os movimentos anteriores
    solveHanoi(n_disks, 1, 3, 2)
    # print(moves)
    return send_from_directory('frontend', 'index.html')


if __name__ == '__main__':
    solveHanoi(n_disks, 1, 3, 2)
    print(moves)
    app.run()

