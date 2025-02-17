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

// Configuration du client OAuth2
const clientOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_CLIENTS,
  process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
  'https://rendezio-backend.vercel.app/users/auth/google/callback'
);

// Route pour obtenir l'URL d'authentification Google
router.get('/auth/google/url', (req, res) => {
  try {
    // Configuration simplifiée pour éviter le timeout
    const url = clientOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent'
    });

    // Réponse immédiate
    return res.json({ url });
  } catch (error) {
    console.error("Erreur:", error);
    return res.status(500).json({
      message: "Erreur lors de la configuration de l'authentification Google"
    });
  }
});

// Route de callback Google
router.get('/auth/google/callback', async (req, res) => {
  try {
    console.log('Callback reçu:', req.query);
    const { code } = req.query;
    
    if (!code) {
      console.error('Code manquant dans la requête');
      // URL de redirection en cas d'erreur
      return res.redirect('https://rendezio-frontend.vercel.app/auth/signin?error=no_code');
    }

    // Échange du code contre des tokens
    const { tokens } = await clientOAuth2Client.getToken(code);
    console.log('Tokens reçus:', tokens ? 'Oui' : 'Non');
    
    clientOAuth2Client.setCredentials(tokens);

    // Récupération des informations de l'utilisateur
    const oauth2 = google.oauth2({ version: 'v2', auth: clientOAuth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log('Informations utilisateur reçues:', data.email);

    // Création ou mise à jour de l'utilisateur
    let user = await User.findOne({ email: data.email });
    
    if (!user) {
      console.log('Création d\'un nouvel utilisateur');
      user = new User({
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
        googleId: data.id,
        token: generateToken()
      });
      await user.save();
    }

    // URL de redirection en cas de succès
    console.log('Redirection vers:', 'https://rendezio-frontend.vercel.app/client/dashboard?token=' + user.token);
    return res.redirect('https://rendezio-frontend.vercel.app/client/dashboard?token=' + user.token);
  } catch (error) {
    console.error('Erreur dans le callback Google:', error);
    // URL de redirection en cas d'erreur
    return res.redirect('https://rendezio-frontend.vercel.app/auth/signin?error=auth_failed');
  }
});

module.exports = router;