module.exports = (data) => {
  if (!data.email || !data.password) return { valid: false, error: "Email and password required" };
  return { valid: true };
};
