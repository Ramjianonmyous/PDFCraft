const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  }

  next();
};

exports.requirePro = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.plan === 'free') {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a Pro plan',
      upgradRequired: true,
    });
  }

  next();
};

exports.checkConversionLimit = async (req, res, next) => {
  // If user is pro/enterprise, skip limit check
  if (req.user && req.user.plan !== 'free') {
    return next();
  }

  // For free/guest users, check daily limit
  if (req.user) {
    if (!req.user.canConvert()) {
      return res.status(429).json({
        success: false,
        message: 'Daily conversion limit reached. Upgrade to Pro for unlimited conversions.',
        upgradeRequired: true,
        dailyLimit: parseInt(process.env.FREE_CONVERSIONS_PER_DAY || 5),
      });
    }
  } else {
    // Guest users: check by IP (simplified - use Redis in production)
    // For now, allow guests with a reduced limit of 2
    req.isGuest = true;
  }

  next();
};
