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
  process.env.GOOGLE_REDIRECT_URI
);

// Route initiale pour l'authentification Google
router.get('/auth/google', (req, res) => {
  try {
    const url = clientOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar'
      ],
      prompt: 'consent select_account'
    });

    console.log("URL d'authentification générée:", url);
    res.redirect(url);
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
    console.log('Code reçu:', code);

    if (!code) {
      throw new Error("Code d'autorisation manquant");
    }

    console.log('Tentative d’échange du code avec:', {
      client_id: process.env.GOOGLE_CLIENT_ID_CLIENTS,
      client_secret: process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      code: code
    });

    // Échange du code contre un token d'accès
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID_CLIENTS,
      client_secret: process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const tokens = tokenResponse.data;
    clientOAuth2Client.setCredentials(tokens);
    console.log('Tokens reçus:', tokens);

    // Récupération des informations de l'utilisateur
    const oauth2 = google.oauth2({ version: 'v2', auth: clientOAuth2Client });
    const userInfoResponse = await oauth2.userinfo.get();
    const userData = userInfoResponse.data;
    console.log('Données utilisateur reçues:', userData.email);

    // Création ou mise à jour de l'utilisateur
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = new User({
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        googleId: userData.id,
        token: tokens.access_token
      });
    } else {
      user.token = tokens.access_token;
    }
    await user.save();

    // Génération du JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirection vers le frontend
    const redirectUrl = `${process.env.FRONTEND_URL}/client/dashboard?token=${jwtToken}`;
    console.log('Redirection vers:', redirectUrl);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Erreur dans le callback:', error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/error?message=${encodeURIComponent(error.message)}`
    );
  }
});

module.exports = router;