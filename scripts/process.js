const fs = require('fs');

const makePairs = (arr) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

const rhymes = fs.readFileSync('./data/rhymes.txt', 'utf8').split('\n');
const syns = fs.readFileSync('./data/synonyms_manual.txt', 'utf8').split('\n')
  .filter(line => !line.trim().startsWith('#'))
  .map(line => line.split(';').map(tok => tok.trim()).filter(Boolean))
  .filter(synset => synset && synset.length)
  .filter(Boolean);
const rfreqs = {};

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

    if (!syns.find(s => s && syn && s.join('') === syn.join(''))) {
      syns.push(syn);
    }

    // a-going -> going
    // mercedes-benz -> mercedes benz
    if (word.indexOf('-') > -1) {
      if (word.startsWith('a-')) {
        syn = [word, word.substring(2)];
      } else {
        syn = [word, word.replace('-', ' ')];
      }

      if (!syns.find(s => s && syn && s.join('') === syn.join(''))) {
        syns.push(syn);
      }
    }
  }
}

for (const line of rhymes) {
  const words = line.split(';').map(t => t.trim().toLowerCase());
  for (const pair of makePairs(words)) {
    const wid = pair.sort().join(';');
    rfreqs[wid] = (rfreqs[wid] || 0) + 1;
  }
}

// write rhyme frequencies
const rf = Object.entries(rfreqs).sort((a, b) => b[1] - a[1]);
fs.writeFileSync('./data/rhyme_freq.txt',
  rf.map(x => x.join(' => ').replace(';', '/')).join('\n'));

// write merged synonyms
fs.writeFileSync('./data/synonyms.txt',
  syns.filter(Boolean).map(s => s.join(';')).join('\n'));
