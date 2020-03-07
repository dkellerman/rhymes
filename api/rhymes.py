import os
import json
from flask import Flask, Response, request
from elasticsearch import Elasticsearch

app = Flask(__name__)
es = Elasticsearch([ os.environ['ELASTIC_ENDPOINT'] ], verify_certs=False)
index = os.environ['ELASTIC_INDEX']

@app.route('/api/rhymes')
def rhymes():
    q = request.args.get('q', '').strip().lower()

    results = es.search(index=index, body={
        'size': 50,
        'query': {
            'bool': {
                'should': [
                    { 'term': { 'doc.word1': q } },
                    { 'term': { 'doc.word2': q } }
                ]
            }
        },
        'sort': [
            { 'doc.freq': 'desc' },
            '_score',
        ],
        '_source': [ 'doc.id', 'doc.word1', 'doc.word2', 'doc.freq' ],
    })

    return Response(json.dumps({
        'q': q,
        'results': results,
    }), mimetype="application/json")
