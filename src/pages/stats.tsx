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
      fetchLines('/data/word_freq.txt'),
    ]).then(([songs, rhymes, rfreq, wfreq]) => {
      setData({
        songs: songs.map(l => l.split(' - ')),
        rhymes: rhymes.map(l => l.split(';')),
        rfreq: rfreq.map(l => l.split(' => ')),
        wfreq: wfreq.map(l => l.split(' => ')),
      });
      setLoading(false);
    });
  }, []);

  const totalRhymes: number = data.rhymes?.reduce((acc, val) =>
    (acc || 0) + (val.length - 1), 0) || 0;

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
              <small className="text-muted">
                ({ data.rfreq.length } occurring more than once
                out of ~{ totalRhymes } pairs)
              </small>
              <SubList>
                <small className="text-muted">{
                  data.rfreq.slice(0, 20).map(([r, f]) => (
                    `${r} (${f})`
                  )).join(' • ')} …
                </small>
              </SubList>
            </Li>
            <Li>
              <Link href="/data/word_freq.txt"><a>Most common words</a></Link>{' '}
              <small className="text-muted">
                (~{ data.wfreq.length } unique non-stop words, occurring more than twice, no. of songs appearing in)
              </small>
              <SubList>
                <small className="text-muted">{
                  data.wfreq.slice(0, 30).map(([r, f]) => (
                    `${r} (${f})`
                  )).join(' • ')} …
                </small>
              </SubList>
            </Li>
            <Li>
              <Link href="/data/songs.txt"><a>All songs</a></Link>{' '}
              <small className="text-muted">({ data.songs.length } total)</small>
              <SubList>
                <small className="text-muted">{
                  data.songs.sort((a, b) => Math.random() > .5 ? -1 : 1)
                    .slice(0, 20).map(([title,]) => (
                    `${title}`
                  )).join(' • ')} …
                </small>
              </SubList>
            </Li>
            <Li>
              <Link href="/data/rhymes.txt"><a>All rhyme sets</a></Link>{' '}
              <small className="text-muted">({ data.rhymes.length } total)</small>
            </Li>
            <Li>
              <Link href="/data/synonyms.txt"><a>Synonyms</a></Link>
            </Li>
            <Li>
              <Link href="/data/stop_words.json"><a>Stop words</a></Link>
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
