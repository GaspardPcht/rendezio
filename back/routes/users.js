const express = require('express');
const { google } = require('googleapis');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Praticien = require('../models/Praticien')

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, timeZone } = req.body;

  try {
    // Vérifie si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hache le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crée un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      token: generateToken(),
    });

    // Sauvegarde l'utilisateur
    await newUser.save();

    // Convertit les dates au format local
    const responseUser = {
      ...newUser.toObject(),
      createdAt: new Date(newUser.createdAt).toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris', // Force le fuseau horaire
      }),
      updatedAt: new Date(newUser.updatedAt).toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris', // Force le fuseau horaire
      }),
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


// Route pour se connecter
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    user.token = generateToken();
    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: 'Connexion réussie.',
      userId: user._id,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});


// Route pour associer un utilisateur à un praticien
router.post('/associate-pratitien', async (req, res) => {
  const { userId, practitionerEmail } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifie si le praticien existe
    const practitioner = await Praticien.findOne({ email: practitionerEmail });
    if (!practitioner) {
      return res.status(404).json({ message: 'Praticien introuvable avec cet email.' });
    }

    // Associe l'utilisateur au praticien
    user.practitioner = practitioner._id; 
    await user.save();

    res.status(200).json({
      message: 'Utilisateur associé au praticien avec succès.',
      user: {
        ...user.toObject(),
        practitioner: practitioner.toObject(), // Retourne les infos du praticien associées
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

const clientOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_CLIENTS,
  process.env.GOOGLE_CLIENT_SECRET_CLIENTS,
  process.env.GOOGLE_REDIRECT_URI_CLIENTS
);

router.get('/auth/google', (req, res) => {
  const url = clientOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Code d’autorisation manquant.' });
  }

  try {
    const { tokens } = await clientOAuth2Client.getToken(code);
    clientOAuth2Client.setCredentials(tokens);

    res.redirect('http://localhost:3001/client/dashboard');
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tokens.', error: error.message });
  }
});

module.exports = router;