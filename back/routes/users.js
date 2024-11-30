const express = require('express');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

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
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

module.exports = router;