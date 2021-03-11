// index.js is the source file for the server

require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
