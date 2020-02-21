const fs = require('fs');
const env = require('./next.config').env;
const { Client: ESClient } = require('@elastic/elasticsearch')
const elastic = new ESClient({ node: env.ELASTIC_ENDPOINT });
const indexConfig = require('./index_config.json');

const makePairs = (arr) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

async function reindex() {
  const syns = fs.readFileSync('./public/data/synonyms.txt', 'utf8').split('\n')
    .filter(line => !line.trim().startsWith('#'))
    .map(line => line.split(';').map(tok => tok.trim()).filter(Boolean))
    .filter(synset => synset && synset.length);

  const rhymes = fs.readFileSync('./public/data/rhymes.txt', 'utf8').split('\n');

  for (const line of rhymes) {
    const words = line.trim().split(';').map(w => w.trim());
    for (const word of words) {
      let syn;
      // *ing -> *in'
      if (word.endsWith("in'")) {
        syn = [word, word.replace(/\'$/, "g")];
      } else if (word.endsWith("ing") && word.length > 5) {
        syn = [word.replace(/g$/, "'"), word];
      }
      if (!syns.includes(syn)) syns.push(syn);

      // a-going -> going
      // mercedes-benz -> mercedes benz
      if (word.indexOf('-') > -1) {
        if (word.startsWith('a-')) {
          syn = [word, word.substring(2)];
        } else {
          syn = [word, word.replace('-', ' ')];
        }
        if (!syns.includes(syn)) syns.push(syn);
      }
    }
  }

  const freqs = {};

  for (const line of rhymes) {
    const words = line.split(';').map(t => t.trim().toLowerCase());
    for (const pair of makePairs(words)) {
      const wid = pair.sort().join(';');
      freqs[wid] = (freqs[wid] || 0) + 1;
    }
  }

  // write rhyme frequencies
  const rf = Object.entries(freqs).filter(x => x[1] > 1).sort((a, b) => b[1]-a[1]);
  fs.writeFileSync('./public/data/rhyme_freq.txt',
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
  indexConfig.settings.index.analysis.filter.synonym_filter.synonyms =
    syns.map(synset => synset.join(',')).filter(Boolean);
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
