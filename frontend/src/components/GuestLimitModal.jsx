import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

export default function GuestLimitModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-card rounded-3xl p-8 shadow-2xl shadow-brand-500/10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 btn-ghost w-8 h-8 rounded-full p-0 flex items-center justify-center"
              >
                <FiX size={16} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-brand-500/30">
                    <HiSparkles className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
                    <FiAlertCircle className="text-white text-xs" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                  Free Limit Reached
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  You've used your <span className="font-semibold text-brand-600 dark:text-brand-400">3 free conversions</span>.
                  Create a free account to get unlimited PDF conversions!
                </p>
              </div>

              {/* Features list */}
              <div className="bg-brand-50 dark:bg-brand-950/30 rounded-2xl p-4 mb-6 space-y-2">
                {['Unlimited PDF conversions', 'Conversion history & re-downloads', 'Priority processing', 'No watermarks'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Link to="/signup" onClick={onClose} className="btn-primary w-full justify-center text-base py-3.5">
                  Create Free Account
                </Link>
                <Link to="/login" onClick={onClose} className="btn-secondary w-full justify-center text-sm">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
