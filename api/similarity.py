import os, json, pickle
from flask import Flask, Response, request
import spacy

app = Flask(__name__)
nlp = spacy.load('en_core_web_sm')

with open('./data/lines.pkl', 'rb') as f:
    lines = pickle.load(f)

def jac_sim(q, doc):
    a = set(q)
    b = set(doc)
    c = a.intersection(b)
    return float(len(c)) / (len(a) + len(b) - len(c))

@app.route('/api/similarity')
def similarity():
    q = request.args.get('q', '').strip().lower()
    if q:
        qlemmas = [ t.lemma_ for t in nlp(q) ]
        results = []
        ids = []
        for line in lines:
            score = jac_sim(qlemmas, line['lemmas'])
            if score > .5 and (line['id'] not in ids):
                ids.append(line['id'])
                results.append([
                    round(score, 2),
                    line['text'],
                    line['title'].split('/')[-1],
                ])
        results = list(reversed(sorted(results, key=lambda r: r[0])))[:20]
    else:
        results = []

    resp = json.dumps({
        'q': q,
        'results': results,
    })

    return Response(resp, mimetype="application/json")
