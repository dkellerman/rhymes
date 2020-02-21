import { Client as ESClient } from '@elastic/elasticsearch';
import { NextApiRequest, NextApiResponse } from 'next';

type Query = {
  q?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const elastic = new ESClient({ node: process.env.ELASTIC_ENDPOINT });
  const { q: qstr = '' } = req.query as Query;
  const q = qstr.trim().toLowerCase();

  const results = await elastic.search({
    index: process.env.ELASTIC_INDEX,
    type: 'entry',
    body: {
      size: 50,
      query: {
        bool: {
          should: [
            { term: { 'doc.word1': q } },
            { term: { 'doc.word2': q } },
          ]
        },
      },
      sort: [
        { 'doc.freq': 'desc' },
        '_score',
      ],
      _source: [ 'doc.word1', 'doc.word2', 'doc.freq' ],
    },
  });

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ results: results.body }));
};
