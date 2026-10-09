# Pitch Vault

Pitch Vault is a platform where startup founders publish short video pitches and connect with investors. Founders can upload pitch videos, specify their fundraising targets, and manage their listings. Investors can discover startups, filter by industry category and stage, and vote on pitches.

## Features

- Role-based authentication with distinct, immutable roles for founders and investors
- Video pitch uploads to Cloudinary with duration (up to 120 seconds) and file size limits (50MB)
- Discovery feed with keyword search, category filters, stage filters, and sorting by new, top, and trending
- Voting system supporting upvotes and downvotes with atomic counters and concurrency safety
- Pitch management allowing founders to create, edit, and delete their pitches
- Live video player on the landing page hero continuously playing the latest uploaded pitch
- Responsive 4-card video display for featured pitches
- Rate limiting on authentication, upload, and voting endpoints
- Automatic cleanup of temporary server files and Cloudinary assets on upload failures

## Technologies Used

- Backend: Node.js, Express 5, MongoDB, Mongoose, Multer, Cloudinary SDK, Zod, JSON Web Tokens (JWT), bcrypt
- Frontend: React 18, Vite, React Router 6, Axios, Tailwind CSS, Lucide React
- Security: Helmet, CORS, express-rate-limit

## Setup and Installation Instructions

### Prerequisites

- Node.js 18 or higher
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account for video storage

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Populate `.env` with your credentials:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/pitchvault
   ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_characters
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_characters
   REFRESH_TOKEN_EXPIRY=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

### Frontend Setup

1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Set the backend API URL:
   ```env
   VITE_API_URL=http://localhost:4000/api/v1
   ```

## How to Run the Application

1. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend API runs on `http://localhost:4000`.

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application runs on `http://localhost:5173`.

3. Open your browser and navigate to `http://localhost:5173`.

## AI Tool Used

Kiro

## AI Development Experience

Developing Pitch Vault with Kiro accelerated the initial scaffolding of the MERN architecture, schema definitions, and UI component creation. As the application grew, integration between the frontend and backend revealed several real-world edge cases that required close investigation and iterative prompt engineering. Specifically, ES module import order in Node.js, multipart form-data serialization quirks, and rate limiter interactions with validation failures required targeted corrections. Using Kiro helped quickly diagnose stack traces, refine Zod validation schemas, and iteratively restructure the frontend layout to meet strict responsive design constraints.

## Specific Tasks Where AI Was Used

1. **Rate Limiter Configuration and Error Recovery**:
   Configured `express-rate-limit` across authentication, pitch upload, and voting routes. Fixed an issue where validation failures (400 responses) counted toward the upload rate limit and locked users out with HTTP 429 status codes. Added `skipFailedRequests: true` and appropriate development thresholds so retrying invalid forms does not exhaust user quotas.

2. **Cloudinary ES Module Hoisting and Initialization Fix**:
   Resolved an initialization timing bug where Node.js hoisted ES module imports and executed `cloudinary.config()` before `dotenv.config()` loaded environment variables, leaving credentials undefined. Resolved this by importing `dotenv/config` at the root entrypoint and adding an `ensureConfig()` safety check before any upload or delete operation.

3. **Multipart Form-Data Validation and Zod Preprocessing**:
   Handled multipart payload parsing where Multer passes single checkbox values as strings rather than arrays, causing Zod array validations (`lookingFor`) to fail. Implemented `z.preprocess` helpers to convert single strings to arrays, parse numeric string inputs (`askAmountInr`, `equityOfferedBps`), and sanitize empty optional URL fields. Also added automated deletion of `req.file.path` staging files whenever validation fails.

4. **Component Development and Responsive UI Restyling**:
   Created and restyled React components across the application to match design specifications. Implemented a responsive top navigation bar with section scrolling, centered desktop layouts, and a landing page featuring a continuously playing recent pitch video feed and a 4-column featured pitches grid.
