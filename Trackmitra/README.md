# 🏙️ CityMove — Real-Time City Transport Tracker

A full-stack web app for tracking **buses, taxis and auto rickshaws** in real-time with live maps, fare calculator, route finder and user authentication.

---

## 📁 Project Structure

```
real-time-tracking/
├── backend/          ← Node.js + Express + Socket.IO
│   ├── models/       ← MongoDB user model
│   ├── routes/       ← API routes (auth, transport, fare)
│   ├── middleware/   ← JWT auth middleware
│   ├── server.js     ← Main server + Socket.IO
│   └── .env          ← Config (port, MongoDB URI, JWT secret)
├── frontend/         ← React app
│   ├── src/
│   │   ├── pages/    ← Landing, Login, Register, Dashboard, Track, Routes, Fare, Profile
│   │   ├── components/ ← Sidebar, AppLayout
│   │   ├── context/  ← AuthContext
│   │   └── App.js
│   └── public/
└── README.md
```

---

## 🚀 Setup Instructions

### Step 1 — Install dependencies

Open **two terminals** in VS Code.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

---

### Step 2 — Start the Backend

In **Terminal 1:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
⚠️  MongoDB not connected (running in demo mode)
```

> ✅ MongoDB is **optional** — the app works fully in demo mode without it.

---

### Step 3 — Start the Frontend

In **Terminal 2:**
```bash
cd frontend
npm start
```

The React app will open at **http://localhost:3000**

---

## 🌐 Features

| Feature | Description |
|---|---|
| 🔐 User Auth | Register / Login with JWT tokens |
| 🗺️ Live Map | OpenStreetMap with real-time vehicle markers |
| 📍 Vehicle Tracking | Bus, taxi, rickshaw positions update every 3 seconds |
| 🔍 Route Planner | Pick start & end, get ETA and fare instantly |
| 💰 Fare Calculator | Compare prices across all vehicle types |
| 🗺️ Routes Page | Full city route list with stops |
| 👤 Profile | Search history, saved routes, settings |

---

## 🔧 Configuration

Edit `backend/.env` to change:
- `PORT` — default 5000
- `MONGO_URI` — add your MongoDB Atlas URI for persistent user data
- `JWT_SECRET` — change for production

---

## 🛢️ MongoDB (Optional)

Without MongoDB the app runs in **in-memory mode** (users are lost on restart).

To add MongoDB:
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Copy your connection string into `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/citymove
   ```

---

## 📦 Tech Stack

- **Frontend:** React 18, React Router 6, React-Leaflet, Socket.IO Client, Axios
- **Backend:** Node.js, Express, Socket.IO, JWT, bcryptjs, Mongoose
- **Map:** OpenStreetMap via Leaflet
- **Fonts:** Syne + DM Sans (Google Fonts)

---

## 💡 Demo Login

After registering any account, or use:
- Email: `demo@citymove.in`
- Password: `demo123`

> Note: In demo mode (no MongoDB), you must register first each session.
