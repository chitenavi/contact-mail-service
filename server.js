const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const logger = require('morgan');
// const jwtAuth = require('./middlewares/jwtAuth');
const reCaptcha = require('./middlewares/reCaptcha');
const limiter = require('./middlewares/rateLimiter');
require('dotenv').config();

const port = process.env.PORT || 3587;

const middlewares = [
  //...
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.PROD_DOMAIN : '*',
  }),
  helmet(),
  limiter,
  logger('dev'),
  express.urlencoded({ extended: true }),
  express.json(),
];

app.use(middlewares);

app.use('/auth', require('./routes/auth'));
app.use('/contact', reCaptcha(), require('./routes/contact'));

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
