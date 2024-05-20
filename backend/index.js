// backend/index.js
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(express.json());

app.get('/api/resource', (req, res) => {
  res.json({ message: 'Hello from Express.js!' });
});

module.exports.handler = serverless(app);
