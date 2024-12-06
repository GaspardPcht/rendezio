const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

// Modèle Praticien
const Praticiens = mongoose.model('Praticiens', new mongoose.Schema({
  googleTokens: Object, // Stocke les tokens Google ici
}));

// Initialisation de l'OAuth2Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/** ====================
 * 1. Route : Démarrer l'authentification Google
 * ==================== */
router.get('/auth/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(url);
});

/** ====================
 * 2. Route : Callback OAuth
 * ==================== */
router.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('Code d’autorisation manquant');
    }

    // Obtenir les tokens Google
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Tokens reçus de Google :', tokens);

    // ID du praticien à mettre à jour
    const praticienId = '675071ebda842be512fb980d';

    // Vérifiez si le praticien existe
    const praticien = await Praticiens.findById(praticienId);
    if (!praticien) {
      console.error('Praticien introuvable avec l\'ID :', praticienId);
      return res.status(404).send('Praticien introuvable.');
    }

    // Ajouter les googleTokens au praticien existant
    praticien.googleTokens = tokens;
    await praticien.save(); // Sauvegarder le document mis à jour

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
    console.log('Requête reçue :', req.body);

    const { title, description, startTime, endTime, praticienId, client } = req.body;

    // Vérifiez si le praticien existe
    const praticien = await Praticiens.findById(praticienId);
    if (!praticien) {
      console.error('Praticien non trouvé avec l\'ID :', praticienId);
      return res.status(404).json({ error: 'Praticien non trouvé.' });
    }

    // Vérifiez les tokens du praticien
    const tokens = praticien.googleTokens;
    if (!tokens || !tokens.access_token) {
      throw new Error('Tokens Google manquants.');
    }

    oAuth2Client.setCredentials(tokens);

    // Rafraîchir les tokens si nécessaire
    try {
      await oAuth2Client.getAccessToken();
    } catch (error) {
      console.log('Rafraîchissement des tokens...');
      const newTokens = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newTokens.credentials);

      praticien.googleTokens = {
        ...praticien.googleTokens,
        access_token: newTokens.credentials.access_token,
        expiry_date: newTokens.credentials.expiry_date,
      };

      await praticien.save(); // Mettre à jour les tokens
    }

    // Créer l'événement avec les détails du client
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const event = {
      summary: title, // Par exemple : "Consultation avec John Doe"
      description: `${description}\n\nInformations du client:\n- Nom: ${client.name} ${client.surname}\n- Téléphone: ${client.phone}\n- Email: ${client.email}`,
      start: { dateTime: startTime, timeZone: 'Europe/Paris' },
      end: { dateTime: endTime, timeZone: 'Europe/Paris' },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Événement créé :', response.data);

    // Réponse de confirmation
    res.status(201).json({
      message: 'Rendez-vous créé avec succès dans Google Calendar.',
      data: response.data,
    });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous.' });
  }
});

router.get('/upcoming-appointments', async (req, res) => {
  try {
    const { praticienId } = req.query;

    const praticien = await Praticiens.findById(praticienId);
    if (!praticien) {
      return res.status(404).json({ error: 'Praticien non trouvé.' });
    }

    const tokens = praticien.googleTokens;
    if (!tokens || !tokens.access_token) {
      return res.status(400).json({ error: 'Le praticien doit se connecter à Google.' });
    }

    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.status(200).json({ events: response.data.items });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous.' });
  }
});

module.exports = router;