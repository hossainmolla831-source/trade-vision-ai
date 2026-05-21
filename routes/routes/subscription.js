const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 'free',
        name: 'ফ্রি',
        price: 0,
        features: ['দৈনিক ৩টি সিগন্যাল', 'বেসিক AI বিশ্লেষণ', 'শেষ ১০টি ইতিহাস']
      },
      {
        id: 'premium',
        name: 'প্রিমিয়াম',
        price: 499,
        duration_days: 30,
        features: ['সীমাহীন সিগন্যাল', 'বিস্তারিত AI বিশ্লেষণ', 'পুশ নোটিফিকেশন', 'সম্পূর্ণ ইতিহাস']
      }
    ]
  });
});

router.get('/my', authMiddleware, (req, res) => {
  res.json({ success: true, plan: req.user.plan });
});

module.exports = router;
