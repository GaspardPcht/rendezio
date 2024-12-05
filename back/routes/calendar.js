const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

// Modèle Practicien
const Practitioner = mongoose.model('Practitioner', new mongoose.Schema({
  googleTokens: Object, // Stocke les tokens Google ici
}));

// Initialisation de l'OAuth2Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

console.log('URI de redirection utilisée :', process.env.GOOGLE_REDIRECT_URI);

/** ====================
 * 1. Route : Démarrer l'authentification Google
 * ==================== */
router.get('/auth/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  console.log('URL générée pour Google OAuth :', url);
  res.redirect(url);
});

/** ====================
 * 2. Route : Callback OAuth
 * ==================== */
router.get('/auth/google/callback', async (req, res) => {
  console.log('Route /auth/google/callback appelée avec query params :', req.query);
  try {
    const code = req.query.code;
    if (!code) {
      console.error('Code d’autorisation manquant');
      return res.status(400).send('Code d’autorisation manquant');
    }

    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Tokens reçus de Google :', tokens);
    
    // Sauvegarde et redirection
    const practitionerId = '6484af9b6d88aa2bd72f7e77';
    await Practitioner.findByIdAndUpdate(practitionerId, { googleTokens: tokens }, { new: true, upsert: true });
    res.redirect('http://localhost:3001/Praticien/dashboard');
  } catch (error) {
    console.error('Erreur lors de la liaison du compte Google :', error);
    res.status(500).send('Erreur lors de la liaison du compte Google.');
  }
});

/** ====================
 * 3. Route : Créer un rendez-vous
 * ==================== */
router.post('/create-appointment', async (req, res) => {
  try {
    const { title, description, startTime, endTime, practitionerId } = req.body;

    // Récupérer les tokens depuis la base de données
    const practitioner = await Practitioner.findById(practitionerId);
    if (!practitioner || !practitioner.googleTokens) {
      throw new Error('Tokens introuvables pour ce praticien.');
    }

    oAuth2Client.setCredentials(practitioner.googleTokens);

    // Crée l'événement
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const event = {
      summary: title,
      description: description,
      start: { dateTime: startTime, timeZone: 'Europe/Paris' },
      end: { dateTime: endTime, timeZone: 'Europe/Paris' },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(201).json({ message: 'Rendez-vous créé avec succès', data: response.data });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous.' });
  }
});

module.exports = router;