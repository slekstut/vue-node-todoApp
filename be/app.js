const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const todoRoutes = require('./routes/todos');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 next();
});

app.use('/todos', todoRoutes);

// middleware for error handling, called after next();
app.use((error, req, res, next) => {
 console.log(error);
 const status = error.statusCode || 500;
 const message = error.message;
 res.status(status).json({ message: message });
});

const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECT_STRING)
 .then(result => {
  app.listen(port, console.log(`Server is running on PORT ${port}`));
 })
  .catch(err => console.log(err));