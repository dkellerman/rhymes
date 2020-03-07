import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import uniqBy from 'lodash/uniqBy';
import { NavBar } from '../NavBar';
import { SearchInput, SearchResults, SearchBar, SearchInfo } from '../index.styles';

type SearchResults = {
  total: number;
  hits: Array<{
    id: string;
    word: string;
    freq: number;
  }>;
};

const RhymesSearchPage = ({ initialQuery = '' }) => {
  const searchInput = React.useRef<HTMLInputElement|null>();
  const [query, setQuery] = React.useState(initialQuery);
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
        <title>Rhymes Search | Songisms</title>
      </Head>

      <NavBar />

      <main className="padding-top">
        <strong>Rhymes Search</strong>

        <SearchBar>
          <SearchInput
            type="search"
            inputRef={searchInput}
            debounceTimeout={300}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for rhymes actually used in songs..."
          />
        </SearchBar>

        {loading && '...' || (hasResults && (
          <>
            <SearchInfo>
              { results.total } rhyme
              { results.total > 1 ? 's' : '' }
              {' '}used{' '}for{' '}<strong>“{query}”</strong>.
            </SearchInfo>

            <SearchResults>
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
            </SearchResults>
          </>
        ) || (
          <div className="no-results">{query &&
            <>
              “{query}” was not rhymed{' '}
              <strong>even once</strong>{' '}
              in our database of ~280 songs!{' '}
              <Link href="/stats"><a>See the stats and songs here.</a></Link>
            </>
          }</div>
        ))}
      </main>
    </>
  );
};

RhymesSearchPage.getInitialProps = ({ req, query }) => {
  return {
    initialQuery: query.q || '',
  };
};

async function fetchRhymes(q): Promise<SearchResults> {
  const resp = await fetch(`/api/rhymes?q=${encodeURIComponent(q)}`);
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
