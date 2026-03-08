const express = require('express');
const router = express.Router();
const validateDocument = require('../models/Document');

/**
 * @route   GET api/vault/status
 * @desc    Get the current status of business documents
 */
router.get('/status', (req, res) => {
  // Mock data for the "Amir" dashboard demonstration
  const userDocuments = [
    { id: 'v1', title: 'Articles of Incorporation', status: 'Ready' },
    { id: 'v2', title: 'Business License', status: 'Draft' },
    { id: 'v3', title: 'CRA Tax Registration', status: 'Draft' }
  ];

  res.json(userDocuments);
});

/**
 * @route   POST api/vault/update
 * @desc    Update document status (e.g., when Zapier finishes a PDF)
 */
router.post('/update', (req, res) => {
  const { title, status } = req.body;

  // Validate the document update using File 7 Blueprint
  const validation = validateDocument({ title, status });

  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  // Logic: In a real app, you'd save this to a DB. 
  // Here, we just acknowledge the update for the Frontend.
  res.json({
    success: true,
    message: `Status for ${title} updated to ${status}.`,
    zapierFormatted: validation.formattedForZapier
  });
});

module.exports = router;
