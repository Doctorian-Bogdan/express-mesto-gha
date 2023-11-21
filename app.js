const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Database connection successful'))
  .catch(() => console.log('Database connection failed'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '654d70aab8892557cd3db372',
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
