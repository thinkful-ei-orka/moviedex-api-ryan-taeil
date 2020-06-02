"use strict";

require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const moviesData = require('./movies-data');

app.use(cors());
app.use(helmet());
app.use(morgan('common'));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

app.get('/movie', (req, res) => {
  let responseData = moviesData;
  const { genre, country, avg_vote } = req.query;

  if (genre) {
    responseData = responseData.filter((result) =>
      result.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    responseData = responseData.filter((result) =>
      result.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    responseData = responseData.filter((result) =>
      result.avg_vote >= avg_vote
    );
  }

  res.json(responseData);
});

app.listen(3000, () => {
  console.log("Express server is listening on port 3000!");
});
