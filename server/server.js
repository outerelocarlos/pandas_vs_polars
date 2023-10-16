const express = require('express');
const path = require('path');
const notebookWatcher = require('../src/notebookWatcher');
const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(notebookWatcher);

app.get('/notebook', (req, res) => {
  console.log('Accessing /notebook route');
  res.sendFile(path.resolve(__dirname, 'notebook.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
