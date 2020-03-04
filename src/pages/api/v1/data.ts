import { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';

type Query = {
  f: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { f = '' } = req.query as Query;
  let result = '';

  if ([
    'songs', 'rhymes', 'rhyme_freq', 'word_freq', 'synonyms',
    'stop_words'
  ].includes(f)) {
    result = readFileSync(`./data/${f}.txt`, 'utf8');
  }

  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  res.end(result);
};
