const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const signalRoutes = require('./routes/signal');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use('/auth', authRoutes);
app.use('/api/signal', signalRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Trade Vision AI' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Trade Vision AI server running on port ${PORT}`));

module.exports = app;
