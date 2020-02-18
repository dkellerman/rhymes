const isDev = process.env.NODE_ENV === 'development';

const config = {
  target: 'serverless',
};

if (isDev) {
  require('dotenv').config();
  config.env = {
    ELASTIC_ENDPOINT: process.env.ELASTIC_ENDPOINT,
    ELASTIC_INDEX: process.env.ELASTIC_INDEX,
  };
}

module.exports = config;
