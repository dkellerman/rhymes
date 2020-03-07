import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { NavBar } from '../NavBar';

type Stats = {
  songs: any[];
  rhymes: any[];
  rfreq: any[];
  wfreq: any[];
};

const List = styled.ul`
  padding: 0 0 0 15px;
  li {
    padding: 10px 0;
  }
`;

const SubList = styled.div.attrs({})`
  width: 50vw;
  text-indent: 0;
  margin-top: 3px;
`;

const StatsPage = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Stats>({} as Stats);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchLines('/api/data?f=songs'),
      fetchLines('/api/data?f=rhymes'),
      fetchLines('/api/data?f=rhyme_freq'),
      fetchLines('/api/data?f=word_freq'),
    ]).then(([songs, rhymes, rfreq, wfreq]) => {
      setData({
        songs: songs.map(l => l.split(';')),
        rhymes: rhymes.map(l => l.split(';')),
        rfreq: rfreq.map(l => l.split(' => ')),
        wfreq: wfreq.map(l => l.split(' => ')),
      });
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Song Stats | Songisms</title>
      </Head>

      <NavBar />

      <main className="padding">
        <div>
          <strong>Song Stats</strong>{' '}
        </div>

        {loading && '...' || (
          <List>
            <li>
              <Link href="/api/data?f=word_freq"><a>Most common words</a></Link>{' '}
              <small className="text-muted">
                (~{ data.wfreq.length } unique words)
              </small>
              <SubList>
                <small className="text-muted">{
                  data.wfreq.slice(0, 30).map(([r, f]) => (
                    `${r} (${f})`
                  )).join(' • ')} …
                </small>
              </SubList>
            </li>

            <li>
              <Link href="/api/data?f=rhyme_freq"><a>Most common rhymes</a></Link>{' '}
              <small className="text-muted">
                ({ data.rfreq.length })
              </small>
              <SubList>
                <small className="text-muted">{
                  data.rfreq.slice(0, 20).map(([r, f]) => (
                    `${r} (${f})`
                  )).join(' • ')} …
                </small>
              </SubList>
            </li>

            <li>
              <Link href="/api/data?f=songs"><a>All songs</a></Link>{' '}
              <small className="text-muted">({ data.songs.length } total)</small>
              <SubList>
                <small className="text-muted">{
                  data.songs.sort((a, b) => Math.random() > .5 ? -1 : 1)
                    .slice(0, 20).map(([title,]) => (
                    `${title}`
                  )).join(' • ')} …
                </small>
              </SubList>
            </li>

            <li>
              <Link href="/api/data?f=rhymes"><a>All rhyme sets</a></Link>{' '}
              <small className="text-muted">({ data.rhymes.length } total)</small>
            </li>

            <li>
              <Link href="/api/data?f=synonyms"><a>Synonyms</a></Link>
            </li>
          </List>
        )}
      </main>
    </>
  );
};

async function fetchLines(f) {
  return fetch(f)
    .then(resp => resp.text())
    .then(txt => txt.split('\n'));
}

export default StatsPage;
