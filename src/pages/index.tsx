import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import uniqBy from 'lodash/uniqBy';
import { DebounceInput } from 'react-debounce-input';
import { useRouter, Router } from 'next/router';

type SearchResults = {
  total: number;
  hits: Array<{
    id: string,
    word: string,
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

      <header>
        <DebounceInput
          type="search"
          inputRef={searchInput}
          debounceTimeout={300}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for rhymes used in actual songs..."
          size={80}
        />
      </header>

      <main>
        {loading && '...' || (hasResults && (
          <>
            <div className="info">
              { results.total } rhymes for
              {' '}<strong>"{query}"</strong>.
            </div>

            <ul>
              {results.hits.map(hit => (
                <li key={hit.id}>
                  {hit.word}
                </li>
              ))}
            </ul>
          </>
        ) || (
          <div className="no-results">{query && 'No rhymes found.'}</div>
        ))}
      </main>
    </>
  );
};

async function fetchRhymes(q): Promise<SearchResults> {
  const resp = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`);
  const { results } = await resp.json();

  const uniqueHits = uniqBy(results.hits.hits.map(hit => {
    const h = hit._source.doc;
    h.word = h.word1 === q ? h.word2 : h.word1;
    return h;
  }), 'word');

  results.hits.hits = uniqueHits;
  return results.hits;
}

export default RhymesSearchPage;
