# Rhymes

An attempt to make a rhyme dictionary based on actual rhymes as they appear in songs.

https://rhymes.now.sh

## Development Setup
* Install: `yarn`
* Run elasticsearch instance, OR: `cp .env .env.local`, then configure .env.local to point to existing Elastic instance
* Reindexing: `yarn reindex`
* Run UI: `yarn dev`, browse to localhost:3000

To run `yarn fetch` you'll need to add firebase.json to scripts/ directory

After fetching then you can run `yarn process` to make aggregated stats in the data directory

## Python setup
* `python3 -m virtualenv env`
* `source env/bin/activate`
* `pip install -r requirements.txt`

