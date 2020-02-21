import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { NavBar } from '../NavBar';

const StatsPage = () => {
  const [loading, setLoading] = React.useState(false);

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
            <li className="padding-small"><Link href="/data/rhyme_freq.txt"><a>Most common rhymes</a></Link></li>
            <li className="padding-small"><Link href="/data/songs.txt"><a>All songs</a></Link></li>
            <li className="padding-small"><Link href="/data/rhymes.txt"><a>All rhymes</a></Link></li>
            <li className="padding-small"><Link href="/data/synonyms.txt"><a>Synonyms</a></Link></li>
          </ul>
        )}
      </main>
    </>
  );
};

export default StatsPage;
