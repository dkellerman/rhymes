# Rhymes

An attempt to make a rhyme dictionary based on actual rhymes as they appear in songs.

https://rhymes.now.sh

## Development Setup
* Install: `yarn`
* Run elasticsearch instance, OR: `cp .env .env.local`, then configure .env.local to point to existing Elastic instance
* Reindexing: `yarn reindex`
* Run UI: `yarn dev`, browse to localhost:3000
