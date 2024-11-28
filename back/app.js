require('dotenv').config({ path: './env/.env' });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err));

// Middlewares globaux
app.use(logger('dev')); // Journalisation des requêtes
app.use(express.json()); // Analyse des requêtes JSON
app.use(express.urlencoded({ extended: false })); // Analyse des requêtes encodées en URL
app.use(cookieParser()); // Analyse des cookies
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques

// Routes
app.use('/', indexRouter); // Route pour `/`
app.use('/users', usersRouter); // Route pour `/users`

// Gestion des erreurs 404
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Middleware global de gestion des erreurs
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
});

module.exports = app;