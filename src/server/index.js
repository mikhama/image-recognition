const express = require('express');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  global.console.log('Server running...');
  next();
});

app.use(express.static(path.join(__dirname, '../client')));

app.listen(9000, () => {
  global.console.log('Serving at port 9000');
});
