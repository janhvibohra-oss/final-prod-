module.exports = (businessData) => {
  return {
    template_id: "CA_GOV_FORM_01",
    fields: {
      legal_name: businessData.companyName,
      region: businessData.province,
      sector: businessData.industry
    }
  };
};
