const checkZapier = () => {
  if (!process.env.ZAPIER_WEBHOOK_URL) {
    console.warn('⚠️ WARNING: ZAPIER_WEBHOOK_URL is missing in .env');
  } else {
    console.log('🔗 Zapier Relay: CONFIGURED');
  }
};

module.exports = checkZapier;
