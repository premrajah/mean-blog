const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log("first");
  next();
});

app.use((req, res, next) => {
  console.log("second");
  res.send("Hello from express");
});

module.exports = app;
