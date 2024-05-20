// backend/local.js
const express = require('express');

const app = express();

app.use(express.json());

app.get('/api/resource', (req, res) => {
  res.json({ message: 'Hello from Express.js!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
