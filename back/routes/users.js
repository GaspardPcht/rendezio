const express = require('express');
const { google } = require('googleapis');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Praticien = require('../models/Praticien');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, timeZone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      token: generateToken(),
    });

    await newUser.save();

    const responseUser = {
      ...newUser.toObject(),
      createdAt: new Date(newUser.createdAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      updatedAt: new Date(newUser.updatedAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
    };

    res.status(201).json({
      message: 'Compte créé avec succès.',
      userId: newUser._id,
      user: responseUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// Configuration du client OAuth2 avec une URL dynamique
const clientOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_CLIENTS,
  process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
  process.env.NODE_ENV === 'production'
    ? 'https://rendezio-backend.vercel.app/users/auth/google/callback'
    : 'http://localhost:5000/users/auth/google/callback'
);

// Route pour obtenir l'URL d'authentification Google
router.get('/auth/google/url', (req, res) => {
  try {
    console.log('Génération de l\'URL d\'authentification...');
    
    const url = clientOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
        'openid'
      ],
      prompt: 'consent',
      state: JSON.stringify({ source: 'client' })
    });

    console.log("URL d'authentification générée:", url);
    res.json({ url });
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL:", error);
    res.status(500).json({
      message: "Erreur lors de la configuration de l'authentification Google",
      error: error.message
    });
  }
});

// Route de callback Google
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    const { tokens } = await clientOAuth2Client.getToken(code);
    clientOAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: clientOAuth2Client });
    const { data } = await oauth2.userinfo.get();

    // Créer ou mettre à jour l'utilisateur avec les informations Google
    let user = await User.findOne({ email: data.email });
    
    if (!user) {
      user = new User({
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
        googleId: data.id,
        token: generateToken()
      });
      await user.save();
    }

    // Rediriger vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL}/client/dashboard?token=${user.token}`);
  } catch (error) {
    console.error('Erreur callback Google:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=auth_failed`);
  }
});

module.exports = router;