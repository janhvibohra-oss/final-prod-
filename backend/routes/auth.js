const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateUser = require('../models/User');

/**
 * @route   POST api/auth/register
 * @desc    Handle new user sign-ups
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Use the User Model (File 4) to validate the data
  const validation = validateUser({ email, password });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // 2. In a real DB, we would save here. For now, we simulate success.
    // We "hash" the password so it's not stored as plain text.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the JWT Token (The Digital Keycard)
    const payload = { user: { email: email } };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          message: "Account created! Welcome to ScaleReady.",
          user: { email } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple hardcoded check for the hackathon/demo
  // Replace with real logic when you add a database
  if (email === "amir@scaleready.ca" && password === "password123") {
    const payload = { user: { email } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: "Login successful!" });
      }
    );
  } else {
    return res.status(400).json({ error: "Invalid Credentials" });
  }
});

module.exports = router;
