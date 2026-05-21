# Trade Vision AI — Backend

## ফাইল স্ট্রাকচার
```
trade-vision-ai/
├── server.js              ← মেইন সার্ভার
├── db.js                  ← ডেটাবেজ কানেকশন
├── package.json
├── schema.sql             ← ডেটাবেজ টেবিল
├── .env.example           ← এটা কপি করে .env বানাও
├── routes/
│   ├── auth.js            ← /auth/login, /auth/register
│   ├── signal.js          ← /api/signal/analyze, /api/signal/history
│   └── subscription.js   ← /api/subscription/plans
└── middleware/
    └── auth.js            ← JWT token check
```

## চালানোর নিয়ম

### ১. ডিপেন্ডেন্সি ইন্সটল
```
npm install
```

### ২. .env ফাইল বানাও
```
copy .env.example .env
```
তারপর .env খুলে ANTHROPIC_API_KEY বসাও।

### ৩. সার্ভার চালাও
```
node server.js
```

## API টেস্ট

### Register
```
POST http://localhost:3000/auth/register
{"name":"Test User","email":"test@gmail.com","password":"123456"}
```

### Login
```
POST http://localhost:3000/auth/login
{"email":"test@gmail.com","password":"123456"}
```

### Signal Analyze (token লাগবে)
```
POST http://localhost:3000/api/signal/analyze
Authorization: Bearer <token>
{"imageBase64":"...","pair":"EUR/USD"}
```
