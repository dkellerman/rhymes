const fs = require('fs');
const { Client: ESClient } = require('@elastic/elasticsearch')
const env = require('./env.json');

const elastic = new ESClient({ node: env.ELASTIC_ENDPOINT });

const makePairs = (arr) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

async function reindex() {
  const lines = fs.readFileSync('./rhymes.txt', 'utf8').split('\n');
  const rhymes = {};

  for (const line of lines) {
    const words = line.split(';').map(t => t.trim().toLowerCase());
    for (const pair of makePairs(words)) {
      const wid = pair.sort().join(';');
      rhymes[wid] = (rhymes[wid] || 0) + 1;
    }
  }

  const rhymeActions = [];
  for (const [id, freq] of Object.entries(rhymes)) {
    const [word1, word2] = id.split(';');
    const doc = {
      id,
      word1,
      word2,
      freq,
    };
    rhymeActions.push({
      index: {
        _index: env.ELASTIC_INDEX,
        _type: 'entry',
        _id: doc.id,
      },
      doc,
    });
  }

  await createIndex(env.ELASTIC_INDEX, rhymeActions);
}

async function createIndex(index, actions) {
  console.log('Indexing', actions.length, 'items to index', index, '...');
  await elastic.indices.delete({ index }).catch(e => {});
  await elastic.indices.create({ index });
  await elastic.bulk({ body: actions });
}

reindex();
