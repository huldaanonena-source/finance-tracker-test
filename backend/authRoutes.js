// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

console.log('register:', register);
console.log('login:', login);

// Routes
router.post('/signup', register); // pas de parenthèses
router.post('/login', login);     // pas de parenthèses

module.exports = router;
