const fs = require('fs');
const env = require('./next.config').env;
const { Client: ESClient } = require('@elastic/elasticsearch')
const elastic = new ESClient({ node: env.ELASTIC_ENDPOINT });
const indexConfig = require('./index_config.json');

const makePairs = (arr) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

async function reindex() {
  const syns = fs.readFileSync('./data/synonyms.txt', 'utf8').split('\n');
  const lines = fs.readFileSync('./data/rhymes.txt', 'utf8').split('\n');

  // make synonyms for ing->in' endings
  for (const line of lines) {
    const words = line.trim().split(';').map(w => w.trim());
    for (const w of words) {
      let s;
      if (w.endsWith("in'")) {
        s = `${w};${w.replace(/\'$/, "g")}`;
      } else if (w.endsWith("ing") && w.length > 5) {
        s = `${w.replace(/g$/, "'")};${w}`;
      }
      if (!syns.includes(s)) syns.push(s);
    }
  }

  const freqs = {};

  for (const line of lines) {
    const words = line.split(';').map(t => t.trim().toLowerCase());
    for (const pair of makePairs(words)) {
      const wid = pair.sort().join(';');
      freqs[wid] = (freqs[wid] || 0) + 1;
    }
  }

  // write rhyme frequencies
  const rf = Object.entries(freqs).filter(x => x[1] > 1).sort((a, b) => b[1]-a[1]);
  fs.writeFileSync('./data/rhyme_freq.txt',
    rf.map(x => x.join(' => ').replace(';', '/')).join('\n'));

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

  await createIndex(env.ELASTIC_INDEX, actions, syns.filter(Boolean));
}

async function createIndex(index, actions, syns=[]) {
  const config = indexConfig[index];
  config.settings.index.analysis.filter.synonym_filter.synonyms = syns;
  console.log('Indexing', actions.length, 'rhymes =>', index, '...');
  await elastic.indices.delete({ index }).catch(e => {});
  await elastic.indices.create({ index, body: config });

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
