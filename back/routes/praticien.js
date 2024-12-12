const express = require('express');
const Praticien = require('../models/Praticien'); // Correct: Praticien
const router = express.Router();
const generateToken = require('../utils/generateToken'); // Import de la fonction generateToken
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    const { practitionerId } = req.query;

    if (!practitionerId) {
      return res.status(400).json({ message: 'ID du praticien requis.' });
    }

    const users = await User.find({ practitioner: practitionerId }).select(
      '-password'
    );

    res.status(200).json({
      message: 'Utilisateurs associés récupérés avec succès.',
      users,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;