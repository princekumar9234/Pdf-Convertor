# PixelPDF — Image to PDF Converter SaaS

A full-stack, production-ready **Image to PDF Converter** SaaS application built with the MERN stack.

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite) + **Tailwind CSS**
- **Framer Motion** — animations & drag to reorder
- **React Dropzone** — drag & drop upload
- **React Router** — routing & protected pages
- **Axios** — API requests with JWT interceptors
- **React Hot Toast** — notifications

### Backend
- **Node.js** + **Express.js**
- **Multer** — file upload handling
- **PDFKit** — PDF generation
- **Sharp** — image compression & optimization
- **MongoDB** + **Mongoose**
- **JWT** + **bcryptjs** — authentication
- **Helmet**, **Rate Limit**, **CORS** — security

---

## 📁 Project Structure

```
PDF-Convertor/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── convertController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Conversion.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── convertRoutes.js
│   ├── services/pdfService.js
│   ├── utils/
│   │   ├── fileUtils.js
│   │   └── generateToken.js
│   ├── uploads/
│   │   ├── temp/
│   │   └── output/
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── DropZone.jsx
    │   │   ├── ImageCard.jsx
    │   │   ├── GuestLimitModal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Convert.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `.env` (already created):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pdf-convertor
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | None | Register user |
| POST | `/api/auth/login` | None | Login user |
| GET | `/api/auth/me` | JWT | Get profile |
| POST | `/api/convert` | Optional | Convert images to PDF |
| GET | `/api/download/:filename` | None | Download PDF |
| GET | `/api/user/conversions` | JWT | Conversion history |
| GET | `/api/health` | None | Health check |

---

## ✨ Features

### Converter
- Drag & drop image upload (JPG, PNG, WebP)
- Multiple images → multi-page PDF
- **Drag to reorder** pages (Framer Motion)
- Rotate images (90°, 180°, 270°)
- Remove individual images
- Page size: A4, Letter, Legal, Auto
- Margin control (0–50pt)
- Image compression toggle

### Authentication
- JWT-based signup/login
- Protected dashboard route
- Password strength meter on signup
- Persistent auth via localStorage

### Usage Limits
- **3 free conversions** without login
- Modal prompts guest users to sign up after 3 uses
- **Unlimited conversions** for logged-in users

### UI/UX
- 🌙 Dark / ☀️ Light mode toggle
- Glassmorphism cards
- Smooth animations (Framer Motion)
- Fully responsive (mobile-first)
- Toast notifications
- Upload progress bar

### Security
- Helmet security headers
- Rate limiting (100 req/15min general, 20 conversions/hr)
- File type validation (only JPG, PNG, WebP)
- 20MB per file limit, max 20 files
- Files auto-deleted after 24 hours
- Path traversal protection on download

---

## 🔧 MongoDB Atlas (Production)

Replace `MONGO_URI` in `.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pdf-convertor
```
