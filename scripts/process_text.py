import os, glob, pickle
import spacy
from tqdm import tqdm

lines_file = './data/lines.pkl'

def read_data():
    with open(lines_file, 'rb') as f:
        return pickle.load(f)


def write_data():
    nlp = spacy.load('en_core_web_sm')

    songs = [
        (f, open(f).read())
        for f in glob.glob('./data/lyrics/*.txt')
        if os.path.basename(f) != 'index.txt'
    ]

    lines = []

    for filename, song in tqdm(songs):
        title, artist = filename.replace('.txt', '').split('__')
        title = title.replace('_', ' ')
        artist = artist.replace('_', ' ')

        for line in song.split('\n'):
            lines.append({
                'id': "%s::%s" % (filename, line),
                'title': title,
                'artist': artist,
                'text': line,
                'lemmas': [ tok.lemma_ for tok in nlp(line) ],
            })

    with open(lines_file, 'wb') as f:
        pickle.dump(lines, f)

    print(len(lines), "lines")
    print(len(songs), "songs")


if __name__ == '__main__':
    if os.path.exists(lines_file):
        lines = read_data()
        print(lines)
    else:
        print("Writing lines data...")
        lines = write_data()
