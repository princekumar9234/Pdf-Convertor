import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiChevronDown, FiImage, FiFileText } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setUserMenu(false)
    setToolsOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const mainLinks = [
    { label: 'Home', to: '/' },
    ...(isAuthenticated ? [{ label: 'Dashboard', to: '/dashboard' }] : []),
  ]

  const toolLinks = [
    { label: 'Image to PDF', to: '/convert', Icon: FiImage },
    { label: 'PDF to Image', to: '/pdf-to-image', Icon: FiFileText },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
              <HiSparkles className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Pixel<span className="gradient-text">PDF</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center gap-1 transition-all">
                Tools <FiChevronDown className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="w-56 glass-card rounded-2xl shadow-xl p-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
                      {toolLinks.map((tool) => (
                        <Link 
                          key={tool.to}
                          to={tool.to} 
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/30 text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-all group"
                        >
                          <tool.Icon className="text-brand-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{tool.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost w-9 h-9 rounded-lg p-0 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 truncate">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl p-2 shadow-xl z-50"
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                      <Link
                        to="/dashboard"
                        className="btn-ghost w-full justify-start rounded-xl text-sm"
                        onClick={() => setUserMenu(false)}
                      >
                        <FiGrid size={16} /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn-ghost w-full justify-start rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <FiLogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost w-9 h-9 rounded-lg p-0 flex items-center justify-center">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn-ghost w-9 h-9 rounded-lg p-0 flex items-center justify-center"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl"
          >
            <div className="container-custom py-4 space-y-1">
              <Link to="/" className="block px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300">Home</Link>
              
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest pt-4">Tools</div>
              {toolLinks.map((tool) => {
                const Icon = tool.Icon;
                return (
                  <Link
                    key={tool.to}
                    to={tool.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      location.pathname === tool.to
                        ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} className="text-brand-500" /> {tool.label}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    location.pathname === '/dashboard'
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiGrid size={18} className="text-brand-500" /> Dashboard
                </Link>
              )}

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium flex items-center gap-2"
                    >
                      <FiLogOut size={16} /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 p-2">
                    <Link to="/login" className="btn-ghost w-full justify-center">Sign in</Link>
                    <Link to="/signup" className="btn-primary w-full justify-center">Get Started Free</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for user menu */}
      {userMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
      )}
    </motion.nav>
  )
}
