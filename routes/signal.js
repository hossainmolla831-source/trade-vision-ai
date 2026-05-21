const express = require('express');
const { authMiddleware, premiumMiddleware } = require('../middleware/auth');
const router = express.Router();

const signals = [];

router.post('/analyze', authMiddleware, premiumMiddleware, (req, res) => {
  const { pair = 'EUR/USD' } = req.body;

  const mockResults = [
    { signal: 'BUY', confidence: 82, reason: 'Bullish engulfing প্যাটার্ন দেখা গেছে। সাপোর্ট লেভেল ধরে রেখেছে।', pattern: 'Bullish Engulfing', risk: 'LOW' },
    { signal: 'SELL', confidence: 76, reason: 'Bearish দোজি ক্যান্ডেল তৈরি হয়েছে। রেজিস্ট্যান্স লেভেলে আটকে গেছে।', pattern: 'Doji', risk: 'MEDIUM' },
    { signal: 'BUY', confidence: 88, reason: 'হ্যামার প্যাটার্ন দেখা গেছে। ট্রেন্ড উপরের দিকে।', pattern: 'Hammer', risk: 'LOW' },
    { signal: 'SELL', confidence: 79, reason: 'Shooting star প্যাটার্ন। মোমেন্টাম কমছে।', pattern: 'Shooting Star', risk: 'HIGH' },
  ];

  const result = mockResults[Math.floor(Math.random() * mockResults.length)];
  signals.push({ user_id: req.user.id, pair, ...result, created_at: new Date() });

  res.json({ success: true, pair, ...result, expiry: '1 minute', timestamp: new Date().toISOString() });
});

router.get('/history', authMiddleware, (req, res) => {
  const userSignals = signals.filter(s => s.user_id === req.user.id);
  res.json({ success: true, signals: userSignals });
});

module.exports = router;
