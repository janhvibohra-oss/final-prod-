const validateBusiness = (data = {}) => {
  // Align required fields with what the React Onboarding flow collects
  const required = ['type', 'province'];
  const missingFields = required.filter((field) => !data[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

module.exports = validateBusiness;
