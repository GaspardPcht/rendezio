require('dotenv').config({ path: './env/.env' });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors'); // Importer CORS

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const praticienRouter = require('./routes/praticien');
const calendarRouter = require('./routes/calendar');

const app = express();

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rendezio-frontend.vercel.app',
    'https://rendezio-frontend.vercel.app/'  // Ajout avec le slash final
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Ajoutez ce middleware après la configuration CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rendezio-frontend.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err));

// Middlewares globaux
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/praticien', praticienRouter);
app.use('/calendar', calendarRouter);

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