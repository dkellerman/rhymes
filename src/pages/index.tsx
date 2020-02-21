import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import uniqBy from 'lodash/uniqBy';
import { DebounceInput } from 'react-debounce-input';
import { useRouter, Router } from 'next/router';
import { NavBar } from '../NavBar';

type SearchResults = {
  total: number;
  hits: Array<{
    id: string;
    word: string;
    freq: number;
  }>;
};

const RhymesSearchPage = () => {
  const router = useRouter();
  const searchInput = React.useRef<HTMLInputElement|null>(null);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResults|null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    setLoading(true);
    fetchRhymes(query).then(results => {
      setResults(results);
      setLoading(false);
    });
  }, [query]);

  React.useEffect(() => {
    searchInput?.current?.focus();
  }, [results]);

  const hasResults = Boolean(results?.hits?.length);

  return (
    <>
      <Head>
        <title>Rhymes Search</title>
      </Head>

      <NavBar>
        <DebounceInput
          type="search"
          inputRef={searchInput}
          debounceTimeout={300}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for rhymes used in actual songs..."
        />
      </NavBar>

      <main className="padding-top">
        {loading && '...' || (hasResults && (
          <>
            <div className="info">
              { results.total } rhyme
              { results.total > 1 ? 's' : '' }
              {' '}for{' '}<strong>“{query}”</strong>.
            </div>

            <ul className="results padding-left">
              {results.hits.map(hit => (
                <li className="margin-bottom-small" key={hit.id}>
                  <span className={
                    hit.freq <= 1 && 'text-muted' ||
                    hit.freq >= 5 && 'background-success' ||
                    'text-primary'
                  } style={{padding: 3}}>{hit.word}</span>
                  <small className="text-muted">
                    &nbsp;&nbsp;({hit.freq})
                  </small>
                </li>
              ))}
            </ul>
          </>
        ) || (
          <div className="no-results">{query &&
            `No rhymes found for “${query}”.`
          }</div>
        ))}
      </main>
    </>
  );
};

async function fetchRhymes(q): Promise<SearchResults> {
  const resp = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`);
  const { results } = await resp.json();

  const uniqueHits = uniqBy(results.hits.hits.map(hit => {
    const qq = q.trim().toLowerCase();
    const doc = hit._source.doc;
    const word = doc.word1 === qq ? doc.word2 :
                 doc.word2 === qq ? doc.word1 :
                 null;
    if (!word) {
      return null;
    }

    doc.word = word;
    return doc;
  }).filter(Boolean), 'word');

  results.hits.hits = uniqueHits;
  return results.hits;
}

export default RhymesSearchPage;
