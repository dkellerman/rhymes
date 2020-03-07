from flask import Flask, Response, request
app = Flask(__name__)

@app.route('/api/data')
def data():
    f = request.args.get('f')
    data = ''

    if f in [
        'songs',
        'rhymes',
        'rhyme_freq',
        'word_freq',
        'synonyms',
    ]:
        data = open('./data/%s.txt' % f, 'r').read()

    return Response(data, mimetype="text/plain")
