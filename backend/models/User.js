const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"]
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
    minlength: 6
  }
});

// Hash du mot de passe avant save
userSchema.pre('save', async function() {
  // Vérifie si le mot de passe a été modifié
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Erreur pre-save User:", err);
    throw err; // relance l'erreur pour que Mongoose échoue correctement
  }
});

// Vérifier le mot de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer un token JWT
userSchema.methods.getSignedToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = mongoose.model('User', userSchema);
