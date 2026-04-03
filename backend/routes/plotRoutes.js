const express = require('express');
const router = express.Router();
const Plot = require('../models/Plot');

router.post('/', async (req, res) => {
  try {
    const plot = new Plot(req.body);
    const saved = await plot.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const plots = await Plot.find();
  res.json(plots);
});

router.put('/:id', async (req, res) => {
  const updated = await Plot.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Plot.findByIdAndDelete(req.params.id);
  res.json({ message: "Plot deleted" });
});

module.exports = router;