const express = require('express');
const dotenv = require('dotenv');
const aiController = require('./controllers/aiController');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ربط aiController مباشرة
app.post('/api/ai', aiController.handleAIRequest);

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send('HealthyAI backend is running with AI controller!');
});

// استخدام PORT من البيئة (مهم لـ Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});