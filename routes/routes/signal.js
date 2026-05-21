const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { authMiddleware, premiumMiddleware } = require('../middleware/auth');
const router = express.Router();

const signalHistory = [];

const SYSTEM_PROMPT = `তুমি একজন Binary Options ট্রেডিং বিশেষজ্ঞ AI।
ইউজার তোমাকে একটি Forex চার্টের স্ক্রিনশট দেবে।
তোমার কাজ হলো পরবর্তী ১ মিনিটের ক্যান্ডেল UP হবে নাকি DOWN হবে সেটা বিশ্লেষণ করা।

বিশ্লেষণে যা দেখবে:
- চলমান ক্যান্ডেলের রঙ, আকার ও উইক
- সাম্প্রতিক ক্যান্ডেলগুলোর প্যাটার্ন
- সাপোর্ট ও রেজিস্ট্যান্স লেভেল
- ট্রেন্ডের দিক

সর্বদা এই JSON ফরম্যাটে উত্তর দাও, অন্য কিছু লিখবে না:
{
  "signal": "BUY" বা "SELL",
  "confidence": 0-100,
  "reason": "বাংলায় ২-৩ লাইনের কারণ",
  "pattern": "চার্ট প্যাটার্নের নাম",
  "risk": "LOW" বা "MEDIUM" বা "HIGH"
}`;

router.post('/analyze', authMiddleware, premiumMiddleware, async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', pair = 'EUR/USD' } = req.body;

  if (!imageBase64)
    return res.status(400).json({ error: 'Image দিন।' });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: imageBase64 }
          },
          {
            type: 'text',
            text: `এই ${pair} চার্টের স্ক্রিনশট বিশ্লেষণ করে পরের ১ মিনিটের ক্যান্ডেল সম্পর্কে বলো।`
          }
        ]
      }]
    });

    const rawText = response.content[0].text.trim();
    const clean = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    signalHistory.push({ user_id: req.user.id, pair, ...result, created_at: new Date() });

    res.json({
      success: true,
      pair,
      ...result,
      expiry: '1 minute',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Signal error:', err);
    res.status(500).json({ error: 'AI বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
  }
});

router.get('/history', authMiddleware, (req, res) => {
  const userSignals = signalHistory.filter(s => s.user_id === req.user.id);
  res.json({ success: true, signals: userSignals });
});

module.exports = router;
