


# // const makePairs = (arr) =>
# //   arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

# //   const rhymes = fs.readFileSync('./public/data/rhymes.txt', 'utf8').split('\n');

# //   for (const line of rhymes) {
# //     const words = line.trim().split(';').map(w => w.trim());
# //     for (const word of words) {
# //       let syn;
# //       // *ing -> *in'
# //       if (word.endsWith("in'")) {
# //         syn = [word, word.replace(/\'$/, "g")];
# //       } else if (word.endsWith("ing") && word.length > 5) {
# //         syn = [word.replace(/g$/, "'"), word];
# //       }

# //       if (!syns.find(s => s && syn && s.join('') === syn.join(''))) {
# //         syns.push(syn);
# //       }

# //       // a-going -> going
# //       // mercedes-benz -> mercedes benz
# //       if (word.indexOf('-') > -1) {
# //         if (word.startsWith('a-')) {
# //           syn = [word, word.substring(2)];
# //         } else {
# //           syn = [word, word.replace('-', ' ')];
# //         }

# //         if (!syns.find(s => s && syn && s.join('') === syn.join(''))) {
# //           syns.push(syn);
# //         }
# //       }
# //     }
# //   }

# //   const freqs = {};

# //   for (const line of rhymes) {
# //     const words = line.split(';').map(t => t.trim().toLowerCase());
# //     for (const pair of makePairs(words)) {
# //       const wid = pair.sort().join(';');
# //       freqs[wid] = (freqs[wid] || 0) + 1;
# //     }
# //   }

# //   // write rhyme frequencies
# //   const rf = Object.entries(freqs).filter(x => x[1] > 1).sort((a, b) => b[1]-a[1]);
# //   fs.writeFileSync('./public/data/rhyme_freq.txt',
# //     rf.map(x => x.join(' => ').replace(';', '/')).join('\n'));
