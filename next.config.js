const isDev = process.env.NODE_ENV === 'development';

const config = {
  target: 'serverless',
};

if (isDev) {
  require('dotenv-flow').config();
  config.env = {
    ELASTIC_ENDPOINT: process.env.ELASTIC_ENDPOINT,
    ELASTIC_INDEX: process.env.ELASTIC_INDEX,
    GA_ID: process.env.GA_ID,
  };
}

module.exports = config;
