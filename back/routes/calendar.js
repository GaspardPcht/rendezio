const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
const { sendConfirmationEmail } = require('../utils/emailService');
const { sendConfirmationSMS } = require('../utils/smsService');

// Modèle Praticien
const Praticiens = mongoose.model(
  'Praticiens',
  new mongoose.Schema({
    googleTokens: Object, // Stocke les tokens Google ici
  })
);

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
  const praticienId = req.query.praticienId;
  console.log('PraticienId :', praticienId);
  if (!praticienId) {
    return res.status(400).send('ID du praticien requis.');
  }

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // Nécessaire pour obtenir un refresh token
    prompt: 'consent', // Force le consentement pour obtenir un nouveau refresh token
    scope: ['https://www.googleapis.com/auth/calendar'],
    state: JSON.stringify({ praticienId }),
  });

  res.redirect(url);
});

/** ====================
 * 2. Route : Callback OAuth
 * ==================== */
router.get('/auth/google/callback', async (req, res) => {
  try {
    console.log('Callback Google reçu');

    const code = req.query.code;
    console.log("Code d'autorisation :", code);

    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const praticienId = state.praticienId;
    console.log('PraticienId extrait :', praticienId);

    if (!code) {
      return res.status(400).send('Code d’autorisation manquant');
    }

    if (!praticienId || praticienId === 'null') {
      return res.status(400).send('ID du praticien manquant');
    }

    const { tokens } = await oAuth2Client.getToken(code);

    // Récupérer le praticien avec lean pour éviter les soucis Mongoose

    const praticien = await Praticiens.findById(praticienId).lean();

    if (!praticien) {
      console.error('Praticien non trouvé');
      return res.status(404).send('Praticien introuvable.');
    }

    // Assigner le token UID2
    const uid2Token = praticien.token;
    console.log('Token UID2 :', uid2Token);

    if (!uid2Token) {
      return res
        .status(500)
        .send('Token UID2 manquant pour ce praticien dans la base de données.');
    }

    // Mise à jour des tokens Google

    await Praticiens.findByIdAndUpdate(praticienId, {
      googleTokens: tokens,
    });

    // Rediriger vers le frontend avec le token UID2
    const redirectURL = `http://localhost:3001/admin/dashboard?token=${uid2Token}&praticienId=${praticienId}`;
    console.log('Redirection vers :', redirectURL);
    res.redirect(redirectURL);
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

    const { title, description, startTime, endTime, praticienId, client } =
      req.body;

    // Vérifiez si le praticien existe
    const praticien = await Praticiens.findById(praticienId);
    if (!praticien) {
      console.error("Praticien non trouvé avec l'ID :", praticienId);
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
      summary: title,
      description: `${description}\n\nInformations du client:\n- Nom: ${client.name} ${client.surname}\n- Téléphone: ${client.phone}\n- Email: ${client.email}`,
      start: { dateTime: startTime, timeZone: 'Europe/Paris' },
      end: { dateTime: endTime, timeZone: 'Europe/Paris' },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Événement créé :', response.data);

    // Préparer l'email HTML
    const emailContent = `
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
       .email-container { background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
       .email-header { background-color: #0078d7; color: #ffffff; text-align: center; padding: 20px; }
       .email-header img { max-width: 150px; }
       .email-body { padding: 20px; }
       .email-body h1 { color: #333333; }
       .email-body p { color: #555555; line-height: 1.6; }
       .email-footer { text-align: center; padding: 10px; background-color: #f9f9f9; color: #888888; font-size: 12px; }
     </style>
   </head>
   <body>
     <div class="email-container">
       <div class="email-header">
         <img src="https://yourwebsite.com/logo.png" alt="Logo de votre entreprise" />
         <h1>Confirmation de rendez-vous</h1>
       </div>
       <div class="email-body">
         <h1>Bonjour ${client.name},</h1>
         <p>Votre rendez-vous a été confirmé avec succès !</p>
         <p><strong>Détails du rendez-vous :</strong></p>
         <ul>
           <li><strong>Titre :</strong> ${title}</li>
           <li><strong>Description :</strong> ${description}</li>
           <li><strong>Date :</strong> ${new Date(startTime).toLocaleString(
             'fr-FR'
           )}</li>
           <li><strong>Heure de fin :</strong> ${new Date(
             endTime
           ).toLocaleString('fr-FR')}</li>
         </ul>
         <p>Merci d'avoir choisi notre service. Nous sommes ravis de vous accueillir.</p>
       </div>
       <div class="email-footer">
         © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
       </div>
     </div>
   </body>
   </html>
 `;

    // Appel de la fonction
    sendConfirmationEmail(
      client.email,
      'Confirmation de votre rendez-vous',
      emailContent
    );
    const smsMessage = `Bonjour ${
      client.name
    }, votre rendez-vous "${title}" est confirmé pour le ${new Date(
      startTime
    ).toLocaleString('fr-FR')}.`;

    // Envoyer l'e-mail et le SMS
    await sendConfirmationEmail(
      client.email,
      'Confirmation de votre rendez-vous',
      emailMessage
    );
    await sendConfirmationSMS(client.phone, smsMessage);

    // Réponse de confirmation
    res.status(201).json({
      message:
        'Rendez-vous créé avec succès dans Google Calendar. Notifications envoyées.',
      data: response.data,
    });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la création du rendez-vous.' });
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
      return res
        .status(400)
        .json({ error: 'Le praticien doit se connecter à Google.' });
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
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des rendez-vous.' });
  }
});

/** ====================
 * Route : Vérifier la connexion Google
 * ==================== */
router.get('/check-google-connection', async (req, res) => {
  try {
    const { praticienId } = req.query;
    console.log('PraticienId :', praticienId);
    if (!praticienId) {
      return res.status(400).json({ error: 'ID du praticien requis.' });
    }

    const praticien = await Praticiens.findById(praticienId);
    if (!praticien) {
      return res.status(404).json({ error: 'Praticien non trouvé.' });
    }
    console.log('Praticien :', praticien);
    const tokens = praticien.googleTokens;
    console.log('Tokens :', tokens);
    if (!tokens || !tokens.access_token) {
      console.error('Tokens absents ou incomplets.');
      return res.status(200).json({ connected: false });
    }

    oAuth2Client.setCredentials(tokens);

    // Testez les tokens ou rafraîchissez-les si nécessaire
    try {
      await oAuth2Client.getAccessToken();
      return res.status(200).json({ connected: true });
    } catch (error) {
      console.log('Tentative de rafraîchissement des tokens...');
      if (tokens.refresh_token) {
        const newTokens = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(newTokens.credentials);

        praticien.googleTokens = {
          ...praticien.googleTokens,
          access_token: newTokens.credentials.access_token,
          expiry_date: newTokens.credentials.expiry_date,
        };

        await praticien.save();
        return res.status(200).json({ connected: true });
      } else {
        console.error('Refresh token manquant ou invalide.');
        return res.status(200).json({ connected: false });
      }
    }
  } catch (error) {
    console.error(
      'Erreur lors de la vérification de la connexion Google :',
      error
    );
    res.status(500).json({
      error: 'Erreur lors de la vérification de la connexion Google.',
    });
  }
});

module.exports = router;
