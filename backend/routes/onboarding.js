const express = require('express');
const router = express.Router();
const axios = require('axios'); // The tool for sending data to Zapier
const validateBusiness = require('../models/Business');
// Middleware to ensure the user is logged in (we will create this in Phase 4)
// const protect = require('../middleware/protect'); 

/**
 * @route   POST api/onboarding/submit
 * @desc    Receive onboarding data and relay to Zapier
 */
router.post('/submit', async (req, res) => {
  const businessData = req.body;

  // 1. Run the data through our Validation Blueprint (File 5)
  const validation = validateBusiness(businessData);
  
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: "Validation failed", 
      missing: validation.missingFields 
    });
  }

  try {
    // 2. Prepare the payload for Zapier
    // We can add extra fields here that Zapier might need, like a timestamp
    const payload = {
      ...businessData,
      source: 'ScaleReady Website',
      submittedAt: new Date().toISOString()
    };

    // 3. The Big Moment: Send data to the Zapier Webhook URL from your .env file
    const zapierResponse = await axios.post(process.env.ZAPIER_WEBHOOK_URL, payload);

    console.log('✅ Data successfully relayed to Zapier');

    // 4. Respond to the React Frontend
    res.status(200).json({
      success: true,
      message: "Onboarding received! Your roadmap is being generated.",
      zapierStatus: zapierResponse.statusText
    });

  } catch (err) {
    console.error('❌ Zapier Connection Error:', err.message);
    
    // Fallback error message if Zapier is down or the URL is wrong
    res.status(500).json({ 
      error: "We could not connect to the automation engine. Please try again later." 
    });
  }
});

module.exports = router;
