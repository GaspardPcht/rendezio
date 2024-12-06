const express = require('express');
const Praticien = require('../models/Praticien'); // Correct: Praticien
const router = express.Router();
const generateToken = require('../utils/generateToken'); // Import de la fonction generateToken
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    // Vérification si l'email existe déjà
    const existingPraticien = await Praticien.findOne({ email });
    if (existingPraticien) {
      return res.json({ message: 'Un praticien avec cet email existe déjà.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du praticien
    const token = generateToken(); // Utilisation de generateToken pour générer un token unique
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

    // Sauvegarde dans la base de données
    await newPraticien.save();

    res.json({
      message: 'Praticien créé avec succès.',
      praticien: newPraticien,
      token, // Retourner le token dans la réponse
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
    // Vérifiez si l'email est fourni
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Recherchez le praticien par email
    const praticien = await Praticien.findOne({ email });

    if (!praticien) {
      return res.status(404).json({ message: 'Praticien non trouvé.' });
    }

    // Vérifiez si le mot de passe est défini
    if (!praticien.password) {
      return res.status(500).json({ message: 'Mot de passe manquant pour cet utilisateur.' });
    }

    // Comparez le mot de passe avec le hash
    const isPasswordValid = await bcrypt.compare(password, praticien.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un nouveau token
    const token = generateToken(); // Utilisation de generateToken
    praticien.token = token;

    // Sauvegarder le nouveau token
    await praticien.save();

    // Renvoyer les informations du praticien
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
    res.json({
      message: 'Erreur serveur lors de la connexion.',
      error: error.message,
    });
  }
});

// Route pour récupérer les informations d'un praticien via son token
router.get('/infos', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({ message: 'Token manquant.' });
  }

  try {
    // Rechercher le praticien correspondant au token
    const praticien = await Praticien.findOne({ token });

    if (!praticien) {
      return res.json({ message: 'Praticien non trouvé.' });
    }

    res.json({
      message: 'Praticien récupéré avec succès.',
      praticien,
    });
  } catch (error) {
    res.json({
      message: 'Erreur serveur lors de la récupération du praticien.',
      error: error.message,
    });
  }
});

// Route pour récupérer les utilisateurs associés à un praticien
router.get('/AllUsers', async (req, res) => {
  const praticienEmail = req.headers.authorization; 

  if (!praticienEmail) {
    return res.json({ message: 'Email du praticien manquant.' });
  }

  try {
    // Vérifier si le praticien existe
    const praticien = await Praticien.findOne({ email: praticienEmail });
    if (!praticien) {
      return res.status(404).json({ message: 'Praticien introuvable.' });
    }

    // Trouver les utilisateurs associés à ce praticien
    const users = await User.find({ praticien: praticien._id }).select('-password'); // Exclure les mots de passe

    res.status(200).json({
      message: 'Utilisateurs associés récupérés avec succès.',
      praticien: praticien.name,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;