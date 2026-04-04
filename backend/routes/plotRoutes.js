const express = require('express');
const router = express.Router();
const Plot = require('../models/Plot');

// CREATE plot
router.post('/', async (req, res) => {
  try {
    const plot = new Plot(req.body);
    const saved = await plot.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all plots (with user info)
router.get('/', async (req, res) => {
  try {
    const plots = await Plot.find().populate('bookedBy', 'name email');
    res.json(plots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE plot
router.put('/:id', async (req, res) => {
  try {
    const updated = await Plot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('bookedBy', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE plot
router.delete('/:id', async (req, res) => {
  try {
    await Plot.findByIdAndDelete(req.params.id);
    res.json({ message: "Plot deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;