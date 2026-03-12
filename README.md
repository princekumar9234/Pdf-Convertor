# PixelPDF — Ultimate PDF Toolkit SaaS

A professional, full-stack **PDF Toolkit** SaaS application built with the MERN stack. Features **Image to PDF** and **PDF to Image** utilities with a premium glassmorphic UI.

## 🚀 Demo & Tech Stack

### Frontend
- **React.js** (Vite) + **Tailwind CSS**
- **Framer Motion** — smooth animations & reordering
- **React Dropzone** — sophisticated file uploads
- **React Icons** — modern UI icons
- **Axios** — interceptors for JWT & progress tracking

### Backend
- **Node.js** + **Express.js**
- **PDFKit** — PDF generation from images
- **pdf-to-img** — high-quality PDF to image extraction
- **Sharp** — high-performance image processing
- **Adm-zip** — ZIP archiving for bulk downloads
- **MongoDB** + **Mongoose**
- **JWT** + **bcryptjs** — secure authentication
- **Helmet**, **Rate Limit**, **CORS** — production security

---

## ✨ Features

### 🛠️ PDF Tools
- **Image to PDF**:
  - Drag & drop (JPG, PNG, WebP)
  - Drag to reorder pages
  - Rotate & remove images
  - Custom page sizes (A4, Letter, Legal, Auto), margins, and compression.
- **PDF to Image**:
  - Extract pages to high-quality PNG or JPG
  - Individual page preview & download
  - Bulk download as a ZIP archive.

### 🔐 Authentication & Usage
- **Guest Access**: Limit of 3 free conversions per hour for visitors.
- **User Accounts**: Unlimited conversions and persistent history dashboard.
- **Security**: Files are automatically cleaned up every hour and deleted after 24 hours.

### 🎨 UI/UX
- Premium **Glassmorphism** design.
- Full **Dark/Light Mode** support.
- Fully **Responsive** (Mobile, Tablet, Desktop).
- Real-time conversion progress bars.

---

## ⚙️ Setup Instructions

### 1. Installation
```bash
# Install root dependencies
npm install

# Install sub-project dependencies
npm run build # This will run install & build the frontend
```

### 2. Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### 3. Running Locally
Run both frontend and backend with a single command:
```bash
npm run dev
```

---

## 🌍 Deployment

This project is prepared for **One-Click Deployment** to platforms like **Render**, **Heroku**, or **Vercel**.

### Recommended Deployment (Render)
1. **New Web Service**: Connect your GitHub repository.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Add your `MONGO_URI`, `JWT_SECRET`, and set `NODE_ENV` to `production`.

### File Serving Logic
In production, the backend automatically performs the following:
- Serves the compiled React frontend from `frontend/dist`.
- Handles all API requests via `/api/*`.
- Correctly routes all non-API requests back to the React app for client-side routing.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/convert` | Image to PDF conversion |
| POST | `/api/pdf-to-image` | PDF to Image extraction |
| GET | `/api/download/:fn` | Unified download (PDF/ZIP) |
| GET | `/api/temp/:fn` | Temporary image preview |
| GET | `/api/health` | API Health Check |

---

## 👨‍💻 Author
[Prince Kumar](https://github.com/princekumar9234)
