/**
 * GRANT DATA BLUEPRINT
 * This validates the structure of grant data before it is 
 * displayed on the Dashboard or sent to Zapier.
 */

const validateGrant = (grantData) => {
  const requiredFields = [
    'grantName', 
    'amount', 
    'provinceEligibility', 
    'industryFocus'
  ];

  const missing = requiredFields.filter(field => !grantData[field]);

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    // Add a timestamp for tracking when the match was processed
    processedAt: new Date().toISOString()
  };
};

module.exports = validateGrant;
