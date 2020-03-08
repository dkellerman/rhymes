import React from 'react';
import Head from 'next/head';
import { NavBar } from '../NavBar';

type Result = any;

const SimilarityPage = ({ initialQuery = '' }) => {
  const textArea = React.useRef<any>(null);
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<Result[]|null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    setLoading(true);
    fetchSimilarity(query).then(results => {
      setResults(results);
      setLoading(false);
    });
  }, [query]);

  React.useEffect(() => {
    // searchInput?.current?.focus();
  }, [results]);

  return (
    <>
      <Head>
        <title>Similarity | Songisms</title>
      </Head>

      <NavBar />

      <main className="padding-top">
        <strong>Similarity Analysis</strong>

        <form
          onSubmit={e => {
            e.preventDefault();
            setQuery(textArea && textArea?.current?.value || '')
          }}
          style={{width:'80vw', display:'flex', flexDirection:'column'}}>
          <textarea ref={textArea} rows={5} defaultValue={query}
            style={{width:'100%'}}>
          </textarea>

          <button type="submit" style={{alignSelf:'flex-end'}}>
            Submit
          </button>
        </form>

        {loading && '...' || (results?.length && (
          <>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Line</th>
                  <th>Song</th>
                </tr>
              </thead>
              <tbody>
                {results.map(([score, line, song]) => (
                  <tr>
                    <td>{score}</td>
                    <td>{line}</td>
                    <td>{song}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) || (
          <>
            <hr />
            {query && <strong>No results</strong>}
          </>
        ))}
      </main>
    </>
  );
};

SimilarityPage.getInitialProps = ({ req, query }) => {
  return {
    initialQuery: query.q || '',
  };
};

async function fetchSimilarity(q): Promise<Result[]> {
  const resp = await fetch(`/api/similarity?q=${encodeURIComponent(q)}`);
  const { results } = await resp.json();
  return results;
}

export default SimilarityPage;
