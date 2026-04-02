const express = require('express');
const router = express.Router();

// Static transport data for the city
const routes = [
  {
    id: 'r1',
    name: 'Route 1 – City Center ↔ Station',
    vehicleType: 'bus',
    stops: ['City Center', 'Gandhi Chowk', 'Main Market', 'Railway Station'],
    frequency: '15 min',
    operatingHours: '6:00 AM – 10:00 PM',
    color: '#f59e0b',
  },
  {
    id: 'r2',
    name: 'Route 2 – Hospital ↔ University',
    vehicleType: 'bus',
    stops: ['District Hospital', 'Civil Lines', 'College Square', 'University'],
    frequency: '20 min',
    operatingHours: '5:30 AM – 9:30 PM',
    color: '#3b82f6',
  },
  {
    id: 'r3',
    name: 'Route 3 – Airport Express',
    vehicleType: 'bus',
    stops: ['City Center', 'Hotel Zone', 'IT Park', 'Airport'],
    frequency: '30 min',
    operatingHours: '4:00 AM – 11:00 PM',
    color: '#10b981',
  },
  {
    id: 'r4',
    name: 'Taxi – City Zone',
    vehicleType: 'taxi',
    stops: ['Any pickup – Any drop'],
    frequency: 'On demand',
    operatingHours: '24/7',
    color: '#f97316',
  },
  {
    id: 'r5',
    name: 'Auto Rickshaw – Market Loop',
    vehicleType: 'rickshaw',
    stops: ['Old Market', 'Cloth Market', 'Vegetable Mandi', 'Bus Stand'],
    frequency: 'On demand',
    operatingHours: '6:00 AM – 9:00 PM',
    color: '#8b5cf6',
  },
  {
    id: 'r6',
    name: 'Auto Rickshaw – Station Road',
    vehicleType: 'rickshaw',
    stops: ['Railway Station', 'Hotel Road', 'Hospital', 'Bus Depot'],
    frequency: 'On demand',
    operatingHours: '5:00 AM – 10:00 PM',
    color: '#ec4899',
  },
];

const stops = [
  'City Center', 'Gandhi Chowk', 'Main Market', 'Railway Station',
  'District Hospital', 'Civil Lines', 'College Square', 'University',
  'Hotel Zone', 'IT Park', 'Airport', 'Old Market', 'Cloth Market',
  'Vegetable Mandi', 'Bus Stand', 'Station Road', 'Hotel Road', 'Bus Depot',
  'Sector 1', 'Sector 5', 'Sector 10', 'Ring Road', 'Inner Circle',
];

router.get('/routes', (req, res) => {
  const { type } = req.query;
  if (type) return res.json(routes.filter((r) => r.vehicleType === type));
  res.json(routes);
});

router.get('/stops', (req, res) => {
  res.json(stops);
});

router.get('/vehicles', (req, res) => {
  const { type } = req.query;
  const vehicles = [
    { id: 'bus-001', type: 'bus', route: 'Route 1', driver: 'Ramesh K.', plateNo: 'MH-31-AB-1234', rating: 4.5, capacity: 40, passengers: 28 },
    { id: 'bus-002', type: 'bus', route: 'Route 2', driver: 'Suresh M.', plateNo: 'MH-31-CD-5678', rating: 4.2, capacity: 40, passengers: 15 },
    { id: 'bus-003', type: 'bus', route: 'Route 3', driver: 'Pradeep T.', plateNo: 'MH-31-EF-9012', rating: 4.7, capacity: 40, passengers: 32 },
    { id: 'taxi-001', type: 'taxi', route: 'City Zone', driver: 'Ajay P.', plateNo: 'MH-31-GH-3456', rating: 4.8, capacity: 4, passengers: 2 },
    { id: 'taxi-002', type: 'taxi', route: 'Airport', driver: 'Vijay S.', plateNo: 'MH-31-IJ-7890', rating: 4.6, capacity: 4, passengers: 0 },
    { id: 'rickshaw-001', type: 'rickshaw', route: 'Market Loop', driver: 'Mohan L.', plateNo: 'MH-31-KL-1122', rating: 4.3, capacity: 3, passengers: 1 },
    { id: 'rickshaw-002', type: 'rickshaw', route: 'Station Road', driver: 'Ravi D.', plateNo: 'MH-31-MN-3344', rating: 4.4, capacity: 3, passengers: 0 },
  ];
  if (type) return res.json(vehicles.filter((v) => v.type === type));
  res.json(vehicles);
});

module.exports = router;
