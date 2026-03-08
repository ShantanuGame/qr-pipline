# ⬡ QRTrack — Production Batch Tracking System

```
  ██████  ██████  ████████ ██████   █████   ██████ ██   ██
 ██    ██ ██   ██    ██    ██   ██ ██   ██ ██      ██  ██
 ██    ██ ██████     ██    ██████  ███████ ██      █████
 ██ ▄▄ ██ ██   ██    ██    ██   ██ ██   ██ ██      ██  ██
  ██████  ██   ██    ██    ██   ██ ██   ██  ██████ ██   ██
     ▀▀
```

> *Log it. Scan it. Track it. Every batch. Every time.*

---

## ✦ What is this?

**QRTrack** is a lean, fast, production-floor batch tracking system built for real work.

You fill in a form. It saves to MongoDB. It spits out a QR code.
Someone scans that QR from their phone — they see everything.
No apps. No logins. No nonsense.

That's it. That's the whole thing.

---

## ✦ The Stack

| Layer | Tech |
|-------|------|
| 🐍 Backend | FastAPI + Python |
| ⚛️ Frontend | React + Vite |
| 🍃 Database | MongoDB Atlas |
| 📦 QR Engine | `qrcode[pil]` |
| 🎨 Fonts | Outfit + DM Mono |

---

## ✦ Features

```
┌────────────────────────────────────────────┐
│  ⬡  Scanner animation on page load        │
│  ⚠  Hardware scanner error simulation     │
│  ⬡  Manual QR generation fallback         │
│  ✓  Instant QR code on save               │
│  ↓  Download QR as PNG                     |                      
│  📊  Full history table with timestamps   │
│  🔍  One-click batch detail view          │
│  📱  Scan from any device, any camera     │
└────────────────────────────────────────────┘
```

---

## ✦ Tracked Parameters

Every batch entry captures:

- `Batch No.` — unique identifier for the production batch
- `Parent ID` — reference to the parent production order
- `Lot No.` — lot number for traceability
- `Balls` — quantity of balls
- `Roller with Roller Cages` — roller assembly count
- `Balls Cages` — ball cage count
- `Timestamp` — auto-recorded date & time of entry

---

## ✦ Project Structure

```
Project/
├── backend/
│   ├── main.py           ← FastAPI app, all routes
│   ├── requirements.txt  ← Python dependencies
│   └── .env              ← MongoDB URI + config
│
└── frontend/
    ├── index.html
    ├── vite.config.js    ← Dev server + proxy config
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx        ← Routing
        ├── api.js         ← Axios calls to backend
        ├── index.css      ← Full design system
        └── pages/
            ├── LandingPage.jsx   ← Marketing home
            ├── FormPage.jsx      ← Batch entry + QR
            ├── HistoryPage.jsx   ← All records table
            └── ViewPage.jsx      ← Scanned QR view
```

---

## ✦ Getting Started

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/qrtrack.git
cd qrtrack
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create your `.env` file:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
uvicorn main:app --reload --port 8000 --host 127.0.0.1
```

✅ API docs available at: `http://127.0.0.1:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ App runs at: `http://localhost:5173`

---

## ✦ API Endpoints

```
POST   /api/batches          →  Create batch + generate QR
GET    /api/batches          →  Fetch all batches (newest first)
GET    /api/batches/{id}     →  Fetch single batch by ID
GET    /api/batches/{id}/qr  →  Regenerate QR for existing batch
```

### Sample POST body

```json
{
  "batch_no": "BT-2024-001",
  "parent_id": "PR-XYZ-100",
  "lot_no": "LT-00045",
  "balls": 12,
  "roller_with_roller_cages": 6,
  "balls_cages": 4
}
```

---

## ✦ The QR Flow

```
  [ Fill Form ]
       │
       ▼
  [ Scanner Animation ]  ──── 1.5s ────▶  [ ⚠ Scanner Not Connected ]
                                                      │
                                          [ Generate QR Manually ]
                                                      │
                                                      ▼
                                          [ ⬡ Generating... ]
                                                      │
                                                      ▼
                                          [ ✓ Scan Complete! ]
                                          [ QR Code + Details ]
```

---

## ✦ Network Access (Local WiFi)

To scan QR codes from another device on the same WiFi:

```bash
# Find your local IP
ipconfig          # Windows
ifconfig          # Mac/Linux

# Start frontend with network access
npm run dev -- --host

# Start backend on all interfaces
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

Update `.env`:
```env
FRONTEND_URL=http://192.168.X.X:5173
```

---

## ✦ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | — |
| `FRONTEND_URL` | URL where frontend is hosted | `http://localhost:5173` |

---

## ✦ Dependencies

### Backend (`requirements.txt`)
```
fastapi
uvicorn[standard]
pymongo
qrcode[pil]
python-dotenv
```

### Frontend (`package.json`)
```
react
react-dom
react-router-dom
axios
vite
```

---

## ✦ Database Schema

```json
{
  "_id": "ObjectId",
  "batch_no": "string",
  "parent_id": "string",
  "lot_no": "string",
  "balls": "number",
  "roller_with_roller_cages": "number",
  "balls_cages": "number",
  "created_at": "datetime"
}
```

MongoDB database: `batchtracker`
Collection: `batches`

---

## ✦ Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing home with live batch count |
| `/new` | New Batch | Form entry with QR animation flow |
| `/history` | History | Full records table with timestamps |
| `/view/:id` | View | Public batch detail page (QR target) |

---

```
  built with ⬡ by your team
  powered by FastAPI × React × MongoDB
```
