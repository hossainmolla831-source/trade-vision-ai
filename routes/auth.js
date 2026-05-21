const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'trade_vision_secret_key';

// In-memory users (real app-এ PostgreSQL ব্যবহার করবে)
const users = [];

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'সব তথ্য দিন।' });

  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'এই ইমেইল আগেই নিবন্ধিত।' });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hash,
    plan: 'free',
    daily_signals: 0
  };
  users.push(user);

  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan, dailySignals: 0 },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(201).json({
    success: true,
    token,
    user: { id: user.id, name, email, plan: 'free' }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'ইমেইল ও পাসওয়ার্ড দিন।' });

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(401).json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল।' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল।' });

  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan, dailySignals: user.daily_signals },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
  });
});

module.exports = router;
