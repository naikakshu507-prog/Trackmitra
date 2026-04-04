const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const transportRoutes = require('./routes/transport');
const fareRoutes = require('./routes/fare');

app.use('/api/auth', authRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/fare', fareRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/citymove';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('⚠️ MongoDB not connected (running in demo mode):', err.message));

// Socket.IO: Real-time vehicle location simulation
const vehicleLocations = {};

const vehicles = [
  { id: 'bus-001', type: 'bus', route: 'Route 1', driver: 'Ramesh K.' },
  { id: 'bus-002', type: 'bus', route: 'Route 2', driver: 'Suresh M.' },
  { id: 'taxi-001', type: 'taxi', route: 'City Center', driver: 'Ajay P.' },
  { id: 'taxi-002', type: 'taxi', route: 'Airport', driver: 'Vijay S.' },
  { id: 'rickshaw-001', type: 'rickshaw', route: 'Market Loop', driver: 'Mohan L.' },
  { id: 'rickshaw-002', type: 'rickshaw', route: 'Station Road', driver: 'Ravi D.' },
];

const baseCoords = { lat: 21.1458, lng: 79.0882 };

vehicles.forEach((v) => {
  vehicleLocations[v.id] = {
    ...v,
    lat: baseCoords.lat + (Math.random() - 0.5) * 0.05,
    lng: baseCoords.lng + (Math.random() - 0.5) * 0.05,
    speed: Math.floor(Math.random() * 30) + 10,
    passengers: Math.floor(Math.random() * 20),
    status: 'active',
    eta: Math.floor(Math.random() * 15) + 3,
  };
});

setInterval(() => {
  vehicles.forEach((v) => {
    const loc = vehicleLocations[v.id];
    loc.lat += (Math.random() - 0.5) * 0.001;
    loc.lng += (Math.random() - 0.5) * 0.001;
    loc.speed = Math.floor(Math.random() * 40) + 5;
    loc.eta = Math.max(1, loc.eta - 1 + Math.floor(Math.random() * 3));
    io.emit('vehicleUpdate', loc);
  });
}, 3000);

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.emit('allVehicles', Object.values(vehicleLocations));

  socket.on('requestRoute', (data) => {
    const { from, to, vehicleType } = data;
    const routeData = generateRoute(from, to, vehicleType);
    socket.emit('routeData', routeData);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

function generateRoute(from, to, vehicleType) {
  const dist = (Math.random() * 15 + 2).toFixed(1);
  const fareRates = { bus: 1.5, taxi: 12, rickshaw: 8 };
  const rate = fareRates[vehicleType] || 8;
  const fare = (dist * rate).toFixed(0);
  const timeMin = vehicleType === 'bus' ? dist * 3.5 : dist * 2.2;
  return {
    from,
    to,
    vehicleType,
    distance: dist,
    estimatedTime: Math.round(timeMin),
    fare: parseInt(fare),
    minFare: Math.round(fare * 0.9),
    maxFare: Math.round(fare * 1.1),
    stops: Math.floor(dist / 1.5),
  };
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { io };