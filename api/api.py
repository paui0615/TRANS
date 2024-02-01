from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin
import time
from flask_socketio import SocketIO, emit
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r'*':{'origins':'*'}})
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
@cross_origin(origins=['*'])
def index():
    return "testfsafgg"
@socketio.on('random_data',namespace='/')

def get_data():
    while True:
        with open('./Rose_line.json', 'r') as f1, open('./Body_Rose_line.json', 'r') as f2:
            data1 = json.load(f1)
            data2 = json.load(f2)
            #print(data1)
        socketio.emit('json',  {'data1': data1, 'data2': data2}, broadcast=True)
        time.sleep(5)


if __name__ == '__main__':
    app.run(port=5000,debug=True)