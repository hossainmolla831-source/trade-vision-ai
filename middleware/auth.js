const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'trade_vision_secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const premiumMiddleware = (req, res, next) => {
  if (req.user.plan === 'free' && req.user.dailySignals >= 3)
    return res.status(403).json({ error: 'ফ্রি প্ল্যানের সীমা শেষ। প্রিমিয়ামে আপগ্রেড করুন।' });
  next();
};

module.exports = { authMiddleware, premiumMiddleware };
