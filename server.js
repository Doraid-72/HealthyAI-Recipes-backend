const express = require('express');
const dotenv = require('dotenv');
const recipeRoutes = require('./routes/recipeRoutes'); // ربط الـ routes

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ربط الـ routes
app.use('/api/recipes', recipeRoutes);

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send('HealthyAI Recipes backend is running!');
});

// استخدام PORT من البيئة (مهم لـ Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});