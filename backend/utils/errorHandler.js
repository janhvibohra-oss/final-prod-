module.exports = (err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    tip: 'Check your .env file or terminal logs'
  });
};
