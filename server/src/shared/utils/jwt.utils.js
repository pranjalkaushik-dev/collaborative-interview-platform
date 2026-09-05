const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for an authenticated user
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'super_secret_jwt_key_pranjal_nie_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify a JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'super_secret_jwt_key_pranjal_nie_2026'
  );
};

module.exports = {
  generateToken,
  verifyToken
};
