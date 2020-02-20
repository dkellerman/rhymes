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
        <nav className="border split-nav fixed">
          <div className="nav-brand">
            <h3><a href="/">Rhymes</a></h3>
          </div>
          <div>
            <DebounceInput
              type="search"
              inputRef={searchInput}
              debounceTimeout={300}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for rhymes used in actual songs..."
            />
          </div>
          <div className="collapsible">
            <input id="collapsible1" type="checkbox" name="collapsible1" />
            <button>
              <label htmlFor="collapsible1">
                <div className="bar1"></div>
                <div className="bar2"></div>
              </label>
            </button>
            <div className="collapsible-body">
              <ul className="inline">
                <li><a href="https://github.com/dkellerman/rhymes" target="_blank">Github</a> &#183;</li>
                <li><a href="https://raw.githubusercontent.com/dkellerman/rhymes/master/data/songs.txt" target="_blank">Songs used</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

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
                  {hit.word}
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
    const doc = hit._source.doc;
    doc.word = doc.word1 === q ? doc.word2 : doc.word1;
    return doc;
  }), 'word');

  results.hits.hits = uniqueHits;
  return results.hits;
}

export default RhymesSearchPage;
