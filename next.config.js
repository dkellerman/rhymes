require('dotenv').config();

module.exports = {
  target: 'serverless',
  env: {
    ELASTIC_ENDPOINT: process.env.ELASTIC_ENDPOINT,
    ELASTIC_INDEX: process.env.ELASTIC_INDEX,
  },
};
