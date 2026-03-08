require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import Infrastructure Utilities
const checkZapier = require('./config/relay');
const errorHandler = require('./utils/errorHandler');

const app = express();

// --- 2. Middleware ---
// Allows your React app (port 5173) to communicate with this server
app.use(cors()); 

// Parses incoming JSON data from your forms so the server can read it
app.use(express.json()); 

// --- 3. Initial Configuration Checks ---
// Verifies the Zapier Webhook is configured in your .env file
checkZapier();

// --- 4. Main API Routes ---

// Handles Login and Sign-up logic (File 8)
app.use('/api/auth', require('./routes/auth'));

// Relays data from your 5-step form to Zapier (File 9)
app.use('/api/onboarding', require('./routes/onboarding'));

// The ScaleReady Brain: Filters 200+ grants for matches (File 10)
app.use('/api/grants', require('./routes/matcher'));

// Manages the status of legal documents like Incorporation (File 11)
app.use('/api/vault', require('./routes/vault'));

// --- 5. Health Check & Diagnostics ---
// Simple test to verify the backend is live in your browser
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "Online", 
    engine: "ScaleReady Relay v1.0",
    timestamp: new Date().toISOString()
  });
});

// --- 6. Global Error Handling ---
// This uses your custom error handler (File 14) to catch bugs without crashing the server
app.use(errorHandler);

// --- 7. Start the Engine ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('--------------------------------------------');
  console.log(`🚀 SCALE READY SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
  console.log('--------------------------------------------');
});
