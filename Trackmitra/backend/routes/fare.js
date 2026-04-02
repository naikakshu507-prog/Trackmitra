const express = require('express');
const router = express.Router();

// Fare calculation endpoint
router.post('/calculate', (req, res) => {
  const { from, to, vehicleType, distance } = req.body;

  const fareConfig = {
    bus: { base: 5, perKm: 1.5, minFare: 5, maxFare: 50, unit: 'Fixed Route' },
    taxi: { base: 30, perKm: 12, minFare: 30, maxFare: 500, unit: 'Metered' },
    rickshaw: { base: 15, perKm: 8, minFare: 15, maxFare: 200, unit: 'Negotiable' },
  };

  const config = fareConfig[vehicleType] || fareConfig.rickshaw;
  const dist = distance || (Math.random() * 10 + 2).toFixed(1);
  const baseFare = config.base + parseFloat(dist) * config.perKm;
  const fare = Math.min(Math.max(baseFare, config.minFare), config.maxFare);
  const timeMin = vehicleType === 'bus' ? dist * 3 : dist * 2;

  res.json({
    from: from || 'Your Location',
    to: to || 'Destination',
    vehicleType,
    distance: parseFloat(dist),
    estimatedTime: Math.round(timeMin),
    fare: Math.round(fare),
    minFare: Math.round(fare * 0.9),
    maxFare: Math.round(fare * 1.15),
    fareType: config.unit,
    breakdown: {
      baseFare: config.base,
      distanceCharge: Math.round(parseFloat(dist) * config.perKm),
      total: Math.round(fare),
    },
    paymentMethods: ['Cash', 'UPI', 'Card'],
  });
});

// Get fare table
router.get('/table', (req, res) => {
  res.json({
    bus: { base: '₹5', perKm: '₹1.5/km', minFare: '₹5', description: 'Fixed route pricing' },
    taxi: { base: '₹30', perKm: '₹12/km', minFare: '₹30', description: 'Metered fare + waiting charges' },
    rickshaw: { base: '₹15', perKm: '₹8/km', minFare: '₹15', description: 'Negotiable, approx pricing' },
  });
});

module.exports = router;
