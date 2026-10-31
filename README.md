# ResQNow – AI-Powered Emergency Response & Assistance Platform (MERN Stack)

ResQNow is a full-stack emergency response and assistance web application built with the **MERN** stack (MongoDB, Express, React, Node.js), powered by Google Gemini AI and browser Geolocation.

---

## 🏗️ Project Architecture

The codebase is organized into two clearly separated applications:

```text
resqnow/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable emergency UI components
│   │   │   ├── AIChat.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── DemoBanner.tsx
│   │   │   ├── EmergencyCard.tsx
│   │   │   ├── EmergencyContactCard.tsx
│   │   │   ├── EmergencyHistory.tsx
│   │   │   ├── IncidentForm.tsx
│   │   │   ├── LocationCard.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SOSButton.tsx
│   │   │   └── ...
│   │   ├── context/            # Global React Context providers
│   │   │   ├── AuthContext.tsx       # JWT & User profile state
│   │   │   └── EmergencyContext.tsx  # SOS state, contacts, history
│   │   ├── pages/              # App views / routes
│   │   │   ├── Assistant.tsx   # ResQ AI Guidance (Gemini 2.5 Flash)
│   │   │   ├── Contacts.tsx    # Guardian management
│   │   │   ├── Dashboard.tsx   # Command center
│   │   │   ├── Emergency.tsx   # SOS dispatch interface
│   │   │   ├── History.tsx     # Incident audit logs
│   │   │   ├── Landing.tsx     # Public landing page
│   │   │   ├── Login.tsx       # JWT Authentication
│   │   │   ├── NearbyHelp.tsx  # ERs, police & fire stations
│   │   │   ├── Profile.tsx     # Medical ID & blood type
│   │   │   ├── Register.tsx    # User onboarding
│   │   │   └── Report.tsx      # Incident photo & logging
│   │   ├── services/           # Centralized Axios client & services
│   │   │   ├── api.ts          # Centralized Axios instance with JWT interceptor
│   │   │   ├── geminiService.ts# AI client calling backend API
│   │   │   ├── locationService.ts # Geolocation sensor
│   │   │   └── mapsService.ts  # Distance & routing helpers
│   │   ├── types/              # TypeScript models
│   │   ├── App.tsx             # Route definitions
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Tailwind CSS
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Me (bcrypt + JWT)
│   │   ├── emergencyController.js  # SOS alert management
│   │   ├── contactController.js    # CRUD emergency guardians
│   │   ├── incidentController.js   # Incident reports
│   │   └── userController.js       # Medical profile management
│   ├── middleware/
│   │   ├── authMiddleware.js       # Bearer JWT verification
│   │   └── errorMiddleware.js      # Global error and 404 handlers
│   ├── models/
│   │   ├── User.js                 # Mongoose User model
│   │   ├── Emergency.js            # Mongoose Emergency alert model
│   │   ├── EmergencyContact.js     # Mongoose Contact model
│   │   └── Incident.js             # Mongoose Incident report model
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── userRoutes.js           # /api/users
│   │   ├── emergencyRoutes.js      # /api/emergencies
│   │   ├── contactRoutes.js        # /api/contacts
│   │   ├── incidentRoutes.js       # /api/incidents
│   │   └── aiRoutes.js             # /api/ai
│   ├── services/
│   │   └── geminiService.js        # Server-side Google Gemini 2.5 Flash SDK
│   ├── server.js                   # Express application setup
│   └── package.json
│
├── README.md
├── package.json                # Root orchestration
└── server.ts                   # Fullstack dev runner (port 3000)
```

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- **MongoDB Atlas** account (free cluster works great)
- **Google AI Studio API Key** (for Gemini AI assistance)

---

## 🍃 MongoDB Atlas Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free **M0 Sandbox Cluster**.
3. Under **Security > Database Access**, create a user with read/write privileges (e.g., `resquser`).
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) or whitelist your server IP.
5. In your cluster dashboard, click **Connect > Drivers > Node.js**.
6. Copy the connection string and replace `<password>` with your database password:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/resqnow?retryWrites=true&w=majority
   ```

*Note: If no MongoDB URI is supplied, ResQNow automatically falls back to an in-memory resilient store so you can immediately demo and test the platform.*

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resqnow?retryWrites=true&w=majority
JWT_SECRET=resqnow_super_secure_jwt_secret_change_in_production_2026
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Frontend (`client/.env`)
```env
# Relative /api when using dev proxy or unified server; or specify backend URL
VITE_API_URL=/api
```

---

## 🚀 Installation & Running

### Option 1: Unified Development Server (Port 3000)

Run the full-stack development server with Vite middleware mounted directly onto Express:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Option 2: Running Client and Server Separately

#### 1. Backend Server
```bash
cd server
npm install
npm start
```
The backend API starts on [http://localhost:5000](http://localhost:5000).

#### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
The client starts on [http://localhost:5173](http://localhost:5173) and proxies `/api` calls to `http://localhost:5000`.

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with bcrypt hashing | No |
| `POST` | `/api/auth/login` | Login user and issue JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer JWT |

### User Profile (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/profile` | Get medical ID and details | Bearer JWT |
| `PUT` | `/api/users/profile` | Update medical ID, blood type, notes | Bearer JWT |

### Emergency SOS (`/api/emergencies`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/emergencies` | Create emergency SOS alert with coordinates | Bearer JWT |
| `GET` | `/api/emergencies` | Retrieve SOS alert history | Bearer JWT |
| `GET` | `/api/emergencies/:id` | Get specific emergency details | Bearer JWT |
| `PATCH`| `/api/emergencies/:id` | Update emergency status (e.g., Resolved) | Bearer JWT |

### Emergency Contacts (`/api/contacts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/contacts` | List user's trusted emergency contacts | Bearer JWT |
| `POST` | `/api/contacts` | Create a new emergency contact | Bearer JWT |
| `PUT` | `/api/contacts/:id` | Update contact information | Bearer JWT |
| `DELETE`| `/api/contacts/:id`| Remove emergency contact | Bearer JWT |

### Incident Reports (`/api/incidents`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/incidents` | Submit incident report with AI classification | Bearer JWT |
| `GET` | `/api/incidents` | List user incident reports | Bearer JWT |
| `GET` | `/api/incidents/:id` | Get single incident report | Bearer JWT |

### Gemini AI Assistance (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/chat` | Conversational first-aid & scene safety guidance | No |
| `POST` | `/api/ai/classify` | AI incident classification & checklist generation | No |
| `POST` | `/api/ai/analyze-image`| Multimodal photo hazard inspection | No |

---

## 🤖 Google Gemini AI Setup

ResQNow uses Google's latest `@google/genai` TypeScript/JavaScript SDK with the `gemini-3.8-flash` model.

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `server/.env` under `GEMINI_API_KEY`.
3. **Security Principle**: All Gemini API requests are executed strictly on the Express backend (`server/services/geminiService.js`). The API key is **never** sent to the client browser.

---

## 🗺️ Google Maps Setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Maps JavaScript API** and **Places API**.
3. Create an API key with HTTP referrer restrictions.
4. Add the key to `server/.env` as `GOOGLE_MAPS_API_KEY`.

---

## 🛡️ Security & Truthful Dispatch Guarantee

1. **Password Protection**: Passwords are never stored in plaintext; they are hashed with `bcryptjs` using 10 salt rounds.
2. **JWT Security**: Protected routes require a valid Bearer token checked via `authMiddleware.js`.
3. **No False Dispatch Claims**: ResQNow clearly indicates that emergency requests are recorded in the database and explicitly prompts users to dial 911 / 112 directly if they are in life-threatening peril.
