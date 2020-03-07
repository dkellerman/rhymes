import os
import glob
import json
from flask import Flask, Response, request

app = Flask(__name__)

lyrics = open('./data/lyrics/index.txt').read()
lines = lyrics.split('\n')
songs = [
    open(f).read()
    for f in glob.glob('./data/lyrics/*.txt')
    if os.path.basename(f) != 'index.txt'
]

@app.route('/api/similarity')
def similarity():
    q = request.args.get('q')
    resp = json.dumps({
        'q': q,
        'results': [
            { 'title': 'Hello world' },
        ]
    })
    return Response(resp, mimetype="application/json")
