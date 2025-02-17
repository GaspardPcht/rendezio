const express = require('express');
const Praticien = require('../models/Praticien'); // Correct: Praticien
const router = express.Router();
const generateToken = require('../utils/generateToken'); // Import de la fonction generateToken
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');

// Configuration du client OAuth2 pour les praticiens
const adminOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID_ADMIN,
  process.env.GOOGLE_CLIENT_SECRET_ADMIN,
  'https://rendezio-backend.vercel.app/praticien/auth/google/callback'
);

// Middleware pour vérifier le token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé : token manquant.' });
  }

  try {
    const praticien = await Praticien.findOne({ token });

    if (!praticien) {
      return res.status(401).json({ message: 'Accès refusé : token invalide.' });
    }

    req.praticien = praticien; // Stocke les infos du praticien
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Erreur serveur lors de la vérification du token.',
      error: error.message,
    });
  }
};

// Route pour créer un praticien
router.post('/create', async (req, res) => {
  const {
    name,
    title,
    email,
    phoneNumber,
    services,
    address,
    description,
    workingHours,
    password,
  } = req.body;

  try {
    const existingPraticien = await Praticien.findOne({ email });
    if (existingPraticien) {
      return res.json({ message: 'Un praticien avec cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken();

    const newPraticien = new Praticien({
      name,
      title,
      email,
      phoneNumber,
      services,
      address,
      description,
      workingHours,
      token,
      password: hashedPassword,
    });

    await newPraticien.save();

    res.json({
      message: 'Praticien créé avec succès.',
      praticien: newPraticien,
      id: newPraticien._id,
      token,
    });
  } catch (error) {
    res.json({
      message: 'Erreur serveur lors de la création du praticien.',
      error: error.message,
    });
  }
});

// Route pour connecter un praticien
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const praticien = await Praticien.findOne({ email });

    if (!praticien) {
      return res.status(404).json({ message: 'Praticien non trouvé.' });
    }

    if (!praticien.password) {
      return res.status(400).json({ message: 'Hash du mot de passe manquant dans la base de données.' });
    }

    const isPasswordValid = await bcrypt.compare(password, praticien.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = generateToken(); // Supposons que cette fonction existe
    praticien.token = token;

    await praticien.save();

    res.status(200).json({
      message: 'Connexion réussie.',
      praticien: {
        id: praticien._id,
        name: praticien.name,
        email: praticien.email,
        token: praticien.token,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la connexion.',
      error: error.message,
    });
  }
});

// Route pour récupérer les informations d'un praticien via son token
router.get('/infos', verifyToken, async (req, res) => {
  try {
    res.json({
      message: 'Praticien récupéré avec succès.',
      praticien: req.praticien,
    });
  } catch (error) {
    res.json({
      message: 'Erreur serveur lors de la récupération du praticien.',
      error: error.message,
    });
  }
});

// Route pour récupérer les utilisateurs associés à un praticien
router.get('/AllUsers', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ praticien: req.praticien._id }).select('-password');

    res.status(200).json({
      message: 'Utilisateurs associés récupérés avec succès.',
      praticien: req.praticien.name,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// Route pour l'authentification Google des praticiens
router.get('/auth/google/url', (req, res) => {
  try {
    const url = adminOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar'
      ],
      prompt: 'consent'
    });
    
    console.log('URL générée:', url); // Pour le débogage
    return res.json({ url });
  } catch (error) {
    console.error("Erreur:", error);
    return res.status(500).json({
      message: "Erreur lors de la configuration de l'authentification Google"
    });
  }
});

// Route de callback Google pour les praticiens
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      console.error('No code provided');
      return res.redirect('https://rendezio-frontend.vercel.app/admin/dashboard?error=no_code');
    }

    // Échange du code contre des tokens
    const { tokens } = await adminOAuth2Client.getToken(code);
    
    if (!tokens) {
      console.error('No tokens received');
      return res.redirect('https://rendezio-frontend.vercel.app/admin/dashboard?error=no_tokens');
    }

    adminOAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: adminOAuth2Client });
    const { data } = await oauth2.userinfo.get();

    // Recherche du praticien
    let praticien = await Praticien.findOne({ email: data.email });

    if (!praticien) {
      console.error('Praticien not found:', data.email);
      return res.redirect('https://rendezio-frontend.vercel.app/admin/dashboard?error=user_not_found');
    }

    // Mise à jour des tokens
    praticien.googleId = data.id;
    praticien.googleTokens = tokens;
    await praticien.save();

    console.log('Praticien updated successfully');
    return res.redirect(`https://rendezio-frontend.vercel.app/admin/dashboard?success=true`);
  } catch (error) {
    console.error('Erreur callback Google:', error);
    return res.redirect('https://rendezio-frontend.vercel.app/admin/dashboard?error=auth_failed');
  }
});

module.exports = router;