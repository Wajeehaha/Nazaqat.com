const express = require('express');
const Nail = require('../models/Nail');

const router = express.Router();

// Search nail products by name
router.get('/search-product', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    // Search in nails
    const nail = await Nail.findOne({ name: { $regex: name, $options: 'i' } });
    if (nail) {
      return res.json({ ...nail.toObject(), category: 'nails' });
    }

    // If no product is found
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('Error searching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;