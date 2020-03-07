from flask import Flask, Response, request
app = Flask(__name__)

@app.route('/api/similarity')
def similarity():
    q = request.args.get('q')
    return Response(q or 'nada', mimetype="text/html")
