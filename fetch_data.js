const fs = require('fs');
const { parse } = require('node-html-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://songisms.firebaseio.com',
});

const firestore = admin.firestore();

fetch_data();

async function fetch_data() {
  const songs = [];
  const rhymes = [];
  const idioms = [];

  fs.mkdirSync('./data', { recursive: true });
  fs.mkdirSync('./data/lyrics', { recursive: true });

  const idiomsSnapshot = await firestore.collection('/idioms').get();
  idiomsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.value) {
      idioms.push(data.value.trim());
    }
  });

  const lyricsSnapshot = await firestore.collection('/lyrics').get();
  lyricsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const song = `${data.title.trim()};${data.artist.trim()}`.toLowerCase();
    const tags = data.tags || [];

    if (!data.title ||
        songs.includes(song) ||
        tags.includes('draft') ||
        tags.includes('ideas') ||
        tags.includes('muse') ||
        data.author === 'David Kellerman'
    ) {
      return;
    }

    const lyricPath = `./data/lyrics/${
      song
        .replace(/[\"\']/g, '')
        .replace(/[\/\s]/g, '_')
        .replace(';', '__')
    }.txt`;

    const text = parse(data.content).structuredText.trim();

    songs.push(song);

    if (data.rhymes) {
      rhymes.push(...(data.rhymes.map(line =>
        line
          .split(';')
          .map(w => w.toLowerCase().trim())
          .filter(Boolean)
          .join(';')
      )));
    }

    fs.writeFileSync(lyricPath, text);
  });

  console.log(`${songs.length} songs...`);
  fs.writeFileSync('./data/songs.txt', songs.join('\n'));
  console.log(`${rhymes.length} rhyme sets...`);
  fs.writeFileSync('./data/rhymes.txt', rhymes.join('\n'));
  console.log(`${idioms.length} idioms...`);
  fs.writeFileSync('./data/idioms.txt', idioms.join('\n'));
}
