/**
 * DOCUMENT DATA BLUEPRINT
 * Defines the structure for files in the ScaleReady Vault.
 */

const validateDocument = (docData) => {
  // Define the valid statuses for a Canadian business document
  const validStatuses = ['Draft', 'Ready', 'Submitted', 'Approved'];

  const errors = [];

  if (!docData.title) {
    errors.push("Document title is required.");
  }

  if (!validStatuses.includes(docData.status)) {
    errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    // Formats the data for the Zapier Interface Chatbot
    formattedForZapier: {
      doc_title: docData.title,
      doc_status: docData.status || 'Draft',
      last_updated: new Date().toLocaleDateString('en-CA')
    }
  };
};

module.exports = validateDocument;
