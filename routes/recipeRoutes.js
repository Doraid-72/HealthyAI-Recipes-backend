const express = require('express');
const router = express.Router();

// مثال: إرجاع قائمة وصفات
router.get('/', (req, res) => {
  res.json({ message: 'List of recipes will be here' });
});

module.exports = router;