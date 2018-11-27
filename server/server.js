const express = require('express');

const app = express();

app.use((req, res, next) => {
  global.console.log('Server running...');
  next();
});

app.use(express.static('../client'));

app.listen(8081, () => {
  global.console.log('Serving at port 8081');
});
