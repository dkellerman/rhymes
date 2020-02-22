import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { NavBar } from '../NavBar';

type Stats = {
  songs: any[],
  rhymes: any[],
  rfreq: any[],
};

const Li = styled.li.attrs({
  className: 'padding-small',
})``;

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
      fetchLines('/data/songs.txt'),
      fetchLines('/data/rhymes.txt'),
      fetchLines('/data/rhyme_freq.txt'),
    ]).then(([songs, rhymes, rfreq]) => {
      setData({
        songs: songs.map(l => l.split(' - ')),
        rhymes: rhymes.map(l => l.split(';')),
        rfreq: rfreq.map(l => l.split(' => ')),
      });
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Rhymes Stats</title>
      </Head>

      <NavBar>
        <div className="padding text-center">
          <strong>Stats</strong><br />
          <Link href="/"><a>(Back to search)</a></Link>
        </div>
      </NavBar>

      <main className="padding-large">
        {loading && '...' || (
          <ul>
            <Li>
              <Link href="/data/rhyme_freq.txt"><a>Most common rhymes</a></Link>{' '}
              <small className="text-muted">({ data.rfreq.length })</small>
              <SubList>
                <small className="text-muted">{
                  data.rfreq.slice(0, 20).map(([r, f]) => (
                    `${r} (${f})`
                  )).join(' • ')} …
                </small>
              </SubList>
            </Li>
            <Li>
              <Link href="/data/songs.txt"><a>All songs</a></Link>{' '}
              <small className="text-muted">({ data.songs.length })</small>
              <SubList>
                <small className="text-muted">{
                  data.songs.sort((a, b) => Math.random() > .5 ? -1 : 1)
                    .slice(0, 10).map(([title,]) => (
                    `${title}`
                  )).join(' • ')} …
                </small>
              </SubList>
            </Li>
            <Li>
              <Link href="/data/rhymes.txt"><a>All rhyme sets</a></Link>{' '}
              <small className="text-muted">({ data.rhymes.length })</small>
            </Li>
            <Li>
              <Link href="/data/synonyms.txt"><a>Synonyms</a></Link>
            </Li>
          </ul>
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
