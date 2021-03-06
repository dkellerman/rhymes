let config = {};

if (process.env.NODE_ENV === 'development') {
  require('dotenv-flow').config();

  config.env = {
    ELASTIC_ENDPOINT: process.env.ELASTIC_ENDPOINT,
    ELASTIC_INDEX: process.env.ELASTIC_INDEX,
    GA_ID: process.env.GA_ID,
  };
}

module.exports = config;
