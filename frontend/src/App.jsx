import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Convert from './pages/Convert'
import PdfToImage from './pages/PdfToImage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="relative min-h-screen">
            <Navbar />

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/convert" element={<Convert />} />
              <Route path="/pdf-to-image" element={<PdfToImage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center text-center p-4">
                    <div>
                      <h1 className="font-display font-bold text-8xl gradient-text mb-4">404</h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </div>
                }
              />
            </Routes>

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg, #1f2937)',
                  color: '#f3f4f6',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                },
                success: {
                  iconTheme: { primary: '#6366f1', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
