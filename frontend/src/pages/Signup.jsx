import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      toast.success('Account created! Welcome to PixelPDF 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  const onChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }))
  }

  const passwordStrength = () => {
    const p = form.password
    if (!p) return 0
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = passwordStrength()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength]
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-500'][strength]

  const perks = ['Unlimited conversions', 'Conversion history', 'Priority processing', 'No watermarks']

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-brand-400/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-400/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl shadow-brand-500/10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <HiSparkles className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                Pixel<span className="gradient-text">PDF</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-white" style={{ fontSize: '10px' }} />
                </div>
                {p}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="John Doe"
                  className={`input-field pl-11 ${errors.name ? 'border-red-400' : ''}`}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  placeholder="you@example.com"
                  className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange('password')}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-11 pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength >= 3 ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {strengthLabel} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={onChange('confirm')}
                  placeholder="Re-enter password"
                  className={`input-field pl-11 ${errors.confirm ? 'border-red-400' : form.confirm && form.confirm === form.password ? 'border-emerald-400' : ''}`}
                  autoComplete="new-password"
                />
                {form.confirm && form.confirm === form.password && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <FiCheck className="text-white text-xs" />
                  </div>
                )}
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Free Account <FiArrowRight /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
