const fs = require('fs');
const env = require('./next.config').env;
const { Client: ESClient } = require('@elastic/elasticsearch')
const elastic = new ESClient({ node: env.ELASTIC_ENDPOINT });

const makePairs = (arr) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

async function reindex() {
  const lines = fs.readFileSync('./rhymes.txt', 'utf8').split('\n');
  const freqs = {};

  for (const line of lines) {
    const words = line.split(';').map(t => t.trim().toLowerCase());
    for (const pair of makePairs(words)) {
      const wid = pair.sort().join(';');
      freqs[wid] = (freqs[wid] || 0) + 1;
    }
  }

  const actions = [];
  for (const [id, freq] of Object.entries(freqs)) {
    const [word1, word2] = id.split(';');
    const doc = {
      id,
      word1,
      word2,
      freq,
    };

    actions.push({
      index: {
        _index: env.ELASTIC_INDEX,
        _type: 'entry',
        _id: doc.id,
      },
      doc,
    });
  }

  await createIndex(env.ELASTIC_INDEX, actions);
}

async function createIndex(index, actions) {
  console.log('Indexing', actions.length, 'rhymes =>', index, '...');
  await elastic.indices.delete({ index }).catch(e => {});
  await elastic.indices.create({ index });

  // this doesn't index all docs for some reason:
  // await elastic.bulk({ body: actions });

  for (const act of actions) {
    await elastic.index({
      id: act.index._id,
      type: 'entry',
      index: act.index._index,
      body: act,
    });
  }
}

reindex();
