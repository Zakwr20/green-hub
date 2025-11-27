const { supabase } = require('../config/database');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    req.user = data.user;
    req.token = token;

    return next();
  } catch (err) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = { authenticate };

