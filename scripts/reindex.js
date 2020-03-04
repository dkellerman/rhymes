const fs = require('fs');
const env = require('../next.config').env;
const { Client: ESClient } = require('@elastic/elasticsearch')
const elastic = new ESClient({ node: env.ELASTIC_ENDPOINT });
const indexConfig = require('./index_config.json');


async function reindex() {
  const syns = fs.readFileSync('./data/synonyms.txt', 'utf8').split('\n')
    .map(s => s.split(';'));
  const rhymeFreqs = fs.readFileSync('./data/rhyme_freq.txt', 'utf8').split('\n');

  const actions = [];
  for (const line of rhymeFreqs) {
    const [pair, freq] = line.split(' => ');
    const words = pair.split('/');
    const wid = words.sort().join(';');
    const doc = {
      id: wid,
      word1: words[0],
      word2: words[1],
      freq: parseInt(freq, 10),
    };
    console.log(doc);

    actions.push({
      index: {
        _index: env.ELASTIC_INDEX,
        _type: 'entry',
        _id: doc.id,
      },
      doc,
    });
  }

  await createIndex(env.ELASTIC_INDEX, actions, syns);
}

async function createIndex(index, actions, syns=[]) {
  indexConfig.settings.index.analysis.filter.synonym_filter.synonyms =
    syns.filter(Boolean).map(synset => synset.join(','));
  console.log('Indexing', actions.length, 'rhymes =>', index, '...');
  await elastic.indices.delete({ index }).catch(e => {});
  await elastic.indices.create({ index, body: indexConfig });

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
