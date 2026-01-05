const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fonction pour générer un token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const newUser = await User.create({ username, email, password });

    // Générer le token
    const token = generateToken(newUser._id);

    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token,        // <-- ici
      createdAt: newUser.createdAt
    });
  } catch (err) {
    console.error('Erreur lors de l’inscription:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token  // <-- ici aussi
    });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
