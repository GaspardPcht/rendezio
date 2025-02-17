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
    console.log('=== Début du callback Google ===');
    console.log('Code reçu:', code);

    if (!code) {
      throw new Error('Code d\'autorisation manquant');
    }

    // Obtention des tokens
    const { tokens } = await clientOAuth2Client.getToken(code);
    console.log('Tokens obtenus:', tokens ? 'OK' : 'NON');
    clientOAuth2Client.setCredentials(tokens);

    // Récupération des informations de l'utilisateur
    const oauth2 = google.oauth2('v2');
    const userInfoResponse = await oauth2.userinfo.get({
      auth: clientOAuth2Client
    });

    const userData = userInfoResponse.data;
    console.log('=== Données utilisateur reçues ===');
    console.log('Email:', userData.email);
    console.log('Nom:', userData.given_name);
    console.log('Prénom:', userData.family_name);

    // Création ou mise à jour de l'utilisateur
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      console.log('Création d\'un nouvel utilisateur');
      user = new User({
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        googleId: userData.id,
        token: tokens.access_token
      });
    } else {
      console.log('Mise à jour de l\'utilisateur existant');
      user.token = tokens.access_token;
    }

    await user.save();
    console.log('Utilisateur sauvegardé en base de données');

    // Génération du JWT
    const jwtToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        firstName: user.firstName
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT généré avec succès');

    // Log final avant redirection
    console.log('=== Redirection vers le frontend ===');
    console.log('URL de redirection:', `${process.env.FRONTEND_URL}/client/dashboard?token=${jwtToken}`);
    console.log('Données de l\'utilisateur:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    return res.redirect(`${process.env.FRONTEND_URL}/client/dashboard?token=${jwtToken}`);

  } catch (error) {
    console.error('=== ERREUR DANS LE CALLBACK ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    return res.redirect(
      `${process.env.FRONTEND_URL}/error?message=${encodeURIComponent(error.message)}`
    );
  }
});

module.exports = router;